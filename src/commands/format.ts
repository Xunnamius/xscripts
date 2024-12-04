import { basename } from 'node:path';

import { run, runNoRejectOnBadExit } from '@-xun/run';
import { CliError, type ChildConfiguration } from '@black-flag/core';
import { glob } from 'glob-gitignore';
import { getSupportInfo } from 'prettier';

import { type AsStrictExecutionContext } from 'multiverse+bfe';
import { $artificiallyInvoked } from 'multiverse+bfe:symbols.ts';
import { hardAssert, softAssert } from 'multiverse+cli-utils:error.ts';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';
import { gatherProjectFiles, isRootPackage } from 'multiverse+project-utils';

import {
  deriveVirtualPrettierignoreLines,
  remarkConfigProjectBase,
  toAbsolutePath,
  toPath,
  toRelativePath,
  type AbsolutePath
} from 'multiverse+project-utils:fs.ts';

import { SHORT_TAB } from 'multiverse+rejoinder';

import {
  DefaultGlobalScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { ErrorMessage } from 'universe:error.ts';

import {
  checkArrayNotEmpty,
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage
} from 'universe:util.ts';

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
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    scope: {
      defaultDescription: `"${DefaultGlobalScope.Unlimited}" if --files given, "${DefaultGlobalScope.ThisPackage}" otherwise`,
      subOptionOf: {
        files: {
          when: () => true,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              choices: [DefaultGlobalScope.Unlimited],
              default: DefaultGlobalScope.Unlimited
            };
          }
        }
      }
    },
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
      implies: { 'skip-ignored': true },
      default: false
    },
    files: {
      array: true,
      description:
        'Only consider files (or globs) given via --files instead of scanning the filesystem',
      check: checkArrayNotEmpty('--files')
    },
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
    usage: withGlobalUsage(
      `$1.

Note that the root project's .prettierignore file (and not .gitignore!) is used as the single exclusive source of truth for which files are and are not ignored when formatters are run. To prevent a file from being formatted by _any formatter_, add it to .prettierignore. To disregard .prettierignore when formatters are run, use --no-skip-ignored.

With respect to .prettierignore being the single source of truth for formatters: note that remark is configured to respect .remarkignore files only when run by "xscripts lint"; when executing "xscripts format" (this command), .remarkignore files are always disregarded. This means you can use .remarkignore files to prevent certain paths from being linted by "xscripts lint" without preventing them from being formatted by this command.`
    ),
    handler: withGlobalHandler(async function ({
      [$artificiallyInvoked]: wasArtificiallyInvoked,
      $0: scriptFullName,
      scope,
      renumberReferences,
      skipIgnored,
      skipUnknown,
      files: files_,
      onlyPackageJson,
      onlyMarkdown,
      onlyPrettier,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger(
        [LogTag.IF_NOT_QUIETED],
        `Preparing to format ${scope === DefaultGlobalScope.ThisPackage ? "this package's" : "the entire project's"} files...`
      );

      debug('scope: %O', scope);
      debug('renumberReferences: %O', renumberReferences);
      debug('skipIgnored: %O', skipIgnored);
      debug('skipUnknown: %O', skipUnknown);
      debug('files: %O', files_);
      debug('onlyPackageJson: %O', onlyPackageJson);
      debug('onlyMarkdown: %O', onlyMarkdown);
      debug('onlyPrettier: %O', onlyPrettier);

      let sawMarkdownFilesOutsideProjectRoot = false as boolean;

      const {
        rootPackage: { root: projectRoot },
        cwdPackage,
        subRootPackages
      } = projectMetadata;

      debug('projectRoot: %O', projectRoot);
      debug('packageRoot: %O', cwdPackage.root);

      const isCwdTheProjectRoot = isRootPackage(cwdPackage);
      debug('isCwdTheProjectRoot: %O', isCwdTheProjectRoot);

      const [targetMarkdownFiles, targetPackageJsonFiles, targetOtherFiles] =
        await (async (): Promise<[AbsolutePath[], AbsolutePath[], AbsolutePath[]]> => {
          if (files_) {
            debug('using --files as targets');

            const ignore = skipIgnored
              ? await deriveVirtualPrettierignoreLines(projectRoot, {
                  includeUnknownPaths: skipUnknown,
                  useCached: true
                })
              : [];

            debug('virtual .prettierignore lines: %O', ignore);

            const sawFilesOutsideProjectRoot = files_.some(
              (path) => !toAbsolutePath(projectRoot, path).startsWith(projectRoot)
            );

            debug('sawFilesOutsideProjectRoot: %O', sawFilesOutsideProjectRoot);

            softAssert(
              !sawFilesOutsideProjectRoot || ignore.length === 0,
              ErrorMessage.CannotUseIgnoresWithPathsOutsideProjectRoot()
            );

            const files = (await glob(files_, {
              dot: true,
              absolute: true,
              nodir: true,
              // ? This addresses a strange bug with the ignores package as seen
              // ? here: https://github.com/prettier/prettier-atom/issues/490
              ...(sawFilesOutsideProjectRoot ? {} : { ignore })
            })) as AbsolutePath[];

            debug('files (post-glob): %O', files);

            const markdownFiles: AbsolutePath[] = [];
            const packageJsonFiles: AbsolutePath[] = [];
            const otherFiles: AbsolutePath[] = [];

            for (const path of files) {
              if (path.endsWith('.md')) {
                markdownFiles.push(path);
              } else if (path.endsWith('/package.json')) {
                packageJsonFiles.push(path);
              } else {
                otherFiles.push(path);
              }
            }

            if (sawFilesOutsideProjectRoot) {
              sawMarkdownFilesOutsideProjectRoot = markdownFiles.some(
                (mdPath) => !mdPath.startsWith(projectRoot)
              );
            }

            debug(
              'sawMarkdownFilesOutsideProjectRoot: %O',
              sawMarkdownFilesOutsideProjectRoot
            );

            return [
              markdownFiles,
              packageJsonFiles,
              await filterOutPathsUnsupportedByPrettier(otherFiles)
            ];
          } else {
            debug('running generic project filesystem scan');
            softAssert(skipIgnored || !skipUnknown, ErrorMessage.BadSkipArgs());

            const projectFiles = await gatherProjectFiles(projectMetadata, {
              skipIgnored,
              skipUnknown,
              useCached: true
              // ? We can safely cast this thanks to the assert above
            } as Parameters<typeof gatherProjectFiles>[1]);

            return scope === DefaultGlobalScope.ThisPackage
              ? [
                  isCwdTheProjectRoot
                    ? projectFiles.markdownFiles.inRoot
                    : projectFiles.markdownFiles.inWorkspace.get(cwdPackage.id)!,
                  [
                    isCwdTheProjectRoot
                      ? projectFiles.packageJsonFiles.atProjectRoot
                      : projectFiles.packageJsonFiles.atWorkspaceRoot.get(cwdPackage.id)!
                  ],
                  []
                ]
              : [
                  projectFiles.markdownFiles.all,
                  projectFiles.packageJsonFiles.atAnyRoot,
                  []
                ];
          }
        })();

      debug('targetMarkdownFiles: %O', targetMarkdownFiles);
      debug('targetPackageJsonFiles: %O', targetPackageJsonFiles);

      const shouldDoPackageJson =
        !onlyMarkdown && !onlyPrettier && targetPackageJsonFiles.length > 0;
      const shouldDoMarkdown =
        !onlyPackageJson && !onlyPrettier && targetMarkdownFiles.length > 0;
      const shouldDoPrettier = !onlyPackageJson && !onlyMarkdown;

      debug('shouldDoPackageJson: %O', shouldDoPackageJson);
      debug('shouldDoMarkdown: %O', shouldDoMarkdown);
      debug('shouldDoPrettier: %O', shouldDoPrettier);

      if (shouldDoMarkdown) {
        // TODO: gain noticeable speedups by switching to node-only API instead
        // TODO: of calling out via execa runners
        const { all, exitCode } = await runNoRejectOnBadExit(
          'npx',
          [
            // {@xscripts/notExtraneous remark-cli}
            'remark',
            ...(isHushed ? ['--quiet'] : []),
            '--no-stdout',
            '--frail',
            '--no-ignore',
            '--color',
            '--silently-ignore',
            '--ignore-pattern',
            'docs',
            ...targetMarkdownFiles
          ],
          {
            env: { NODE_ENV: 'lint-no-undef' },
            all: true
          }
        );

        if (exitCode !== 0) {
          if (all) {
            genericLogger.newline([LogTag.IF_NOT_SILENCED]);

            genericLogger.error(
              [all]
                .flat()
                .join('\n')
                .split('\n')
                .filter((l) => !l.includes('no issues found'))
                .join('\n')
            );

            genericLogger.newline([LogTag.IF_NOT_SILENCED]);
          }

          softAssert(ErrorMessage.MarkdownNoUndefinedReferences());
        }
      }

      genericLogger([LogTag.IF_NOT_HUSHED], 'Formatting target files...');
      debug.message('cwd override used for all executables: %O', projectRoot);

      // * truthy = ran and succeeded (number = count of successes)
      // * false = ran and failed
      // * null = running
      // * undefined = did not run
      const status: Record<
        'sort' | 'doctoc' | 'allContrib' | 'remark',
        boolean | null | undefined
      > & { failed: unknown; prettier: number | false | null | undefined } = {
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

        if (shouldDoPackageJson) {
          status.sort = null;
        }

        const sortedPackageJsonFiles = shouldDoPackageJson
          ? // {@xscripts/notExtraneous sort-package-json}
            run('npx', ['sort-package-json', ...targetPackageJsonFiles], {
              cwd: projectRoot
            }).catch((error: unknown) => {
              status.sort = false;
              throw error;
            })
          : Promise.resolve();

        if (shouldDoMarkdown) {
          // ? These have to run sequentially to prevent data corruption.

          status.doctoc = null;

          // {@xscripts/notExtraneous doctoc}
          await run(
            'npx',
            [
              'doctoc',
              '--no-title',
              '--maxlevel',
              '3',
              '--update-only',
              ...targetMarkdownFiles
            ],
            {
              cwd: projectRoot,
              stdout: isHushed ? 'ignore' : 'inherit',
              stderr: isQuieted ? 'ignore' : 'inherit'
            }
          ).catch((error: unknown) => {
            status.doctoc = false;
            throw error;
          });

          status.doctoc = true;

          const rootReadmeFile = toPath(projectRoot, 'README.md');
          debug('rootReadmeFile: %O', rootReadmeFile);

          if (targetMarkdownFiles.includes(rootReadmeFile)) {
            status.allContrib = null;

            await run(
              'npx',
              // ? --files arg for all-contributors is broken because yargs...
              ['all-contributors', 'generate'],
              {
                // ? ... so we ensure that this command only ever runs at root
                cwd: projectRoot,
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
              'skipped regenerating all-contributors table: rootReadmeFile path not in markdownFiles'
            );
          }

          status.remark = null;

          if (sawMarkdownFilesOutsideProjectRoot && !wasArtificiallyInvoked) {
            log.newline([LogTag.IF_NOT_SILENCED]);

            log.warn(
              [LogTag.IF_NOT_SILENCED],
              `one or more markdown files given via "--files" are outside of the project root. Therefore, remark will be invoked with "--rc-path" pointing to this project's root .remarkrc config file. A side effect of this is that non-root .remarkrc config files in subdirectories or elsewhere will be ignored`
            );

            log.newline([LogTag.IF_NOT_SILENCED]);
          }

          // TODO: gain noticeable speedups by switching to node-only API instead
          // TODO: of calling out via execa runners
          await run(
            'npx',
            [
              // {@xscripts/notExtraneous remark-cli}
              'remark',
              ...(isHushed ? ['--quiet'] : []),
              '--output',
              '--frail',
              '--no-ignore',
              '--silently-ignore',
              // ? This allows us to rely on remark's config search which the
              // ? --rc-path parameter seems to disable
              ...(sawMarkdownFilesOutsideProjectRoot
                ? [`--rc-path=${projectRoot}/${remarkConfigProjectBase}`]
                : []),
              ...targetMarkdownFiles
            ],
            {
              cwd: projectRoot,
              env: {
                NODE_ENV: 'format',
                XSCRIPTS_FORMAT_RENUMBER_REFERENCES: renumberReferences.toString()
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

        await sortedPackageJsonFiles;

        if (shouldDoPackageJson) {
          status.sort = true;
        }

        if (shouldDoPrettier) {
          const prettierTargetFiles = files_?.length
            ? // ? Prettier does markdown and json files too, so include them
              targetOtherFiles.concat(targetMarkdownFiles, targetPackageJsonFiles)
            : [
                // ? cwd === projectRoot (with respect to '.')
                (scope === DefaultGlobalScope.ThisPackage
                  ? toRelativePath(projectRoot, cwdPackage.root)
                  : '') || '.',
                ...(scope === DefaultGlobalScope.ThisPackage
                  ? Array.from(subRootPackages?.values() || []).map(
                      ({ root: packageRoot }) => {
                        // ? cwd === projectRoot
                        return `!${toRelativePath(projectRoot, packageRoot)}`;
                      }
                    )
                  : [])
              ];

          debug('prettierTargetFiles: %O', prettierTargetFiles);

          if (prettierTargetFiles.length) {
            status.prettier = null;
            const { all: outputLines } = await run(
              'npx',
              [
                'prettier',
                '--write',
                '--color',
                // * Overrides prettier's default (which includes .gitignore)
                `--ignore-path=${projectRoot}/.prettierignore`,
                ...(skipUnknown ? ['--ignore-unknown'] : []),
                ...prettierTargetFiles
              ],
              { cwd: projectRoot, all: true }
            ).catch((error: unknown) => {
              status.prettier = false;
              throw error;
            });

            hardAssert(typeof outputLines === 'string', ErrorMessage.GuruMeditation());
            status.prettier = outputLines.split('\n').length;
          } else {
            debug('prettierTargetFiles was empty, so prettier run was skipped');
          }
        }
      } catch (error) {
        status.failed = error;
      }

      genericLogger.newline([LogTag.IF_NOT_SILENCED]);

      // TODO: replace with listr2 tasks
      genericLogger(
        [LogTag.IF_NOT_SILENCED],
        [
          `${shouldDoPackageJson ? 'Processed' : 'Encountered'} package.json files: ${targetPackageJsonFiles.length}`,
          `${SHORT_TAB}Sorted file contents: ${statusToEmoji(status.sort)}`,
          `${shouldDoMarkdown ? 'Processed' : 'Encountered'} markdown files${skipIgnored ? '' : ' (no files ignored)'}: ${targetMarkdownFiles.length}`,
          `${SHORT_TAB}Synchronized TOCs: ${statusToEmoji(status.doctoc)}`,
          `${SHORT_TAB}Regenerated contributor table: ${statusToEmoji(status.allContrib)}`,
          `${SHORT_TAB}Reformatted files: ${statusToEmoji(status.remark)}`,
          `Prettified files ${
            scope === DefaultGlobalScope.ThisPackage
              ? 'in this package'
              : 'across the entire project'
          }: ${
            typeof status.prettier === 'number'
              ? status.prettier
              : statusToEmoji(status.prettier)
          }`
        ].join('\n')
      );

      genericLogger.newline([LogTag.IF_NOT_SILENCED]);

      if (status.failed) {
        throw new CliError(ErrorMessage.CommandDidNotComplete('format'), {
          cause: status.failed
        });
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

async function filterOutPathsUnsupportedByPrettier(files: AbsolutePath[]) {
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
