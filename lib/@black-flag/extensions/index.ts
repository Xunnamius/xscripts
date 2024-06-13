import assert from 'node:assert';

import { CliError, type Configuration } from '@black-flag/core';
import { type ExecutionContext } from '@black-flag/core/util';
import { type Options } from 'yargs';

import { createDebugLogger } from 'multiverse/rejoinder';

const globalDebuggerNamespace = '@black-flag/extensions';

/**
 * The object value type of an {@link ExtendedBuilderObject}.
 */
export type ExtendedOption =
  | string
  | Record<string, string | number | boolean>
  | (string | Record<string, string | number | boolean>)[];

/**
 * @see {@link ExtendedBuilderObject}
 */
export type ExtendedBuilderObjectValueWithoutSubOptionOf<
  CustomCliArguments extends Record<string, unknown>
> = Omit<ExtendedBuilderObject<CustomCliArguments>[string], 'subOptionOf'>;

/**
 * @see {@link ExtendedBuilderObject['subOptionOf']}
 */
export type SubOptionConfigurationValue<
  CustomCliArguments extends Record<string, unknown>
> = {
  /**
   * This function receives the `superOptionValue` of the "super option" (i.e.
   * the key in `{ subOptionOf: { key: { when: ... }}}`), which you are free to
   * type as you please, and the fully parsed `argv`. This function must return
   * a boolean indicating whether the `update` function should run or not.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  when: (superOptionValue: any, argv: CustomCliArguments) => boolean;
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
  update: (
    oldOptionConfig: ExtendedBuilderObjectValueWithoutSubOptionOf<CustomCliArguments>,
    argv: CustomCliArguments
  ) => ExtendedBuilderObjectValueWithoutSubOptionOf<CustomCliArguments>;
};

/**
 * The object value type of the `builder` export accepted by Black Flag.
 */
export type BuilderObject<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = Exclude<
  Configuration<CustomCliArguments, CustomExecutionContext>['builder'],
  // eslint-disable-next-line @typescript-eslint/ban-types
  Function
>;

/**
 * The function value type of the `builder` export accepted by Black Flag.
 */
export type BuilderFunction<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = Extract<
  Configuration<CustomCliArguments, CustomExecutionContext>['builder'],
  // eslint-disable-next-line @typescript-eslint/ban-types
  Function
>;

/**
 * A version of the object value type of the `builder` export accepted by Black
 * Flag that supports \@black-flag/extensions's additional functionality.
 */
export type ExtendedBuilderObject<CustomCliArguments extends Record<string, unknown>> = {
  [key: string]: Omit<Options, 'conflicts' | 'implies' | 'demandOption'> & {
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
    requires?: ExtendedOption;
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
    conflicts?: ExtendedOption;
    /**
     * `demandThisOptionIf` enables checks to ensure an argument is given when
     * at least one of the specified groups of arguments, or argument-value
     * pairs, is also given. For example:
     *
     * ```jsonc
     * {
     *   "x": {},
     *   "y": { "demandThisOptionIf": "x" }, // ◄ Demands y if x is given
     *   "z": { "demandThisOptionIf": "x" } // ◄ Demands z if x is given
     * }
     * ```
     */
    demandThisOptionIf?: ExtendedOption;
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
    demandThisOption?: Options['demandOption'];
    /**
     * `demandThisOptionOr` enables non-optional inclusive disjunction checks
     * per group. Put another way, `demandThisOptionOr` enforces a "logical or"
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
    demandThisOptionOr?: ExtendedOption;
    /**
     * `demandThisOptionXor` enables non-optional exclusive disjunction checks
     * per exclusivity group. Put another way, `demandThisOptionXor` enforces
     * mutual exclusivity within groups of required options. For example:
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
    demandThisOptionXor?: ExtendedOption;
    /**
     * `implies` will set a default value for the specified arguments
     * conditioned on the existence of another argument. If any of the specified
     * arguments are explicitly given, their values must match the specified
     * argument-value pairs respectively (which is the behavior of `requires`).
     * For this reason, `implies` only accepts one or more argument-value pairs
     * and not raw strings. For example:
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
      | Record<string, string | number | boolean>
      | Record<string, string | number | boolean>[];
    /**
     * `check` is declarative sugar around `yargs::check()` that is applied
     * specifically to the option being configured. This function receives the
     * `currentArgumentValue`, which you are free to type as you please, and the
     * fully parsed `argv`. If this function throws, the exception will bubble.
     * If this function returns an instance of `Error`, a string, or any
     * non-truthy value, Black Flag will throw a `CliError` on your behalf.
     *
     * See [the
     * documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#check)
     * for details.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    check?: (currentArgumentValue: any, argv: CustomCliArguments) => unknown;
    /**
     * `subOptionOf` is declarative sugar around Black Flag's support for double
     * argument parsing, allowing you to describe the relationship between
     * options and the suboptions whose configurations they determine.
     *
     * See [the
     * documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#suboptionof)
     * for details.
     *
     * For describing simpler implicative relations, see `implies`.
     */
    subOptionOf?: Record<string, SubOptionConfigurationValue<CustomCliArguments>>;
  };
};

/**
 * A version of Black Flag's builder function parameters that excludes yargs
 * methods that are not supported by \@black-flag/extensions.
 */
export type LimitedBuilderFunctionParameters<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext,
  P = Parameters<BuilderFunction<CustomCliArguments, CustomExecutionContext>>
> = P extends [infer R, ...infer S]
  ? [R & { options: never; option: never }, ...S]
  : never;

/**
 * This function implements several additional optionals-related units of
 * functionality. The return value of this function is meant to take the place
 * of a command's `handler` export.
 *
 * This function cannot be imported directly. Instead, it is created and
 * returned by {@link withBuilderExtensions}.
 *
 * @see {@link withBuilderExtensions}
 */
export type WithHandlerExtensions<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = (
  customHandler: Configuration<CustomCliArguments, CustomExecutionContext>['handler']
) => Configuration<CustomCliArguments, CustomExecutionContext>['handler'];

/**
 * This function implements several additional optionals-related units of
 * functionality. This function is meant to take the place of a command's
 * `builder` export.
 *
 * This function cannot be imported directly. Instead, it is created and
 * returned by {@link withBuilderExtensions}.
 *
 * @see {@link withBuilderExtensions}
 */
export type ExtendedBuilderFunction<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = (
  ...args: Parameters<BuilderFunction<CustomCliArguments, CustomExecutionContext>>
) => BuilderObject<CustomCliArguments, CustomExecutionContext>;

/**
 * The array of extended exports and high-order functions returned by
 * {@link withBuilderExtensions}.
 */
export type WithBuilderExtensionsReturnType<
  CustomCliArguments extends Record<string, unknown>,
  CustomExecutionContext extends ExecutionContext
> = [
  builder: ExtendedBuilderFunction<CustomCliArguments, CustomExecutionContext>,
  withHandlerExtensions: WithHandlerExtensions<CustomCliArguments, CustomExecutionContext>
];

/**
 * A settings object that further configures the behavior of
 * {@link withBuilderExtensions}.
 */
export type WithBuilderExtensionsSettings<
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
  commonOptions?: readonly (keyof CustomCliArguments | 'help' | 'version')[];
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
    | ExtendedBuilderObject<CustomCliArguments>
    | ((
        ...args: LimitedBuilderFunctionParameters<
          CustomCliArguments,
          CustomExecutionContext
        >
      ) => ExtendedBuilderObject<CustomCliArguments> | void),
  {
    commonOptions = ['help'],
    disableAutomaticGrouping = false
  }: WithBuilderExtensionsSettings<CustomCliArguments> = {}
): WithBuilderExtensionsReturnType<CustomCliArguments, CustomExecutionContext> {
  const debug_ = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:withBuilderExtensions`
  });

  debug_('entered withBuilderExtensions function');

  const optionMetadata = {
    atLeastOneOfOptions: [] as string[][],
    mutuallyConflictedOptions: [] as string[][]
  };

  debug_('exited withBuilderExtensions function');

  return [
    function builder(blackFlag, helpOrVersionSet, argv) {
      const debug = debug_.extend('builder');

      debug('entered withBuilderExtensions::builder wrapper function');
      debug('calling customBuilder (if a function) and returning builder object');

      // ? We make a semi-shallow clone of whatever options object we're passed
      // ? since there's a good chance we may be committing some light mutating
      const result = Object.fromEntries(
        Object.entries(
          (typeof customBuilder === 'function'
            ? customBuilder(
                blackFlag as LimitedBuilderFunctionParameters<
                  CustomCliArguments,
                  CustomExecutionContext
                >[0],
                helpOrVersionSet,
                argv
              )
            : customBuilder) || {}
        ).map(([k, v]) => [k, { ...v }])
      );

      debug('result: %O', result);
      debug('argv is defined: %O', !!argv);

      // TODO: automatic grouping must happen on both first pass and second pass
      // TODO: and there must be no caching/overlap between them (b/c of
      // TODO: subOptionOf). Also, each pass should clear optionMetadata entirely

      // TODO: on first pass, apply subOptionOf & delete it (don't modify real config obj)

      // TODO: on second pass, throw if subOptionOf is seen

      // TODO: redo all of this wrt the above notes
      if (Object.keys(result).length) {
        const requiredMutuallyExclusiveOptionsSet = new Map<Set<string>, string[]>();
        const requiredAtLeastOneOptionsSet = new Map<Set<string>, string[]>();
        const requiredOptions: string[] = [];
        const optionalOptions: string[] = [];

        for (const [option, optionConfig] of Object.entries(result)) {
          const { demandOption, conflicts } = optionConfig;

          // TODO: remove this limitation
          if (demandOption && conflicts) {
            // ? We do not allow both features to be used simultaneously
            assert(
              typeof demandOption === 'boolean',
              ErrorMessage.AssertionFailureCannotUseDoubleFeature()
            );
            optionConfig.demandOption = false;

            const rawKey = new Set<string>([
              ...(Array.isArray(conflicts)
                ? conflicts
                : typeof conflicts === 'string'
                  ? [conflicts]
                  : Object.keys(conflicts)),
              option
            ]);

            const key =
              [...requiredMutuallyExclusiveOptionsSet.keys()].find((potentialKey) =>
                areEqualSets(rawKey, potentialKey)
              ) || rawKey;

            requiredMutuallyExclusiveOptionsSet.set(key, [
              ...(requiredMutuallyExclusiveOptionsSet.get(key) || []),
              option
            ]);
          } else if (Array.isArray(demandOption)) {
            // ! Ensures demandOption is given to yargs as a valid type
            optionConfig.demandOption = false;

            const rawKey = new Set<string>([...demandOption, option]);

            const key =
              [...requiredAtLeastOneOptionsSet.keys()].find((potentialKey) =>
                areEqualSets(rawKey, potentialKey)
              ) || rawKey;

            requiredAtLeastOneOptionsSet.set(key, [
              ...(requiredAtLeastOneOptionsSet.get(key) || []),
              option
            ]);
          } else {
            (demandOption ? requiredOptions : optionalOptions).push(option);
          }
        }

        debug(
          'requiredMutuallyExclusiveOptionsGroups: %O',
          requiredMutuallyExclusiveOptionsSet
        );

        // TODO: add count to mutual exclusive groups same as or-groups

        for (const [
          _,
          mutuallyConflictedOptions
        ] of requiredMutuallyExclusiveOptionsSet) {
          if (mutuallyConflictedOptions.length > 1) {
            if (!!argv) {
              optionMetadata.mutuallyConflictedOptions.push(mutuallyConflictedOptions);
              debug('pushed to option metadata.mutuallyConflictedOptions');
            }

            // TODO: do not do if automatic grouping is disabled
            blackFlag.group(
              mutuallyConflictedOptions,
              'Required Options (mutually exclusive):'
            );

            debug(
              'added "Required (mutually exclusive)" grouping: %O',
              mutuallyConflictedOptions
            );
          }
        }

        debug('requiredAtLeastOneOptionsGroups: %O', requiredAtLeastOneOptionsSet);

        let count = 0;

        for (const [
          atLeastOneOfDemandedSet,
          atLeastOneOfOptions
        ] of requiredAtLeastOneOptionsSet) {
          const atLeastOneOfOptionsSet = new Set(atLeastOneOfOptions);
          if (!areEqualSets(atLeastOneOfDemandedSet, atLeastOneOfOptionsSet)) {
            debug.error(
              'unequal sets (atLeastOneOfDemandedSet != atLeastOneOfOptionsSet): %O != %O',
              atLeastOneOfDemandedSet,
              atLeastOneOfOptionsSet
            );

            debug.error(atLeastOneOfDemandedSet);
            debug.error(atLeastOneOfOptionsSet);
            assert.fail(ErrorMessage.AssertionFailureUnequalDemandOptions());
          }

          if (!!argv) {
            optionMetadata.atLeastOneOfOptions.push(atLeastOneOfOptions);
            debug('pushed to option metadata.atLeastOneOfOptions');
          }

          // TODO: do not do if automatic grouping is disabled
          blackFlag.group(
            atLeastOneOfOptions,
            `Required Options ${requiredAtLeastOneOptionsSet.size > 1 ? `${++count} ` : ''}(at least one):`
          );
          debug(
            `added "Required (at least one)" grouping #%O: %O`,
            count,
            atLeastOneOfOptions
          );
        }

        if (requiredOptions.length) {
          // TODO: do not do if automatic grouping is disabled
          blackFlag.group(requiredOptions, 'Required Options:');
          debug('added "Required" grouping: %O', requiredOptions);
        }

        if (optionalOptions.length) {
          // TODO: do not do if automatic grouping is disabled
          blackFlag.group(optionalOptions, 'Optional Options:');
          debug('added "Optional" grouping: %O', optionalOptions);
        }
      }

      debug('option metadata: %O', optionMetadata);

      if (!disableAutomaticGrouping) {
        const commonOptions_ = commonOptions.map((o) => String(o));
        blackFlag.group(commonOptions_, 'Common Options:');
        debug('added "Common" grouping: %O', commonOptions_);
      } else {
        debug('skipped creating "Common" grouping');
      }

      debug('exited withBuilderExtensions::builder wrapper function');

      return result as BuilderObject<CustomCliArguments, CustomExecutionContext>;
    },
    function withHandlerExtensions(customHandler) {
      return async function handler(argv) {
        const debug = createDebugLogger({
          namespace: '${globalLoggerNamespace}:withHandlerExtensions'
        });

        debug('entered withHandlerExtensions::handler wrapper function');
        debug('option metadata: %O', optionMetadata);

        // TODO: operate on a version of argv where defaulted args are deleted

        // TODO: run demandThisOptionOr checks
        optionMetadata.atLeastOneOfOptions
          .map((constraint) => getOptionsFromArgv(constraint, argv))
          .forEach((options) => ensureAtLeastOneOptionWasGiven(options));

        // TODO: run demandThisOptionXor checks
        optionMetadata.mutuallyConflictedOptions
          .map((constraint) => getOptionsFromArgv(constraint, argv))
          .forEach((options) => ensureMutualExclusivityOfOptions(options));

        // TODO: run implies checks (no contradictions allowed)

        // TODO: return to using normal argv, merge argv with implies objects

        // TODO: run custom checks on normal argv

        await customHandler(argv);

        debug('exited withHandlerExtensions::handler wrapper function');
      };
    }
  ];
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

