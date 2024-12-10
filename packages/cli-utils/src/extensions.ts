import { $executionContext } from '@black-flag/core';

import {
  CommandNotImplementedError,
  type ExecutionContext
} from '@black-flag/core/util';

import {
  withBuilderExtensions,
  type BfeBuilderObject,
  type WithBuilderExtensionsConfig,
  type WithBuilderExtensionsReturnType
} from 'multiverse+bfe';

import { $artificiallyInvoked } from 'multiverse+bfe:symbols.ts';

import {
  createDebugLogger,
  disableLoggingByTag,
  enableLoggingByTag,
  getDisabledTags,
  type ExtendedDebugger,
  type ExtendedLogger,
  type ListrManager
} from 'multiverse+rejoinder';

// ? Used in a comment for taskManager
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type makeStandardConfigureExecutionContext } from 'rootverse+cli-utils:src/configure.ts';
import { globalDebuggerNamespace } from 'rootverse+cli-utils:src/constant.ts';
import { LogTag } from 'rootverse+cli-utils:src/logging.ts';

export { withUsageExtensions as withStandardUsage } from 'multiverse+bfe';

/**
 * This {@link ExecutionContext} subtype contains state related to
 * {@link standardCommonCliArguments}, both of which are required for the proper
 * function of {@link withStandardBuilder}.
 */
export type StandardExecutionContext = ExecutionContext & {
  /**
   * The {@link ExtendedLogger} for the CLI (not Black Flag's).
   */
  log: ExtendedLogger;
  /**
   * The {@link ExtendedDebugger} for the CLI (not Black Flag's).
   */
  debug_: ExtendedDebugger;
  state: {
    /**
     * If `true`, the program should not output anything at all. It also implies
     * `isQuieted` and `isHushed` are both `true`.
     */
    isSilenced: boolean;
    /**
     * If `true`, the program should be dramatically less verbose. It also
     * implies `isHushed` is `true`.
     */
    isQuieted: boolean;
    /**
     * If `true`, the program should output only the most pertinent information.
     */
    isHushed: boolean;
    /**
     * A `Date` object representing the start time of execution.
     */
    startTime: Date;
  };
} & (
    | {
        /**
         * The global Listr task manager singleton or `undefined` if Listr2
         * support has not been enabled via
         * {@link makeStandardConfigureExecutionContext}.
         */
        taskManager: ListrManager;
      }
    | {
        taskManager?: undefined;
      }
  );

/**
 * These properties will be available in the `argv` object of any command that
 * uses {@link withStandardBuilder} to construct its `builder`.
 *
 * This type is manually synchronized with {@link standardCommonCliArguments},
 * but the keys may differ slightly (e.g. hyphens may be elided in favor of
 * camelCase).
 *
 * Note that this type purposely excludes the `help` and `version` keys, which
 * are considered standard common CLI arguments by this package.
 */
export type StandardCommonCliArguments = {
  hush: boolean;
  quiet: boolean;
  silent: boolean;
};

/**
 * This {@link BfeBuilderObject} instance describes the CLI arguments available
 * in the `argv` object of any command that uses {@link withStandardBuilder} to
 * construct its `builder`.
 *
 * This object is manually synchronized with {@link StandardCommonCliArguments},
 * but the keys may differ slightly (e.g. hyphens may be elided in favor of
 * camelCase).
 *
 * Note that this object purposely excludes the `help` and `version` keys, which
 * are considered standard common CLI arguments by this package.
 */
export const standardCommonCliArguments = {
  hush: {
    boolean: true,
    default: false,
    description: 'Set output to be somewhat less verbose'
  },
  quiet: {
    boolean: true,
    default: false,
    implies: { hush: true },
    description: 'Set output to be dramatically less verbose (implies --hush)'
  },
  silent: {
    boolean: true,
    default: false,
    implies: { quiet: true, hush: true },
    description: 'No output will be generated (implies --quiet)'
  }
} as const satisfies BfeBuilderObject<Record<string, unknown>, StandardExecutionContext>;

/**
 * This is an array of the keys in {@link standardCommonCliArguments}, each of
 * which have a one-to-one relation with a key of
 * {@link StandardCommonCliArguments}.
 *
 * Note that this array purposely excludes `'help'` and `'version'`, which are
 * considered standard common CLI arguments by this package and are therefore
 * automatically included when appropriate.
 */
export const standardCommonCliArgumentsKeys = Object.keys(
  standardCommonCliArguments
) as (keyof typeof standardCommonCliArguments)[];

/**
 * This function enables several options-related units of functionality
 * considered standard across [Xunnamius](https://github.com/Xunnamius)'s CLI
 * projects.
 *
 * This function is a relatively thin wrapper around
 * {@link withBuilderExtensions}. It also disables
 * [`duplicate-arguments-array`](https://github.com/yargs/yargs-parser?tab=readme-ov-file#duplicate-arguments-array)
 * and enables
 * [`strip-dashed`](https://github.com/yargs/yargs-parser?tab=readme-ov-file#strip-dashed)
 * and
 * [`strip-aliased`](https://github.com/yargs/yargs-parser?tab=readme-ov-file#strip-aliased)
 * in yargs-parser.
 */
export function withStandardBuilder<
  CustomCliArguments extends StandardCommonCliArguments,
  CustomExecutionContext extends StandardExecutionContext
