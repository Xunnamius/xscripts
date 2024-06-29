import { isNativeError } from 'node:util/types';

import clone from 'lodash.clone';
import cloneDeepWith from 'lodash.clonedeepwith';
import isEqual from 'lodash.isequal';

import {
  CliError,
  FrameworkExitCode,
  isCliError,
  type Arguments,
  type Configuration
} from '@black-flag/core';

import {
  CommandNotImplementedError,
  type EffectorProgram,
  type ExecutionContext,
  type FrameworkArguments
} from '@black-flag/core/util';

import { createDebugLogger } from 'multiverse/rejoinder';

import { ErrorMessage, type KeyValueEntry } from './error';
import { $exists, $genesis } from './symbols';

import type {
  Entries,
  LiteralUnion,
  OmitIndexSignature,
  Promisable,
  StringKeyOf
} from 'type-fest';

const globalDebuggerNamespace = '@black-flag/extensions';

/**
 * Internal metadata derived from analysis of a {@link BfeBuilderObject}.
 */
type OptionsMetadata = {
  required: FlattenedExtensionValue[];
  conflicted: FlattenedExtensionValue[];
  implied: FlattenedExtensionValue[];
  implyLoosely: string[];
  demandedIf: FlattenedExtensionValue[];
  demanded: string[];
  demandedAtLeastOne: FlattenedExtensionValue[];
  demandedMutuallyExclusive: FlattenedExtensionValue[];
  optional: string[];
  defaults: Record<string, unknown>;
  checks: Record<
    string,
    NonNullable<
      BfeBuilderObjectValueExtensions<Record<string, unknown>, ExecutionContext>['check']
    >
  >;
};

/**
 * A flattened {@link BfeBuilderObjectValueExtensionObject} value type with
 * additional data (i.e. {@link $exists} values and {@link $genesis} keys).
 */
type FlattenedExtensionValue = Record<
  string,
  BfeBuilderObjectValueExtensionObject[string] | typeof $exists
> & { [$genesis]?: string };

/**
 * The function type of the `builder` export accepted by Black Flag.
 */
export type BfBuilderFunction<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = Extract<
  Configuration<CustomCliArguments, CustomExecutionContext>['builder'],
  // eslint-disable-next-line @typescript-eslint/ban-types
  Function
>;

/**
 * The object type of the `builder` export accepted by Black Flag.
 */
export type BfBuilderObject<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = Exclude<
  Configuration<CustomCliArguments, CustomExecutionContext>['builder'],
  // eslint-disable-next-line @typescript-eslint/ban-types
  Function
>;

/**
 * The object value type of a {@link BfBuilderObject}.
 *
 * Equivalent to `yargs.Options` as of yargs\@17.7.2.
 */
export type BfBuilderObjectValue<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = BfBuilderObject<CustomCliArguments, CustomExecutionContext>[string];

/**
 * The generic object value type of a {@link BfBuilderObject}.
 */
export type BfGenericBuilderObjectValue = BfBuilderObjectValue<
  Record<string, unknown>,
  ExecutionContext
>;

/**
 * A version of the object type of the `builder` export accepted by Black Flag
 * that supports BFE's additional functionality.
 */
export type BfeBuilderObject<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = {
  [key: string]: BfeBuilderObjectValue<CustomCliArguments, CustomExecutionContext>;
};

/**
 * The object value type of a {@link BfeBuilderObject}.
 */
export type BfeBuilderObjectValue<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = BfeBuilderObjectValueWithoutExtensions &
  BfeBuilderObjectValueExtensions<CustomCliArguments, CustomExecutionContext>;

/**
 * An object containing only those properties recognized by
 * BFE.
 *
 * This type + {@link BfeBuilderObjectValueWithoutExtensions} =
 * {@link BfeBuilderObjectValue}.
 */
