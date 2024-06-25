import { type ChildConfiguration } from '@black-flag/core';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { ErrorMessage } from 'universe/error';
import { findMarkdownFiles } from 'universe/util';

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

      const mdFiles = await findMarkdownFiles();
      debug('mdFiles: %O', mdFiles);

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

      // ? This can run completely asynchronously since nothing else relies on
      // ? it (except prettier).

      const promisedSortedPkg = sortPackageJson
        ? run('npx', ['sort-package-json', './package.json', './packages/*/package.json'])
        : Promise.resolve();

      // ? These have to run sequentially to prevent data corruption.

      await run(
        'npx',
        ['doctoc', '--no-title', '--maxlevel', '3', '--update-only', ...mdFiles],
        {
          stdout: isHushed ? 'ignore' : 'inherit',
          stderr: isQuieted ? 'ignore' : 'inherit'
        }
      );

      await run('npx', ['remark', '--output', '--frail', ...mdFiles], {
        env: {
          NODE_ENV: 'format',
          SHOULD_RENUMBER_REFERENCES: renumberReferences.toString()
        },
        stdout: isHushed ? 'ignore' : 'inherit',
        stderr: isQuieted ? 'ignore' : 'inherit'
      });

      await promisedSortedPkg;

      await run('npx', ['prettier', '--write', '.'], {
        stdout: isHushed ? 'ignore' : 'inherit',
        stderr: isQuieted ? 'ignore' : 'inherit'
      });

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
