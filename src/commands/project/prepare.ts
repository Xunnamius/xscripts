import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse#bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse#cli-utils logging.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';
import { fsConstants, isAccessible } from 'multiverse#project-utils fs/index.ts';
import { runWithInheritedIo } from 'multiverse#run';

import {
  UnlimitedGlobalScope as PreparationScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

import { runGlobalPreChecks, withGlobalBuilder, withGlobalUsage } from 'universe util.ts';

/**
 * @see {@link PreparationScope}
 */
export const preparationScopes = Object.values(PreparationScope);

export type CustomCliArguments = GlobalCliArguments<PreparationScope>;

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    scope: { choices: preparationScopes, default: PreparationScope.Unlimited }
  });

  return {
    builder,
    description: 'Run relevant project initializations (usually only at install time)',
    usage: withGlobalUsage(
      `$1.

Rather than trigger it manually, this command should be run whenever NPM would run its "prepare" life cycle operation.

See https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-operation-order for details`
    ),
    handler: withGlobalHandler(async function ({ $0: scriptFullName, scope }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Preparing project...');

      debug('scope (unused): %O', scope);

      const cwdIsProjectRoot = !!projectMetadata.project.packages;

      if (!cwdIsProjectRoot) {
        genericLogger.warn([LogTag.IF_NOT_QUIETED], 'Skipped project preparation');
        genericLogger.warn(
          [LogTag.IF_NOT_QUIETED],
          '(this command should only be run from the project root)'
        );
      } else {
        const isInCiEnvironment = !!process.env.CI;
        const isInDevelopmentEnvironment =
          process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development';

        debug('isInCiEnvironment: %O', isInCiEnvironment);
        debug('isInDevelopmentEnvironment: %O', isInDevelopmentEnvironment);

        if (!isInCiEnvironment && isInDevelopmentEnvironment) {
          await runWithInheritedIo('npx', ['husky']);

          const hasPostCheckout = await isAccessible({
            path: '.husky/post-checkout',
            fsConstant: fsConstants.R_OK | fsConstants.X_OK
          });

          if (hasPostCheckout) {
            await runWithInheritedIo('.husky/post-checkout');
          } else {
            debug(
              'skipped executing .husky/post-checkout since it does not exist or is not executable by current process'
            );
          }

          genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
        } else {
          genericLogger([LogTag.IF_NOT_QUIETED], 'Skipped installing husky git hooks');
        }
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