export type BfeBuilderObjectValueExtensions<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = {
  /**
   * `requires` enables checks to ensure the specified arguments, or
   * argument-value pairs, are given conditioned on the existence of another
   * argument. For example:
   *
   * ```jsonc
   * {
   *   "x": { "requires": "y" }, // ◄ Disallows x without y
   *   "y": {}
   * }
   * ```
   */
  requires?: BfeBuilderObjectValueExtensionValue;
  /**
   * `conflicts` enables checks to ensure the specified arguments, or
   * argument-value pairs, are _never_ given conditioned on the existence of
   * another argument. For example:
   *
   * ```jsonc
   * {
   *   "x": { "conflicts": "y" }, // ◄ Disallows y if x is given
   *   "y": {}
   * }
   * ```
   */
  conflicts?: BfeBuilderObjectValueExtensionValue;
  /**
   * `demandThisOptionIf` enables checks to ensure an argument is given when at
   * least one of the specified groups of arguments, or argument-value pairs, is
   * also given. For example:
   *
   * ```jsonc
   * {
   *   "x": {},
   *   "y": { "demandThisOptionIf": "x" }, // ◄ Demands y if x is given
   *   "z": { "demandThisOptionIf": "x" } // ◄ Demands z if x is given
   * }
   * ```
   */
  demandThisOptionIf?: BfeBuilderObjectValueExtensionValue;
  /**
   * `demandThisOption` enables checks to ensure an argument is always given.
   * This is equivalent to `demandOption` from vanilla yargs. For example:
   *
   * ```jsonc
   * {
   *   "x": { "demandThisOption": true }, // ◄ Disallows ∅, y
   *   "y": { "demandThisOption": false }
   * }
   * ```
   */
  demandThisOption?: BfGenericBuilderObjectValue['demandOption'];
  /**
   * `demandThisOptionOr` enables non-optional inclusive disjunction checks per
   * group. Put another way, `demandThisOptionOr` enforces a "logical or"
   * relation within groups of required options. For example:
   *
   * ```jsonc
   * {
   *   "x": { "demandThisOptionOr": ["y", "z"] }, // ◄ Demands x or y or z
   *   "y": { "demandThisOptionOr": ["x", "z"] },
   *   "z": { "demandThisOptionOr": ["x", "y"] }
   * }
   * ```
   */
  demandThisOptionOr?: BfeBuilderObjectValueExtensionValue;
  /**
   * `demandThisOptionXor` enables non-optional exclusive disjunction checks per
   * exclusivity group. Put another way, `demandThisOptionXor` enforces mutual
   * exclusivity within groups of required options. For example:
   *
   * ```jsonc
   * {
   *   // ▼ Disallows ∅, z, w, xy, xyw, xyz, xyzw
   *   "x": { "demandThisOptionXor": ["y"] },
   *   "y": { "demandThisOptionXor": ["x"] },
   *   // ▼ Disallows ∅, x, y, zw, xzw, yzw, xyzw
   *   "z": { "demandThisOptionXor": ["w"] },
   *   "w": { "demandThisOptionXor": ["z"] }
   * }
   * ```
   */
  demandThisOptionXor?: BfeBuilderObjectValueExtensionValue;
  /**
   * `implies` will set a default value for the specified arguments conditioned
   * on the existence of another argument. If any of the specified arguments are
   * explicitly given, their values must match the specified argument-value
   * pairs respectively (which is the behavior of `requires`). For this reason,
   * `implies` only accepts one or more argument-value pairs and not raw
   * strings. For example:
   *
   * ```jsonc
   * {
   *   "x": { "implies": { "y": true } }, // ◄ x is now synonymous with xy
   *   "y": {}
   * }
   * ```
   *
   * For describing more complex implications, see `subOptionOf`.
   */
  implies?:
    | Exclude<BfeBuilderObjectValueExtensionValue, string | Array<unknown>>
    | Exclude<BfeBuilderObjectValueExtensionValue, string | Array<unknown>>[];
  /**
   * When `looseImplications` is set to `true`, any implied arguments, when
   * explicitly given on the command line, will _override_ their configured
   * implications instead of causing an error.
   *
   * @default false
   * @see {@link BfeBuilderObjectValueExtensions.implies}
   */
  looseImplications?: boolean;
  /**
   * `check` is the declarative option-specific version of vanilla yargs's
   * `yargs::check()`. Also supports async and promise-returning functions.
   *
   * This function receives the `currentArgumentValue`, which you are free to
   * type as you please, and the fully parsed `argv`. If this function throws,
   * the exception will bubble. If this function returns an instance of `Error`,
   * a string, or any non-truthy value (including `undefined` or not returning
   * anything), Black Flag will throw a `CliError` on your behalf.
   *
   * See [the
   * documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#check)
   * for details.
   */
  check?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentArgumentValue: any,
    argv: Arguments<CustomCliArguments, CustomExecutionContext>
  ) => Promisable<unknown>;
  /**
   * `subOptionOf` is declarative sugar around Black Flag's support for double
   * argument parsing, allowing you to describe the relationship between options
   * and the suboptions whose configurations they determine.
   *
   * See [the
   * documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#suboptionof)
   * for details.
   *
   * For describing simpler implicative relations, see `implies`.
   */
  subOptionOf?: Record<
    string,
    | BfeSubOptionOfExtensionValue<CustomCliArguments, CustomExecutionContext>
    | BfeSubOptionOfExtensionValue<CustomCliArguments, CustomExecutionContext>[]
  >;
  /**
   * `default` will set a default value for an argument. This is equivalent to
   * `default` from vanilla yargs.
   *
   * However, unlike vanilla yargs and Black Flag, this default value is applied
   * towards the end of BFE's execution, enabling its use alongside keys like
   * `conflicts`. See [the
   * documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#support-for-default-with-conflictsrequiresetc)
   * for details.
   */
  default?: unknown;
};

/**
 * The string/object/array type of a {@link BfeBuilderObjectValueExtensions}.
 *
 * This type is a superset of {@link BfeBuilderObjectValueExtensionObject}.
 */
