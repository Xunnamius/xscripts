import { ChildConfiguration, CliError } from '@black-flag/core';

import { CustomExecutionContext } from 'universe/configure';
import { LogTag, wellKnownCliDistPath } from 'universe/constant';
import { ErrorMessage } from 'universe/error';

import {
  GlobalCliArguments,
  getProjectMetadata,
  logStartTime,
  makeUsageString,
  withGlobalOptions,
  withGlobalOptionsHandling
} from 'universe/util';

import { runWithInheritedIo } from 'multiverse/run';

export type CustomCliArguments = GlobalCliArguments;

export default async function command({
  log: genericLogger,
  debug_,
  state
}: CustomExecutionContext) {
  const [builder, builderData] = await withGlobalOptions<CustomCliArguments>();

  return {
    builder,
    description: 'Run a CLI or deploy a local production environment, if applicable',
    usage: makeUsageString(),
    handler: await withGlobalOptionsHandling<CustomCliArguments>(
      builderData,
      async function () {
        const debug = debug_.extend('handler');
        debug('entered handler');

        const { startTime } = state;

        logStartTime({ log: genericLogger, startTime });

        const { attributes } = await getProjectMetadata();
        const passControlMessage = (runtime: string) =>
          `--- control passed to ${runtime} runtime ---`;

        try {
          if (attributes.includes('cli')) {
            genericLogger([LogTag.IF_NOT_QUIETED], passControlMessage('CLI'));
            await runWithInheritedIo(wellKnownCliDistPath);
          } else if (attributes.includes('next')) {
            genericLogger([LogTag.IF_NOT_QUIETED], passControlMessage('Next.js'));
            await runWithInheritedIo('next', ['start']);
          } else {
            throw new CliError(ErrorMessage.UnsupportedCommand());
          }
        } catch (error) {
          const error_ =
            error &&
            typeof error === 'object' &&
            'exitCode' in error &&
            typeof error.exitCode === 'number'
              ? new CliError('', { suggestedExitCode: error.exitCode })
              : error;

          throw error_;
        }
      }
    )
  } satisfies ChildConfiguration<CustomCliArguments, CustomExecutionContext>;
}

export { command };
