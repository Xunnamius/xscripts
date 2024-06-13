import { CliError, type ChildConfiguration } from '@black-flag/core';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { ErrorMessage } from 'universe/error';
import { getProjectMetadata, hasExitCode } from 'universe/util';

import { LogTag, logStartTime } from 'multiverse/@-xun/cli-utils/logging';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse/@-xun/cli-utils/extensions';

import { run, runWithInheritedIo } from 'multiverse/run';

export type CustomCliArguments = GlobalCliArguments;

export default function command({
  log: genericLogger,
  debug_,
  state
}: GlobalExecutionContext) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >();

  return {
    builder,
    description: 'Deploy a local development environment, if applicable',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function () {
      const debug = debug_.extend('handler');
      debug('entered handler');

      const { startTime } = state;

      logStartTime({ log: genericLogger, startTime });

      const { attributes } = await getProjectMetadata();
      const passControlMessage = (runtime: string) =>
        `--- control passed to ${runtime} runtime ---`;

      const acquirePort = async () => {
        // TODO: replace this when acquire-port gets programmatic API
        const port = (await run('npx', ['-q', 'acquire-port'])).stdout;
        debug('acquired port: %O', port);

        return port;
      };

      try {
        if (attributes.includes('next')) {
          const port = await acquirePort();
          genericLogger([LogTag.IF_NOT_QUIETED], passControlMessage('Next.js'));
          await runWithInheritedIo('next', ['-p', port]);
        } else if (attributes.includes('webpack')) {
          const port = await acquirePort();

          genericLogger(
            [LogTag.IF_NOT_QUIETED],
            passControlMessage('Webpack dev server')
          );

          await runWithInheritedIo('webpack', ['serve', '--port', port], {
            extendEnv: true,
            env: { USE_WEBPACK_DEV_CONFIG: 'true', NODE_ENV: 'development' }
          });
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
