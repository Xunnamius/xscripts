import { type ChildConfiguration } from '@black-flag/core';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse#cli-utils logging.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';
import { runWithInheritedIo } from 'multiverse#run';
import { type AsStrictExecutionContext } from 'multiverse#bfe';
import { fsConstants, isAccessible } from 'multiverse#project-utils fs/index.ts';

import { withGlobalBuilder, withGlobalUsage, runGlobalPreChecks } from 'universe util.ts';

import {
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

export type CustomCliArguments = GlobalCliArguments;

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>();

  return {
    builder,
    description: 'Run relevant project initializations upon initial install',
    usage: withGlobalUsage(),
    handler: withGlobalHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Preparing project...');

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
        genericLogger([LogTag.IF_NOT_QUIETED], 'skipped installing husky git hooks');
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