export type BfeBuilderObjectValueExtensionValue =
  | string
  | BfeBuilderObjectValueExtensionObject
  | (string | BfeBuilderObjectValueExtensionObject)[];

/**
 * The object type of a {@link BfeBuilderObjectValueExtensions}.
 *
 * This type is a subset of {@link BfeBuilderObjectValueExtensionValue}.
 */
export type BfeBuilderObjectValueExtensionObject = Record<string, unknown>;

/**
 * An object containing a subset of only those properties recognized by
 * Black Flag (and, consequentially, vanilla yargs). Also excludes
 * properties that conflict with {@link BfeBuilderObjectValueExtensions} and/or
 * are deprecated by vanilla yargs.
 *
 * This type + {@link BfeBuilderObjectValueExtensions} =
 * {@link BfeBuilderObjectValue}.
 *
 * This type is a subset of {@link BfBuilderObjectValue}.
 */
export type BfeBuilderObjectValueWithoutExtensions = Omit<
  BfGenericBuilderObjectValue,
  'conflicts' | 'implies' | 'demandOption' | 'demand' | 'require' | 'required' | 'default'
>;

/**
 * A {@link BfeBuilderObjectValue} instance with the `subOptionOf` BFE key
 * omitted.
 */
export type BfeBuilderObjectValueWithoutSubOptionOfExtension<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = Omit<
  BfeBuilderObjectValue<CustomCliArguments, CustomExecutionContext>,
  'subOptionOf'
>;

/**
 * The array element type of
 * {@link BfeBuilderObjectValueExtensions.subOptionOf}.
 */
export type BfeSubOptionOfExtensionValue<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = {
  /**
   * This function receives the `superOptionValue` of the "super option" (i.e.
   * the key in `{ subOptionOf: { key: { when: ... }}}`), which you are free to
   * type as you please, and the fully parsed `argv`. This function must return
   * a boolean indicating whether the `update` function should run or not.
   */
  when: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    superOptionValue: any,
    argv: Arguments<CustomCliArguments, CustomExecutionContext>
  ) => boolean;
  /**
   * This function receives the current configuration for this option
   * (`oldOptionConfig`) and the fully parsed `argv`, and must return the new
   * configuration for this option.
   *
   * This configuration will completely overwrite the old configuration. To
   * extend the old configuration instead, spread it. For example:
   *
   * ```javascript
   * return {
   *   ...oldOptionConfig,
   *   description: 'New description'
   * }
   * ```
   */
  update:
    | ((
        oldOptionConfig: BfeBuilderObjectValueWithoutSubOptionOfExtension<
          CustomCliArguments,
          CustomExecutionContext
        >,
        argv: Arguments<CustomCliArguments, CustomExecutionContext>
      ) => BfeBuilderObjectValueWithoutSubOptionOfExtension<
        CustomCliArguments,
        CustomExecutionContext
      >)
    | BfeBuilderObjectValueWithoutSubOptionOfExtension<
        CustomCliArguments,
        CustomExecutionContext
      >;
};

/**
 * This function implements several additional optionals-related units of
 * functionality. This function is meant to take the place of a command's
 * `builder` export.
 *
 * This type cannot be instantiated by direct means. Instead, it is created and
 * returned by {@link withBuilderExtensions}.
 *
 * @see {@link withBuilderExtensions}
 */
export type BfeBuilderFunction<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = (
  ...args: Parameters<BfBuilderFunction<CustomCliArguments, CustomExecutionContext>>
) => BfBuilderObject<CustomCliArguments, CustomExecutionContext>;

/**
 * A stricter version of {@link Arguments} that explicitly omits the fallback
 * indexer for unrecognized arguments. Even though it is the runtime equivalent
 * of {@link Arguments}, using this type allows intellisense to report
 * bad/misspelled/missing arguments from `argv` in various places where it
 * otherwise couldn't.
 *
 * **This type is intended for intellisense purposes only.**
 */
export type BfeStrictArguments<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> =
  // ? Strangely, OmitIndexSignature kills our symbol-based props. Weird...
  OmitIndexSignature<Arguments<CustomCliArguments, CustomExecutionContext>> &
    FrameworkArguments<CustomExecutionContext>;

/**
 * A version of Black Flag's `builder` function parameters that exclude yargs
 * methods that are not supported by BFE.
 *
 * @see {@link withBuilderExtensions}
 */
export type BfeCustomBuilderFunctionParameters<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext,
  P = Parameters<BfBuilderFunction<CustomCliArguments, CustomExecutionContext>>
> = P extends [infer R, ...infer S]
  ? S extends [infer T, ...infer _U]
    ? [
        blackFlag: R & { options: never; option: never },
        T,
        BfeStrictArguments<CustomCliArguments, CustomExecutionContext>
      ]
    : [blackFlag: R & { options: never; option: never }, ...S]
  : never;