// Returns `true` iff `setA` and `setB` are equal-enough sets.
function areEqualSets(setA: Set<unknown>, setB: Set<unknown>) {
  return setA.size === setB.size && [...setA].every((item) => setB.has(item));
}

function getOptionsFromArgv(
  targetOptionsNames: string[],
  optionsGiven: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries([
    ...targetOptionsNames.map((name) => [name, undefined]),
    ...Object.entries(optionsGiven).filter(([name]) => targetOptionsNames.includes(name))
  ]);
}

function ensureMutualExclusivityOfOptions(optionsEntries: Record<string, unknown>) {
  let sawOne = false;
  Object.values(optionsEntries).every((value) => {
    if (sawOne) {
      throw new CliError(
        ErrorMessage.DidNotProvideExactlyOneOfSeveralOptions(optionsEntries),
        { showHelp: true }
      );
    }

    sawOne = value !== undefined;
  });
}

function ensureAtLeastOneOptionWasGiven(optionsEntries: Record<string, unknown>) {
  const sawAtLeastOne = Object.values(optionsEntries).some(
    (value) => value !== undefined
  );

  if (!sawAtLeastOne) {
    throw new CliError(
      ErrorMessage.DidNotProvideAtLeastOneOfSeveralOptions(optionsEntries),
      { showHelp: true }
    );
  }
}
