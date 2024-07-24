import { CliError, type ChildConfiguration } from '@black-flag/core';

import { LogTag, logStartTime } from 'multiverse/@-xun/cli-utils/logging';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse/@-xun/cli-utils/extensions';

import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';
import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';
import { runWithInheritedIo } from 'multiverse/run';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { ErrorMessage } from 'universe/error';

import {
  ProjectMetaAttribute,
  findMainBinFile,
  getProjectMetadata,
  globalPreChecks,
  hasExitCode
} from 'universe/util';

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
  >((blackFlag) => {
    blackFlag.strict(false);
  });

  return {
    builder,
    description: 'Run a CLI or deploy a local production environment, if applicable',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName, _: args_ }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });

      const args = args_.map((a) => a.toString());
      debug('additional (passthrough) args: %O', args);

      const { attributes } = await getProjectMetadata(runtimeContext);
      const mainBinFile = findMainBinFile(runtimeContext);
      const passControlMessage = (runtime: string) =>
        `--- control passed to ${runtime} runtime ---`;

      try {
        if (attributes.includes(ProjectMetaAttribute.Cli) && mainBinFile) {
          genericLogger([LogTag.IF_NOT_QUIETED], passControlMessage('CLI'));
          await runWithInheritedIo(mainBinFile, args);
        } else if (attributes.includes(ProjectMetaAttribute.Next)) {
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
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
