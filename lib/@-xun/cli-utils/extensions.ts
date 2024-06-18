import { $executionContext } from '@black-flag/core';
import { type ExecutionContext } from '@black-flag/core/util';

import {
  withBuilderExtensions,
  type BfeBuilderObject,
  type BfeCustomBuilderFunctionParameters,
  type WithBuilderExtensionsReturnType
} from 'multiverse/@black-flag/extensions/index';

import {
  createDebugLogger,
  disableLoggingByTag,
  type ExtendedDebugger,
  type ExtendedLogger,
  type ListrManager
} from 'multiverse/rejoinder';

import { LogTag } from './logging';

const globalDebuggerNamespace = '@-xun/cli-utils';

export { withUsageExtensions as withStandardUsage } from 'multiverse/@black-flag/extensions/index';

/**
 * This {@link ExecutionContext} subtype contains state related to
 * {@link standardCommonCliArguments}, both of which are required for the proper
 * function of {@link withStandardBuilder}.
 */
export type StandardExecutionContext = ExecutionContext & {
  /**
   * The {@link ExtendedLogger} for the CLI.
   */
  log: ExtendedLogger;
  /**
   * The {@link ExtendedDebugger} for the CLI.
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
 * This {@link BfeBuilderObject} instance describes the CLI arguments
 * available in the `argv` object of any command that uses
 * {@link withStandardBuilder} to construct its `builder`.
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
} as const satisfies BfeBuilderObject<Record<string, unknown>>;

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
 * [`strip-dashed`](https://github.com/yargs/yargs-parser?tab=readme-ov-file#strip-dashed) and [`strip-aliased`](https://github.com/yargs/yargs-parser?tab=readme-ov-file#strip-aliased) in yargs-parser.
 */
export function withStandardBuilder<
  CustomCliArguments extends StandardCommonCliArguments,
  CustomExecutionContext extends ExecutionContext
>(
  customBuilder?: Parameters<
    typeof withBuilderExtensions<CustomCliArguments, CustomExecutionContext>
  >[0],
  {
    enableVersionOption = false
  }: {
    /**
     * Set to `true` to include `'version'` in the `commonOptions` setting for {@link withBuilderExtensions}.
     *
     * @default false
     */
    enableVersionOption?: boolean;
  } = {}
): WithBuilderExtensionsReturnType<CustomCliArguments, CustomExecutionContext> {
  const debug_ = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:withStandardBuilder`
  });

  debug_('entered withStandardBuilder function');

  const commonOptions = [
    'help',
    ...(enableVersionOption ? (['version'] as const) : []),
    ...standardCommonCliArgumentsKeys
  ] as const;

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
          ? customBuilder(
              blackFlag as BfeCustomBuilderFunctionParameters<
                CustomCliArguments,
                CustomExecutionContext
              >[0],
              helpOrVersionSet,
              argv
            )
          : customBuilder) || {};

      debug_('exited withStandardBuilder::builder wrapper function');

      return {
        ...standardCommonCliArguments,
        ...customCliArguments
      };
    },
    { commonOptions }
  );

  debug_('exited withStandardBuilder function');

  return [
    function standardBuilder(blackFlag, helpOrVersionSet, argv) {
      const debug = debug_.extend('standardBuilder');

      debug('entered standardBuilder');

      debug('updating "Commands:" string to "Subcommands:"');
      blackFlag.updateStrings({ 'Commands:': 'Subcommands:' });

      debug('reconfiguring yargs-parser');
      blackFlag.parserConfiguration({
        'duplicate-arguments-array': false,
        'strip-aliased': true,
        'strip-dashed': true
      });

      debug('invoking withBuilderExtensions::builder');
      const returnedCliArguments = builder(blackFlag, helpOrVersionSet, argv);

      debug('exited standardBuilder');
      return returnedCliArguments;
    },
    function withStandardHandler(
      customHandler: Parameters<typeof withHandlerExtensions>[0]
    ) {
      return async function handler(argv) {
        const {
          hush,
          quiet,
          silent,
          [$executionContext]: { state }
        } = argv;

        const tags = new Set<LogTag>();
        const debug = createDebugLogger({
          namespace: '${globalLoggerNamespace}:withStandardHandler'
        });

        debug('entered withStandardHandler wrapper');
        debug('hush: %O', hush);
        debug('quiet: %O', quiet);
        debug('silent: %O', silent);

        if (silent) {
          tags.add(LogTag.IF_NOT_SILENCED);
          state.isSilenced = true;
          state.showHelpOnFail = false;
        }

        if (quiet) {
          tags.add(LogTag.IF_NOT_QUIETED);
          state.isQuieted = true;
        }

        if (hush) {
          tags.add(LogTag.IF_NOT_HUSHED);
          state.isHushed = true;
        }

        disableLoggingByTag({ tags: Array.from(tags) });

        debug('invoking withHandlerExtensions with customHandler');
        await withHandlerExtensions(customHandler)(argv);

        debug('exited withStandardHandler wrapper');
      };
    }
  ];
}
