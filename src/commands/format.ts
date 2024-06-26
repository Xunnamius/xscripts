import { CliError, type ChildConfiguration } from '@black-flag/core';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { ErrorMessage } from 'universe/error';
import { findProjectFiles } from 'universe/util';

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
import { SHORT_TAB } from 'multiverse/rejoinder';
import { run } from 'multiverse/run';

export type CustomCliArguments = GlobalCliArguments & {
  'sort-package-json': boolean;
  'skip-docs': boolean;
  'renumber-references': boolean;
};

export default function command({ log, debug_, state }: GlobalExecutionContext) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    'sort-package-json': {
      boolean: true,
      description: 'Sort any package.json files',
      default: true
    },
    'renumber-references': {
      boolean: true,
      description: 'Run the renumber-references plugin when formatting Markdown files',
      default: false
    }
  });

  return {
    builder,
    description: 'Run formatters (e.g. prettier, remark) across all relevant files',
    usage: withStandardUsage(
      '$1.\n\nNote that .prettierignore is used as the basis for which Markdown files are considered when formatters are run'
    ),
    handler: withStandardHandler(async function ({
      $0: scriptFullName,
      sortPackageJson,
      renumberReferences,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');
      debug('entered handler');

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Formatting project files...');

      const { mdFiles, pkgFiles } = await findProjectFiles();
      debug('mdFiles: %O', mdFiles);
      debug('pkgFiles: %O', mdFiles);

      try {
        await run(
          'npx',
          [
            'remark',
            '--no-config',
            '--no-stdout',
            '--quiet',
            '--frail',
            '--use',
            'gfm',
            '--use',
            'lint-no-undefined-references',
            ...mdFiles
          ],
          {
            stdout: isHushed ? 'ignore' : 'inherit',
            stderr: isQuieted ? 'ignore' : 'inherit'
          }
        );
      } catch (error) {
        throw new Error(ErrorMessage.MarkdownNoUndefinedReferences(), { cause: error });
      }

      const status: Record<
        'sort' | 'doctoc' | 'remark' | 'prettier',
        boolean | null | undefined
      > & { failed: boolean } = {
        failed: false,
        sort: undefined,
        doctoc: undefined,
        remark: undefined,
        prettier: undefined
      };

      try {
        // ? This can run completely asynchronously since nothing else relies on
        // ? it (except prettier).

        status.sort = null;

        const sortedPkgJsonFiles = sortPackageJson
          ? run('npx', ['sort-package-json', ...pkgFiles]).catch((error) => {
              status.sort = false;
              throw error;
            })
          : Promise.resolve();

        // ? These have to run sequentially to prevent data corruption.

        status.doctoc = null;

        await run(
          'npx',
          ['doctoc', '--no-title', '--maxlevel', '3', '--update-only', ...mdFiles],
          {
            stdout: isHushed ? 'ignore' : 'inherit',
            stderr: isQuieted ? 'ignore' : 'inherit'
          }
        ).catch((error) => {
          status.doctoc = false;
          throw error;
        });

        status.doctoc = true;
        status.remark = null;

        await run('npx', ['remark', '--output', '--frail', ...mdFiles], {
          env: {
            NODE_ENV: 'format',
            SHOULD_RENUMBER_REFERENCES: renumberReferences.toString()
          },
          stdout: isHushed ? 'ignore' : 'inherit',
          stderr: isQuieted ? 'ignore' : 'inherit'
        }).catch((error) => {
          status.remark = false;
          throw error;
        });

        status.remark = true;

        await sortedPkgJsonFiles;

        status.sort = true;
        status.prettier = null;

        await run('npx', ['prettier', '--write', '.'], {
          stdout: isHushed ? 'ignore' : 'inherit',
          stderr: isQuieted ? 'ignore' : 'inherit'
        }).catch((error) => {
          status.prettier = false;
          throw error;
        });

        status.prettier = true;
      } catch {
        status.failed = true;
      }

      genericLogger(
        [LogTag.IF_NOT_SILENCED],
        [
          `Processed package.json files: ${pkgFiles.length}`,
          `${SHORT_TAB}Sorted file contents: ${statusToEmoji(status.sort)}`,
          `Processed markdown files: ${mdFiles.length}`,
          `${SHORT_TAB}Synchronized TOCs: ${statusToEmoji(status.doctoc)}`,
          `${SHORT_TAB}Reformatted files: ${statusToEmoji(status.remark)}`,
          `Prettified all relevant project files: ${statusToEmoji(status.prettier)}`
        ].join('\n')
      );

      genericLogger.newline([LogTag.IF_NOT_SILENCED]);

      if (status.failed) {
        throw new CliError(ErrorMessage.CommandDidNotComplete('format'));
      }

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}

function statusToEmoji(status: boolean | null | undefined) {
  switch (status) {
    case true: {
      return '✅';
      break;
    }

    case false: {
      return '❌ (failed)';
      break;
    }

    case null: {
      return '❓ (started)';
      break;
    }

    case undefined: {
      return '✖️ (skipped)';
      break;
    }
  }
}
