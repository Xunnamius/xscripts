import { ChildConfiguration, CliError } from '@black-flag/core';

import { CustomExecutionContext } from 'universe/configure';
import { LogTag, wellKnownCliDistPath } from 'universe/constant';
import { ErrorMessage } from 'universe/error';

import {
  GlobalCliArguments,
  getProjectMetadata,
  hasExitCode,
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
  const [builder, builderData] = await withGlobalOptions<CustomCliArguments>(
    (blackFlag) => {
      blackFlag.strict(false);
    }
  );

  return {
    builder,
    description: 'Run a CLI or deploy a local production environment, if applicable',
    usage: makeUsageString(),
    handler: await withGlobalOptionsHandling<CustomCliArguments>(
      builderData,
      async function ({ _: args_ }) {
        const debug = debug_.extend('handler');
        debug('entered handler');

        const { startTime } = state;

        logStartTime({ log: genericLogger, startTime });

        const args = args_.map((a) => a.toString());
        debug('additional (passthrough) args: %O', args);

        const { attributes } = await getProjectMetadata();
        const passControlMessage = (runtime: string) =>
          `--- control passed to ${runtime} runtime ---`;

        try {
          if (attributes.includes('cli')) {
            genericLogger([LogTag.IF_NOT_QUIETED], passControlMessage('CLI'));
            await runWithInheritedIo(wellKnownCliDistPath, args);
          } else if (attributes.includes('next')) {
            genericLogger([LogTag.IF_NOT_QUIETED], passControlMessage('Next.js'));
            await runWithInheritedIo('next', ['start', ...args]);
          } else {
            throw new CliError(ErrorMessage.UnsupportedCommand());
          }
        } catch (error) {
          throw hasExitCode(error)
            ? new CliError('', { suggestedExitCode: error.exitCode })
            : error;
        }
      }
    )
  } satisfies ChildConfiguration<CustomCliArguments, CustomExecutionContext>;
}

export { command };