/**
 * This function implements several additional optionals-related units of
 * functionality. The return value of this function is meant to take the place
 * of a command's `handler` export.
 *
 * This type cannot be instantiated by direct means. Instead, it is created and
 * returned by {@link withBuilderExtensions}.
 *
 * Note that `customHandler` provides a stricter constraint than Black Flag's
 * `handler` command export in that `customHandler`'s `argv` parameter type
 * explicitly omits the fallback indexer for unrecognized arguments. This
 * means all possible arguments must be included in {@link CustomCliArguments}.
 *
 * @see {@link withBuilderExtensions}
 */
export type WithHandlerExtensions<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = (
  customHandler?: (
    argv: BfeStrictArguments<CustomCliArguments, CustomExecutionContext>
  ) => Promisable<void>
) => Configuration<CustomCliArguments, CustomExecutionContext>['handler'];

/**
 * The array of extended exports and high-order functions returned by
 * {@link withBuilderExtensions}.
 */
export type WithBuilderExtensionsReturnType<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = [
  builder: BfeBuilderFunction<CustomCliArguments, CustomExecutionContext>,
  withHandlerExtensions: WithHandlerExtensions<CustomCliArguments, CustomExecutionContext>
];

/**
 * A configuration object that further configures the behavior of
 * {@link withBuilderExtensions}.
 */
export type WithBuilderExtensionsConfig<
  CustomCliArguments extends Record<string, unknown>
> = {
  /**
   * Set to `true` to disable BFE's support for automatic grouping of related
   * options.
   *
   * See [the
   * documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#automatic-grouping-of-related-options)
   * for details.
   *
   * @default false
   */
  disableAutomaticGrouping?: boolean;
  /**
   * An array of zero or more string keys of `CustomCliArguments`, with the
   * optional addition of `'help'` and `'version'`, that should be grouped under
   * _"Common Options"_ when [automatic grouping of related
   * options](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#automatic-grouping-of-related-options)
   * is enabled.
   *
   * This setting is ignored if `disableAutomaticGrouping === true`.
   *
   * @default ['help']
   */
  commonOptions?: readonly LiteralUnion<
    keyof CustomCliArguments | 'help' | 'version',
    string
  >[];
};

/**
 * This function enables several additional options-related units of
 * functionality via analysis of the returned options configuration object and
 * the parsed command line arguments (argv).
 *
 * @see {@link WithBuilderExtensionsReturnType}
 */
