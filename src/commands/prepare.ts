import { ChildConfiguration } from '@black-flag/core';

import { run } from 'multiverse/run';
import { CustomExecutionContext } from 'universe/configure';
import { LogTag, standardSuccessMessage } from 'universe/constant';

import {
  GlobalCliArguments,
  logStartTime,
  makeUsageString,
  withGlobalOptions,
  withGlobalOptionsHandling
} from 'universe/util';

export type CustomCliArguments = GlobalCliArguments;

export default async function command({
  log: genericLogger,
  debug_,
  state
}: CustomExecutionContext) {
  const [builder, builderData] = await withGlobalOptions<CustomCliArguments>();

  return {
    builder,
    description: 'Run relevant project initializations upon initial install',
    usage: makeUsageString(),
    handler: await withGlobalOptionsHandling<CustomCliArguments>(
      builderData,
      async function () {
        const debug = debug_.extend('handler');
        debug('entered handler');

        const { startTime } = state;

        logStartTime({ log: genericLogger, startTime });

        const isInCiEnvironment = !!process.env.CI;
        const isInDevelopmentEnvironment =
          process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development';

        debug('isInCiEnvironment: %O', isInCiEnvironment);
        debug('isInDevelopmentEnvironment: %O', isInDevelopmentEnvironment);

        if (!isInCiEnvironment && isInDevelopmentEnvironment) {
          await run('npx', ['husky'], { stdout: 'inherit', stderr: 'inherit' });
          genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
        } else {
          genericLogger([LogTag.IF_NOT_QUIETED], 'skipped installing husky git hooks');
        }
      }
    )
  } satisfies ChildConfiguration<CustomCliArguments, CustomExecutionContext>;
}

export { command };