>(
  customBuilder?: Parameters<
    typeof withBuilderExtensions<CustomCliArguments, CustomExecutionContext>
  >[0],
  {
    additionalCommonOptions = [],
    disableAutomaticGrouping
  }: Omit<WithBuilderExtensionsConfig<CustomCliArguments>, 'commonOptions'> & {
    /**
     * An array of zero or more string keys of `CustomCliArguments`, with the
     * optional addition of `'version'` (`'help'` is always included), that
     * should be grouped under _"Common Options"_ when [automatic grouping of
     * related
     * options](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#automatic-grouping-of-related-options)
     * is enabled.
     *
     * This setting is ignored if `disableAutomaticGrouping === true`.
     *
     * @default []
     */
    additionalCommonOptions?: WithBuilderExtensionsConfig<CustomCliArguments>['commonOptions'];
  } = {}
): WithBuilderExtensionsReturnType<CustomCliArguments, CustomExecutionContext> {
  const debug_ = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:withStandardBuilder`
  });

  debug_('entered withStandardBuilder function');

  const commonOptions = [
    'help',
    ...(additionalCommonOptions.includes('version') ? ['version'] : []),
    ...standardCommonCliArgumentsKeys,
    ...additionalCommonOptions.filter((opt) => opt !== 'version')
  ];

  debug_('commonOptions: %O', commonOptions);

  const [builder, withHandlerExtensions] = withBuilderExtensions<
    CustomCliArguments,
    CustomExecutionContext
  >(
    function builder(blackFlag, helpOrVersionSet, argv) {
      debug_('entered withStandardBuilder::builder wrapper function');
      debug_('calling customBuilder (if a function) and returning builder object');

      const customCliArguments =
        (typeof customBuilder === 'function'
          ? customBuilder(blackFlag, helpOrVersionSet, argv)
          : customBuilder) || {};

      debug_('exited withStandardBuilder::builder wrapper function');

      return {
        ...standardCommonCliArguments,
        ...customCliArguments
      };
    },
    { commonOptions, disableAutomaticGrouping }
  );

  debug_('exited withStandardBuilder function');

  return [
    function standardBuilder(blackFlag, helpOrVersionSet, rawArgv) {
      const debug = debug_.extend('standardBuilder');

      debug('entered standardBuilder');

      debug('updating "Commands:" string to "Subcommands:"');
      blackFlag.updateStrings({ 'Commands:': 'Subcommands:' });

      debug('reconfiguring yargs-parser');
      blackFlag.parserConfiguration({
        'duplicate-arguments-array': false,
        'greedy-arrays': true
      });

      debug('invoking withBuilderExtensions::builder');
      const returnedCliArguments = builder(blackFlag, helpOrVersionSet, rawArgv);

      debug('exited standardBuilder');
      return returnedCliArguments;
    },
    function withStandardHandler(
      customHandler: Parameters<typeof withHandlerExtensions>[0]
    ) {
      return async function handler(rawArgv) {
        const tagsSet = new Set<LogTag>();
        const debug = createDebugLogger({
          namespace: `${globalDebuggerNamespace}:withStandardHandler`
        });

        debug('entered withStandardHandler wrapper');

        debug('manually invoking withHandlerExtensions');
        await withHandlerExtensions(async (argv) => {
          const {
            hush,
            quiet,
            silent,
            [$artificiallyInvoked]: wasArtificiallyInvoked,
            [$executionContext]: { state }
          } = argv;

          const originallyDisabledTags = getDisabledTags();

          debug('hush: %O', hush);
          debug('quiet: %O', quiet);
          debug('silent: %O', silent);
          debug('disabledTags: %O', originallyDisabledTags);
          debug('wasArtificiallyInvoked: %O', wasArtificiallyInvoked);

          const originalState = { ...state };

          if (silent) {
            tagsSet.add(LogTag.IF_NOT_SILENCED);
            state.isSilenced = true;
            state.showHelpOnFail = false;
          }

          if (quiet) {
            tagsSet.add(LogTag.IF_NOT_QUIETED);
            state.isQuieted = true;
          }

          if (hush) {
            tagsSet.add(LogTag.IF_NOT_HUSHED);
            state.isHushed = true;
          }

          disableLoggingByTag({ tags: Array.from(tagsSet) });

          try {
            debug('invoking customHandler (or defaultHandler if undefined)');
            await (customHandler ?? defaultHandler)(argv);
          } finally {
            if (wasArtificiallyInvoked) {
              debug('undoing state changes due to artificial invocation');

              if (silent) {
                if (!originallyDisabledTags.has(LogTag.IF_NOT_SILENCED)) {
                  enableLoggingByTag({ tags: [LogTag.IF_NOT_SILENCED] });
                }

                state.isSilenced = originalState.isSilenced;
                state.showHelpOnFail = originalState.showHelpOnFail;
              }

              if (quiet) {
                if (!originallyDisabledTags.has(LogTag.IF_NOT_QUIETED)) {
                  enableLoggingByTag({ tags: [LogTag.IF_NOT_QUIETED] });
                }

                state.isQuieted = originalState.isQuieted;
              }

              if (hush) {
                if (!originallyDisabledTags.has(LogTag.IF_NOT_HUSHED)) {
                  enableLoggingByTag({ tags: [LogTag.IF_NOT_HUSHED] });
                }

                state.isHushed = originalState.isHushed;
              }
            }
          }
        })(rawArgv);

        debug('exited withStandardHandler wrapper');
      };
    }
  ];
}

function defaultHandler() {
  throw new CommandNotImplementedError();
}