export function withBuilderExtensions<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
>(
  customBuilder?:
    | BfeBuilderObject<CustomCliArguments, CustomExecutionContext>
    | ((
        ...args: BfeCustomBuilderFunctionParameters<
          CustomCliArguments,
          CustomExecutionContext
        >
      ) => BfeBuilderObject<CustomCliArguments, CustomExecutionContext> | void),
  {
    commonOptions = ['help'],
    disableAutomaticGrouping = false
  }: WithBuilderExtensionsConfig<CustomCliArguments> = {}
): WithBuilderExtensionsReturnType<CustomCliArguments, CustomExecutionContext> {
  const debug_ = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:withBuilderExtensions`
  });

  debug_('entered withBuilderExtensions function');

  let optionsMetadata: OptionsMetadata | undefined = undefined;

  // * Dealing with defaulted keys is a little tricky since we need to pass them
  // * to yargs for proper help text generation while also somehow getting yargs
  // * to ignore them when constructing argv. The solution is to unset defaulted
  // * arguments that are equal to their defaults at the start of the second
  // * pass, and then do the same thing again at the start of the handler
  // * extension's execution, and then manually inserting the defaults into argv
  // * before doing implications/checks. We need to keep the BF instances around
  // * to accomplish all of that.
  let latestBfInstance: EffectorProgram | undefined = undefined;

  debug_('exited withBuilderExtensions function');

  return [
    function builder(blackFlag, helpOrVersionSet, argv) {
      const debug = debug_.extend('builder');
      const isFirstPass = !argv;
      const isSecondPass = !isFirstPass;

      debug('entered withBuilderExtensions::builder wrapper function');

      debug('isFirstPass: %O', isFirstPass);
      debug('isSecondPass: %O', isSecondPass);
      debug('current argv: %O', argv);

      latestBfInstance = blackFlag as unknown as EffectorProgram;

      // ? We delete defaulted arguments from argv so that the end developer's
      // ? custom builder doesn't see them either
      deleteDefaultedArguments({ argv });

      debug('calling customBuilder (if a function) and returning builder object');
      // ? We make a deep clone of whatever options object we're passed
      // ? since there's a good chance we may be committing some light mutating
      const builderObject = superiorClone(
        (typeof customBuilder === 'function'
          ? customBuilder(
              blackFlag as BfeCustomBuilderFunctionParameters<
                CustomCliArguments,
                CustomExecutionContext
              >[0],
              helpOrVersionSet,
              argv as BfeCustomBuilderFunctionParameters<
                CustomCliArguments,
                CustomExecutionContext
              >[2]
            )
          : customBuilder) || {}
      );

      debug('builderObject: %O', builderObject);

      if (isSecondPass) {
        // * Apply the subOptionOf key per option config and then elide it
        Object.entries(builderObject).forEach(([subOption, subOptionConfig]) => {
          const { subOptionOf } = subOptionConfig;

          if (subOptionOf) {
            debug('evaluating suboption configuration for %O', subOption);

            Object.entries(subOptionOf).forEach(([superOption, updaters_]) => {
              const updaters = [updaters_].flat();

              debug(
                'saw entry for super-option %O (%O potential updates)',
                superOption,
                updaters.length
              );

              updaters.forEach(({ when, update }, index) => {
                if (superOption in argv && when(argv[superOption], argv)) {
                  subOptionConfig =
                    typeof update === 'function' ? update(subOptionConfig, argv) : update;

                  debug(
                    'accepted configuration update #%O to suboption "%O": %O',
                    index + 1,
                    subOption,
                    subOptionConfig
                  );
                } else {
                  debug(
                    'rejected configuration update #%O to suboption "%O": when() returned falsy',
                    index + 1,
                    subOption
                  );
                }
              });
            });

            builderObject[subOption] = subOptionConfig;
            debug('applied suboption configuration for %O', builderObject[subOption]);
          }

          delete subOptionConfig.subOptionOf;
        });
      }

      const optionLocalMetadata = analyzeBuilderObject({ builderObject, commonOptions });
      debug('option local metadata: %O', optionsMetadata);

      // * Automatic grouping happens on both first pass and second pass
      if (!disableAutomaticGrouping) {
        debug(
          `commencing automatic options grouping (${isFirstPass ? 'first' : 'second'} pass)`
        );

        const { demanded, demandedAtLeastOne, demandedMutuallyExclusive, optional } =
          optionLocalMetadata;

        if (demanded.length) {
          blackFlag.group(demanded, 'Required Options:');
          debug('added "Required" grouping: %O', demanded);
        }

        demandedAtLeastOne.forEach((group, index) => {
          const count = index + 1;
          const options = Object.keys(group);

          blackFlag.group(
            options,
            `Required Options ${demandedAtLeastOne.length > 1 ? `${count} ` : ''}(at least one):`
          );

          debug(`added "Required (at least one)" grouping #%O: %O`, count, options);
        });

        demandedMutuallyExclusive.forEach((group, index) => {
          const count = index + 1;
          const options = Object.keys(group);

          blackFlag.group(
            options,
            `Required Options ${demandedAtLeastOne.length > 1 ? `${count} ` : ''}(mutually exclusive):`
          );

          debug(`added "Required (mutually exclusive)" grouping #%O: %O`, count, options);
        });

        if (optional.length) {
          blackFlag.group(optional, 'Optional Options:');
          debug('added "Optional" grouping: %O', optional);
        }

        if (commonOptions.length) {
          const commonOptions_ = commonOptions.map((o) => String(o));
          blackFlag.group(commonOptions_, 'Common Options:');
          debug('added "Common" grouping: %O', commonOptions_);
        }
      } else {
        debug(
          `automatic options grouping disabled (at ${isFirstPass ? 'first' : 'second'} pass)`
        );
      }

      if (isSecondPass) {
        optionsMetadata = optionLocalMetadata;
        debug('stored option local metadata => option metadata');
      }

      debug('transmuting BFE builder to BF builder');
      const finalBuilderObject = transmuteBFEBuilderToBFBuilder({ builderObject });

      debug('final transmuted builderObject: %O', finalBuilderObject);
      debug('exited withBuilderExtensions::builder wrapper function');

      return finalBuilderObject;
    },
    function withHandlerExtensions(customHandler) {
      return async function handler(argv) {
        const debug = createDebugLogger({
          namespace: '${globalLoggerNamespace}:withHandlerExtensions'
        });

        debug('entered withHandlerExtensions::handler wrapper function');
        debug('option metadata: %O', optionsMetadata);

        hardAssert(optionsMetadata, ErrorMessage.IllegalHandlerInvocation());

        debug('current argv: %O', argv);
        deleteDefaultedArguments({ argv });
        debug('current argv (defaults deleted): %O', argv);

        const argvKeys = new Set(
          Object.keys(argv).filter((k) => {
            return !['_', '$0', '--'].includes(k);
          })
        );

        // * Run requires checks
        optionsMetadata.required.forEach(({ [$genesis]: requirer, ...requireds }) => {
          hardAssert(
            requirer !== undefined,
            ErrorMessage.MetadataInvariantViolated('requires')
          );

          if (argvKeys.has(requirer)) {
            const missingRequiredKeyValues: Entries<typeof requireds> = [];

            Object.entries(requireds).forEach((required) => {
              const [key, value] = required;

              if (
                !argvKeys.has(key) ||
                (value !== $exists && !isEqual(argv[key], value))
              ) {
                missingRequiredKeyValues.push(required);
              }
            });

            softAssert(
              !missingRequiredKeyValues.length,
              ErrorMessage.RequiresViolation(requirer, missingRequiredKeyValues)
            );
          }
        });

        // * Run conflicts checks
        optionsMetadata.conflicted.forEach(
          ({ [$genesis]: conflicter, ...conflicteds }) => {
            hardAssert(
              conflicter !== undefined,
              ErrorMessage.MetadataInvariantViolated('conflicts')
            );

            if (argvKeys.has(conflicter)) {
              const seenConflictingKeyValues: Entries<typeof conflicteds> = [];

              Object.entries(conflicteds).forEach((keyValue) => {
                const [key, value] = keyValue;

                if (
                  argvKeys.has(key) &&
                  (value === $exists || isEqual(argv[key], value))
                ) {
                  seenConflictingKeyValues.push(keyValue);
                }
              });

              softAssert(
                !seenConflictingKeyValues.length,
                ErrorMessage.ConflictsViolation(conflicter, seenConflictingKeyValues)
              );
            }
          }
        );

        // * Run demandThisOptionIf checks
        optionsMetadata.demandedIf.forEach(({ [$genesis]: demanded, ...demanders }) => {
          hardAssert(
            demanded !== undefined,
            ErrorMessage.MetadataInvariantViolated('demandThisOptionIf')
          );

          const sawDemanded = argvKeys.has(demanded);

          Object.entries(demanders).forEach((demander) => {
            const [key, value] = demander;
            const sawADemander =
              argvKeys.has(key) && (value === $exists || isEqual(argv[key], value));

            softAssert(
              !sawADemander || sawDemanded,
              ErrorMessage.DemandIfViolation(demanded, demander)
            );
          });
        });

        // * Run demandThisOptionOr checks
        optionsMetadata.demandedAtLeastOne.forEach((group) => {
          const groupEntries = Object.entries(group);
          const sawAtLeastOne = groupEntries.some((keyValue) => {
            const [key, value] = keyValue;
            return argvKeys.has(key) && (value === $exists || isEqual(argv[key], value));
          });

          softAssert(sawAtLeastOne, ErrorMessage.DemandOrViolation(groupEntries));
        });

        // * Run demandThisOptionXor checks
        optionsMetadata.demandedMutuallyExclusive.forEach((group) => {
          const groupEntries = Object.entries(group);
          let sawAtLeastOne: KeyValueEntry | undefined = undefined;

          groupEntries.forEach((keyValue) => {
            const [key, value] = keyValue;

            if (argvKeys.has(key) && (value === $exists || isEqual(argv[key], value))) {
              if (sawAtLeastOne !== undefined) {
                softAssert(
                  false,
                  ErrorMessage.DemandSpecificXorViolation(sawAtLeastOne, keyValue)
                );
              }

              sawAtLeastOne = keyValue;
            }
          });

          softAssert(
            sawAtLeastOne !== undefined,
            ErrorMessage.DemandGenericXorViolation(groupEntries)
          );
        });

        // ? Take advantage of our loop through optionsMetadata.implied to
        // ? keep track of this information for later
        const impliedKeyValues: Record<string, unknown> = {};

        // * Run implies checks
        optionsMetadata.implied.forEach(({ [$genesis]: implier, ...implications }) => {
          hardAssert(
            implier !== undefined,
            ErrorMessage.MetadataInvariantViolated('implies')
          );

          if (argvKeys.has(implier)) {
            Object.assign(impliedKeyValues, implications);

            if (!optionsMetadata!.implyLoosely.includes(implier)) {
              const seenConflictingKeyValues: Entries<typeof implications> = [];

              Object.entries(implications).forEach((keyValue) => {
                const [key, value] = keyValue;

                if (argvKeys.has(key) && !isEqual(argv[key], value)) {
                  seenConflictingKeyValues.push([key, argv[key]]);
                }
              });

              softAssert(
                !seenConflictingKeyValues.length,
                ErrorMessage.ImpliesViolation(implier, seenConflictingKeyValues)
              );
            }
          }
        });

        Object.assign(
          argv,
          // ? given overrides implied > overrides defaults > merged into argv
          Object.assign({}, optionsMetadata.defaults, impliedKeyValues, argv)
        );

        debug('final argv (defaults and implies merged): %O', argv);

        // ? We want to run the check functions sequentially and in definition
        // ? order since that's what the documentation promises
        // * Run custom checks on final argv
        for (const [currentArgument, checkFn] of Object.entries(optionsMetadata.checks)) {
          if (currentArgument in argv) {
            // ! checkFn might return a promise (or be async), watch out!
            // eslint-disable-next-line no-await-in-loop
            const result = await checkFn(argv[currentArgument], argv);

            if (!result || typeof result === 'string' || isNativeError(result)) {
              throw isCliError(result)
                ? result
                : new CliError(
                    (result as string | Error | false) ||
                      ErrorMessage.CheckFailed(currentArgument)
                  );
            }
          }
        }

        debug('invoking customHandler (or defaultHandler if undefined)');
        await (customHandler || defaultHandler)(
          // ? customHandler is more strict from an intellisense perspective,
          // ? but it still meets the Black Flag handler's argv constraints even
          // ? if TypeScript isn't yet smart enough to understand it
          argv as Parameters<NonNullable<typeof customHandler>>[0]
        );

        debug('exited withHandlerExtensions::handler wrapper function');
      };
    }
  ];

  function deleteDefaultedArguments({
    argv
  }: {
    argv: Arguments<CustomCliArguments, CustomExecutionContext> | undefined;
  }): void {
    if (!latestBfInstance || !argv || !optionsMetadata) {
      debug_('deleteDefaultedArguments sentinel failed, execution skipped');
      return;
    }

    const defaultedOptions = (
      latestBfInstance as unknown as { parsed?: { defaulted?: Record<string, true> } }
    ).parsed?.defaulted;

    hardAssert(defaultedOptions, ErrorMessage.UnexpectedlyFalsyDetailedArguments());

    Object.keys(defaultedOptions).forEach((defaultedOption) => {
      const expectedDefaultValue = optionsMetadata?.defaults?.[defaultedOption];

      if (
        defaultedOption in argv &&
        isEqual(argv[defaultedOption], expectedDefaultValue)
      ) {
        delete argv[defaultedOption];
      }
    });
  }
}

