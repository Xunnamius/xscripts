import { basename } from 'node:path';

import { CliError, type ChildConfiguration } from '@black-flag/core';
import { glob } from 'glob-gitignore';
import { getSupportInfo } from 'prettier';

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
import { SHORT_TAB } from 'multiverse/rejoinder';
import { run } from 'multiverse/run';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { ErrorMessage } from 'universe/error';

import {
  checkChoicesNotEmpty,
  deriveVirtualPrettierIgnoreLines,
  findProjectFiles,
  globalPreChecks
} from 'universe/util';

export type CustomCliArguments = GlobalCliArguments & {
  renumberReferences: boolean;
  skipIgnored: boolean;
  skipUnknown: boolean;
  files?: string[];
  onlyPackageJson: boolean;
  onlyMarkdown: boolean;
  onlyPrettier: boolean;
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
    'renumber-references': {
      boolean: true,
      description: 'Run the renumber-references plugin when formatting Markdown files',
      default: false
    },
    'skip-ignored': {
      boolean: true,
      description: 'Ignore files listed in .prettierignore',
      default: true
    },
    'skip-unknown': {
      boolean: true,
      description: 'Ignore files unknown to git',
      default: false
    },
    files: {
      array: true,
      description:
        'Only consider files (or globs) given via --files instead of scanning the filesystem',
      check: checkChoicesNotEmpty('--files')
    },
    // TODO: perhaps use the enum based target selection instead of "only" logic
    'only-package-json': {
      boolean: true,
      description: 'Only target package.json files for formatting',
      default: false,
      conflicts: ['renumber-references', { 'only-markdown': true, 'only-prettier': true }]
    },
    'only-markdown': {
      boolean: true,
      description: 'Only target Markdown files for formatting',
      default: false,
      conflicts: [{ 'only-package-json': true, 'only-prettier': true }]
    },
    'only-prettier': {
      boolean: true,
      description: 'Only run Prettier-based file formatting',
      default: false,
      conflicts: [
        'renumber-references',
        { 'only-package-json': true, 'only-markdown': true }
      ]
    }
  });

  return {
    builder,
    description: 'Run formatters (e.g. prettier, remark) across all relevant files',
    usage: withStandardUsage(
      '$1.\n\nNote that .prettierignore is used as the single source of truth for which Markdown files are and are not ignored when formatters are run. To prevent a file from being formatted by any formatter (including remark), add it to .prettierignore. To disregard .prettierignore when formatters are run, use --no-skip-ignored.\n\nWith respect to .prettierignore being the single source of truth for formatters: note that remark is configured to respect .remarkignore files only when run by "xscripts lint"; when executing "xscripts format", .remarkignore files are always disregarded. This means you can use .remarkignore files to prevent certain paths from being linted by "xscripts lint" without preventing them from being formatted by "xscripts format".'
    ),
    handler: withStandardHandler(async function ({
      $0: scriptFullName,
      renumberReferences,
      skipIgnored,
      skipUnknown,
      files,
      onlyPackageJson,
      onlyMarkdown,
      onlyPrettier,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Formatting project files...');

      debug('renumberReferences: %O', renumberReferences);
      debug('skipIgnored: %O', skipIgnored);
      debug('skipUnknown: %O', skipUnknown);
      debug('files: %O', files);
      debug('onlyPackageJson: %O', onlyPackageJson);
      debug('onlyMarkdown: %O', onlyMarkdown);
      debug('onlyPrettier: %O', onlyPrettier);

      const {
        project: { root: rootDir }
      } = runtimeContext;

      const {
        mdFiles,
        pkgFiles: { root: rootPkgFile, workspaces: workspacePkgFiles }
      } = await (async () => {
        if (files) {
          debug('using --files as targets');

          const ignore = skipIgnored
            ? await deriveVirtualPrettierIgnoreLines(rootDir, skipUnknown)
            : [];

          debug('virtual .prettierignore lines: %O', ignore);

          files = await glob(files, {
            dot: true,
            absolute: true,
            nodir: true,
            // ? This addresses a strange bug with the ignores package as seen
            // ? here: https://github.com/prettier/prettier-atom/issues/490
            // TODO: warn invokers that pass absolute files paths that ignores
            // TODO: doesn't work like that, and then drop the ignore key like
            // TODO: below to prevent everything from blowing up.
            ...(ignore.length ? { ignore } : {})
          });

          debug('files (post-glob): %O', files);

          const [mdFiles, workspaces] = await Promise.all([
            files.filter((path) => path.endsWith('.md')),
            files.filter((path) => path.endsWith('/package.json'))
          ]);

          return {
            mdFiles,
            pkgFiles: { root: '', workspaces }
          };
        } else {
          debug('running generic project filesystem scan');
          return findProjectFiles(runtimeContext, { skipIgnored, skipUnknown });
        }
      })();

      const allPkgFiles = rootPkgFile
        ? [rootPkgFile, ...workspacePkgFiles]
        : workspacePkgFiles;

      debug('mdFiles: %O', mdFiles);
      debug('allPkgFiles: %O', allPkgFiles);

      const shouldDoPkgJson = !onlyMarkdown && !onlyPrettier && allPkgFiles.length > 0;
      const shouldDoMarkdown = !onlyPackageJson && !onlyPrettier && mdFiles.length > 0;
      const shouldDoPrettier = !onlyPackageJson && !onlyMarkdown;

      debug('shouldDoPkgJson: %O', shouldDoPkgJson);
      debug('shouldDoMarkdown: %O', shouldDoMarkdown);
      debug('shouldDoPrettier: %O', shouldDoPrettier);

      if (shouldDoMarkdown) {
        try {
          await run(
            'npx',
            [
              'remark',
              '--no-config',
              '--no-stdout',
              ...(isHushed ? ['--quiet'] : []),
              '--frail',
              '--use',
              'gfm',
              '--use',
              'lint-no-undefined-references',
              '--silently-ignore',
              '--no-ignore',
              '--ignore-pattern',
              'docs',
              ...mdFiles
            ],
            {
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          );
        } catch (error) {
          throw new CliError(ErrorMessage.MarkdownNoUndefinedReferences(), {
            cause: error
          });
        }
      }

      const status: Record<
        'sort' | 'doctoc' | 'allContrib' | 'remark' | 'prettier',
        boolean | null | undefined
      > & { failed: boolean } = {
        failed: false,
        sort: undefined,
        doctoc: undefined,
        allContrib: undefined,
        remark: undefined,
        prettier: undefined
      };

      try {
        // ? This can run completely asynchronously since nothing else relies on
        // ? it (except prettier).

        if (shouldDoPkgJson) {
          status.sort = null;
        }

        const sortedPkgJsonFiles = shouldDoPkgJson
          ? run('npx', ['sort-package-json', ...allPkgFiles]).catch((error: unknown) => {
              status.sort = false;
              throw error;
            })
          : Promise.resolve();

        if (shouldDoMarkdown) {
          // ? These have to run sequentially to prevent data corruption.

          status.doctoc = null;

          await run(
            'npx',
            ['doctoc', '--no-title', '--maxlevel', '3', '--update-only', ...mdFiles],
            {
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          ).catch((error: unknown) => {
            status.doctoc = false;
            throw error;
          });

          status.doctoc = true;

          const rootReadmeFile = `${rootDir}/README.md`;
          debug('rootReadmeFile: %O', rootReadmeFile);

          if (mdFiles.includes(rootReadmeFile)) {
            status.allContrib = null;

            await run(
              'npx',
              // ? --files arg for all-contributors is broken because yargs...
              ['all-contributors', 'generate'],
              {
                // ? ... so we ensure that this command only ever runs at root
                cwd: rootDir,
                stdout: isHushed ? 'ignore' : 'inherit',
                stderr: isQuieted ? 'ignore' : 'inherit'
              }
            ).catch((error: unknown) => {
              status.allContrib = false;
              throw error;
            });

            status.allContrib = true;
          } else {
            debug(
              'skipped regenerating all-contributors table: rootReadmeFile path not in mdFiles'
            );
          }

          status.remark = null;

          await run(
            'npx',
            [
              'remark',
              ...(isHushed ? ['--quiet'] : []),
              '--output',
              '--frail',
              '--no-ignore',
              '--silently-ignore',
              `--rc-path="${rootDir}/.remarkrc.mjs"`,
              ...mdFiles
            ],
            {
              env: {
                NODE_ENV: 'format',
                SHOULD_RENUMBER_REFERENCES: renumberReferences.toString()
              },
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          ).catch((error: unknown) => {
            status.remark = false;
            throw error;
          });

          status.remark = true;
        }

        await sortedPkgJsonFiles;

        if (shouldDoPkgJson) {
          status.sort = true;
        }

        if (shouldDoPrettier) {
          const prettierTargetFiles = (await filterOutPathsUnsupportedByPrettier(
            files
          )) ?? ['.'];

          debug('prettierTargetFiles: %O', prettierTargetFiles);

          if (prettierTargetFiles.length) {
            status.prettier = null;
            await run(
              'npx',
              [
                'prettier',
                '--write',
                ...(skipUnknown ? ['--ignore-unknown'] : []),
                ...prettierTargetFiles
              ],
              {
                stdout: isHushed ? 'ignore' : 'inherit',
                stderr: isQuieted ? 'ignore' : 'inherit'
              }
            ).catch((error: unknown) => {
              status.prettier = false;
              throw error;
            });

            status.prettier = true;
          } else {
            debug('prettierTargetFiles was empty, so prettier run was skipped');
          }
        }
      } catch {
        status.failed = true;
      }

      // TODO: replace with listr2 tasks
      genericLogger(
        [LogTag.IF_NOT_SILENCED],
        [
          `${shouldDoPkgJson ? 'Processed' : 'Encountered'} package.json files: ${allPkgFiles.length}`,
          `${SHORT_TAB}Sorted file contents: ${statusToEmoji(status.sort)}`,
          `${shouldDoMarkdown ? 'Processed' : 'Encountered'} markdown files${skipIgnored ? '' : ' (no files ignored)'}: ${mdFiles.length}`,
          `${SHORT_TAB}Synchronized TOCs: ${statusToEmoji(status.doctoc)}`,
          `${SHORT_TAB}Regenerated contributor table: ${statusToEmoji(status.allContrib)}`,
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

async function filterOutPathsUnsupportedByPrettier(files: string[] | undefined) {
  if (files === undefined) {
    return files;
  }

  const supportedExtensions = new Set(
    (await getSupportInfo()).languages.flatMap((language) => language.extensions ?? [])
  );

  const supportedFiles = files.filter((path) => {
    const fileBasename = basename(path);
    return (
      fileBasename.includes('.') &&
      supportedExtensions.has(`.${fileBasename.split('.').at(-1)!}`)
    );
  });

  return supportedFiles;
}
