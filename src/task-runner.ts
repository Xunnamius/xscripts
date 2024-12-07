import { run } from '@-xun/run';

import { hardAssert } from 'multiverse+cli-utils:error.ts';
import { LogTag } from 'multiverse+cli-utils:logging.ts';
import { type ExtendedLogger } from 'multiverse+rejoinder';

import { ErrorMessage } from 'universe:error.ts';

export async function attemptToRunCommand(
  cmd: Parameters<typeof run>[0],
  cmdArgs: Parameters<typeof run>[1],
  {
    reject = false,
    ...runConfig
  }: Parameters<typeof run>[2] & {
    scriptName: string;
    logger: ExtendedLogger;
  }
) {
  const { all: output, exitCode } = await run(cmd, cmdArgs, {
    ...runConfig,
    all: true,
    env: {
      ...runConfig.env,
      DEBUG_COLORS: 'true',
      DEBUG_HIDE_DATE: 'true',
      FORCE_COLOR: 'true'
    },
    reject
  });

  if (output) {
    hardAssert(typeof output === 'string', ErrorMessage.GuruMeditation());

    runConfig.logger(
      [exitCode === 0 ? LogTag.IF_NOT_HUSHED : LogTag.IF_NOT_SILENCED],
      `${exitCode === 0 ? '' : '❌ (failed) '}%O output:`,
      runConfig.scriptName
    );

    process.stdout.write(output + (output.endsWith('\n') ? '' : '\n'));
  }

  return exitCode;
}