/**
 * Generate command usage text consistently yet flexibly.
 */
export function withUsageExtensions(altDescription = '$1.') {
  if (altDescription?.endsWith('.') === false) {
    altDescription += '.';
  }

  return `Usage: $000\n\n${altDescription}`.trim();
}

/**
 * Throw a {@link CliError} with the given string message, which
 * causes Black Flag to exit with the {@link FrameworkExitCode.DefaultError}
 * status code.
 *
 * Use this function to assert end user error.
 */
function softAssert(value: unknown, message: string): asserts value {
  if (!value) {
    throw new CliError(message, {
      showHelp: true,
      suggestedExitCode: FrameworkExitCode.DefaultError
    });
  }
}

/**
 * Throw a so-called "FrameworkError" with the given string message, which
 * causes Black Flag to exit with the {@link FrameworkExitCode.AssertionFailed}
 * status code.
 *
 * Use this function to assert developer errors that end users can do nothing
 * about.
 */
function hardAssert(value: unknown, message: string): asserts value {
  if (!value) {
    throw new CliError(ErrorMessage.FrameworkError(message), {
      showHelp: true,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

function transmuteBFEBuilderToBFBuilder<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
>({
  builderObject
}: {
  builderObject: BfeBuilderObject<CustomCliArguments, CustomExecutionContext>;
}): BfBuilderObject<CustomCliArguments, CustomExecutionContext> {
  const vanillaYargsBuilderObject: BfBuilderObject<
    CustomCliArguments,
    CustomExecutionContext
  > = {};

  for (const [option, builderObjectValue] of Object.entries(builderObject)) {
    const [bfeBuilderObjectValue, vanillaYargsBuilderObjectValue] =
      separateExtensionsFromBuilderObjectValue({ builderObjectValue });

    const { demandThisOption } = bfeBuilderObjectValue;

    if (demandThisOption !== undefined) {
      (vanillaYargsBuilderObjectValue as BfGenericBuilderObjectValue).demandOption =
        demandThisOption;
    }

    // ? We add it back here so that vanilla yargs will include it in help text
    if (bfeBuilderObjectValue.default !== undefined) {
      (vanillaYargsBuilderObjectValue as BfGenericBuilderObjectValue).default =
        bfeBuilderObjectValue.default;
    }

    vanillaYargsBuilderObject[option] = vanillaYargsBuilderObjectValue;
  }

  return vanillaYargsBuilderObject;
}

function analyzeBuilderObject<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
>({
  builderObject,
  commonOptions
}: {
  builderObject: BfeBuilderObject<CustomCliArguments, CustomExecutionContext>;
  commonOptions: NonNullable<
    WithBuilderExtensionsConfig<CustomCliArguments>['commonOptions']
  >;
}) {
  const metadata: OptionsMetadata = {
    required: [],
    conflicted: [],
    implied: [],
    implyLoosely: [],
    demandedIf: [],
    demanded: [],
    demandedAtLeastOne: [],
    demandedMutuallyExclusive: [],
    optional: [],
    defaults: {},
    checks: {}
  };

  // ? This first loop resolves all groupings except "optional options"
  for (const [option, builderObjectValue] of Object.entries(builderObject)) {
    const [
      {
        requires,
        conflicts,
        check,
        // ? eslint does not like "default" as a variable name for some reason
        default: default_,
        implies,
        looseImplications,
        demandThisOptionIf,
        demandThisOption,
        demandThisOptionOr,
        demandThisOptionXor
      }
    ] = separateExtensionsFromBuilderObjectValue({ builderObjectValue });

    if (requires !== undefined) {
      const normalizedOption = flattenExtensionValue(requires);
      addToSet(metadata.required, { ...normalizedOption, [$genesis]: option });
    }

    if (conflicts !== undefined) {
      const normalizedOption = flattenExtensionValue(conflicts);
      addToSet(metadata.conflicted, { ...normalizedOption, [$genesis]: option });
    }

    if (check !== undefined) {
      // ? Assert bivariance
      metadata.checks[option] = check as (typeof metadata.checks)[string];
    }

    if (default_ !== undefined) {
      metadata.defaults[option] = default_;
    }

    if (implies !== undefined) {
      const normalizedOption = flattenExtensionValue(implies);
      addToSet(metadata.implied, { ...normalizedOption, [$genesis]: option });
    }

    if (looseImplications) {
      metadata.implyLoosely.push(option);
    }

    if (demandThisOption !== undefined) {
      metadata.demanded.push(option);
    }

    if (demandThisOptionIf !== undefined) {
      const normalizedOption = flattenExtensionValue(demandThisOptionIf);
      addToSet(metadata.demandedIf, { ...normalizedOption, [$genesis]: option });
    }

    if (demandThisOptionOr !== undefined) {
      const normalizedOption = flattenExtensionValue(demandThisOptionOr);
      addToSet(metadata.demandedAtLeastOne, { ...normalizedOption, [option]: $exists });
    }

    if (demandThisOptionXor !== undefined) {
      const normalizedOption = flattenExtensionValue(demandThisOptionXor);
      addToSet(metadata.demandedMutuallyExclusive, {
        ...normalizedOption,
        [option]: $exists
      });
    }
  }

  // ? This second loop lets us see which options are actually optional after
  // ? all the groupings have been resolved
  for (const [option] of Object.entries(builderObject)) {
    const isExplicitlyDemanded = !!(
      metadata.demanded.includes(option) ||
      metadata.demandedAtLeastOne.some((record) => option in record) ||
      metadata.demandedMutuallyExclusive.some((record) => option in record)
    );

    // ? An option cannot be in both common options and optional options
    if (!isExplicitlyDemanded && !commonOptions.includes(option)) {
      metadata.optional.push(option);
    }
  }

  return metadata;
}

/**
 * This function returns an array where the first element is a
 * {@link BfeBuilderObjectValueExtensions} instance with all properties defined
 * and the second element is a {@link BfeBuilderObjectValueWithoutExtensions}
 * instance.
 */
function separateExtensionsFromBuilderObjectValue<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
>({
  builderObjectValue: builderObjectValue
}: {
  builderObjectValue: BfeBuilderObject<
    CustomCliArguments,
    CustomExecutionContext
  >[string];
}): [
  {
    // ? Ensure bfeConfig always has all of BFE's properties
    [Key in StringKeyOf<
      BfeBuilderObjectValueExtensions<CustomCliArguments, CustomExecutionContext>
    >]:
      | BfeBuilderObjectValueExtensions<CustomCliArguments, CustomExecutionContext>[Key]
      | undefined;
  },
  BfeBuilderObjectValueWithoutExtensions
] {
  const {
    check,
    conflicts,
    // ? eslint does not like "default" as a variable name for some reason
    default: default_,
    demandThisOption,
    demandThisOptionIf,
    demandThisOptionOr,
    demandThisOptionXor,
    implies,
    looseImplications,
    requires,
    subOptionOf,
    ...vanillaYargsConfig
  } = builderObjectValue;

  const bfeConfig = {
    check,
    conflicts,
    demandThisOption,
    demandThisOptionIf,
    demandThisOptionOr,
    demandThisOptionXor,
    implies,
    looseImplications,
    requires,
    subOptionOf
  };

  return [{ ...bfeConfig, default: default_ }, vanillaYargsConfig];
}

function flattenExtensionValue(
  extendedOption: BfeBuilderObjectValueExtensionValue
): FlattenedExtensionValue {
  const mergedConfig: FlattenedExtensionValue = {};

  if (Array.isArray(extendedOption)) {
    extendedOption.forEach((option) => mergeInto(option));
  } else {
    mergeInto(extendedOption);
  }

  return mergedConfig;

  function mergeInto(
    option: Exclude<BfeBuilderObjectValueExtensionValue, Array<unknown>>
  ) {
    if (typeof option === 'string') {
      mergedConfig[option] = $exists;
    } else {
      Object.assign(mergedConfig, option);
    }
  }
}

function addToSet(arrayAsSet: unknown[], element: unknown) {
  const hasElement = arrayAsSet.find((item) => isEqual(item, element));

  if (!hasElement) {
    arrayAsSet.push(element);
  }
}

function defaultHandler() {
  throw new CommandNotImplementedError();
}

/**
 * A smarter more useful cloning algorithm based on "structured clone" that
 * passes through as-is items that cannot be cloned.
 */
function superiorClone<T>(o: T): T {
  return cloneDeepWith(o, (value) => {
    const attempt = clone(value);

    if (attempt && typeof attempt === 'object' && Object.keys(attempt).length === 0) {
      return value;
    }

    return undefined;
  });
}
