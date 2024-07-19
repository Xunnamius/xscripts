import { CliError, type ChildConfiguration } from '@black-flag/core';
import { glob } from 'glob';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { globalPreChecks, isAccessible, readFile, writeFile } from 'universe/util';

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
import { run } from 'multiverse/run';
import { standardNodeShebang } from 'universe/constant';
import { ErrorMessage } from 'universe/error';

export type CustomCliArguments = GlobalCliArguments & {
  prependShebang: boolean;
  allowMissingExternals: boolean;
};

export default function command({
  log,
  debug_,
  state,
  runtimeContext
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    'prepend-shebang': {
      boolean: true,
      description: 'Prepend a shebang to each "bin" distributable in package.json',
      default: true
    },
    'allow-missing-externals': {
      boolean: true,
      description:
        'Do not error if an "external-scripts" root directory is not accessible',
      default: true
    }
  });

  return {
    aliases: ['external'],
    builder,
    description: 'Translate external source and assets into local scripts',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({
      $0: scriptFullName,
      allowMissingExternals,
      prependShebang,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Building external scripts...');

      debug('prependShebang: %O', prependShebang);
      debug('allowMissingExternals: %O', allowMissingExternals);

      const {
        project: { root }
      } = runtimeContext;

      const externalScriptsDir = `${root}/external-scripts`;

      debug('root: %O', root);
      debug('externalScriptsDir: %O', externalScriptsDir);

      if (await isAccessible(externalScriptsDir)) {
        genericLogger.newline([LogTag.IF_NOT_QUIETED]);

        // TODO: debug mode => add babel environment variable to spit out seen config
        await run(
          'npx',
          [
            'babel',
            'external-scripts',
            '--extensions',
            '.ts,.tsx',
            '--out-dir',
            'external-scripts/bin'
          ],
          {
            env: { NODE_ENV: 'production-externals' },
            stdout: isHushed ? 'ignore' : 'inherit',
            stderr: isQuieted ? 'ignore' : 'inherit'
          }
        );

        const externalExecutables = await glob(
          [
            `${root}/external-scripts/bin/*.js`,
            `${root}/external-scripts/bin/*/index.js`
          ],
          { dot: true, absolute: true, nodir: true }
        );

        debug('externalExecutables: %O', externalExecutables);

        if (externalExecutables.length) {
          genericLogger.newline([LogTag.IF_NOT_QUIETED]);

          if (prependShebang) {
            await Promise.all(
              externalExecutables.map(async (path) => {
                const contents = await readFile(path);

                if (contents.startsWith('#!')) {
                  debug(`skipped prepending shebang, path already has shebang: %O`, path);
                } else {
                  debug(`prepending shebang to file at path: %O`, path);

                  await writeFile(path, `${standardNodeShebang}${contents}`);

                  genericLogger([LogTag.IF_NOT_QUIETED], `Prepended shebang to ${path}`);
                }
              })
            );
          }
        } else {
          genericLogger.newline([LogTag.IF_NOT_QUIETED]);
          genericLogger.warn(
            [LogTag.IF_NOT_QUIETED],
            'no external scripts were output (no externals found)'
          );
        }
      } else if (allowMissingExternals) {
        genericLogger.warn(
          [LogTag.IF_NOT_QUIETED],
          'no external scripts were output ("external-scripts" directory is missing)'
        );
      } else {
        throw new CliError(ErrorMessage.CannotAccessDirectory(externalScriptsDir));
      }

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
