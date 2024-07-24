import { type ChildConfiguration } from '@black-flag/core';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse/@-xun/cli-utils/logging';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse/@-xun/cli-utils/extensions';

import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';
import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';
import { runWithInheritedIo } from 'multiverse/run';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { fsConstants, globalPreChecks, isAccessible } from 'universe/util';

export type CustomCliArguments = GlobalCliArguments;

export default function command({
  log,
  debug_,
  state,
  runtimeContext
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >();

  return {
    builder,
    description: 'Run relevant project initializations upon initial install',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

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

        const hasPostCheckout = await isAccessible(
          '.husky/post-checkout',
          fsConstants.R_OK | fsConstants.X_OK
        );

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
