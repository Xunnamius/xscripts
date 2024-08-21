import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

import { CliError, type ChildConfiguration } from '@black-flag/core';
import conventionalChangelogCore from 'conventional-changelog-core';
import { valid as isValidSemver } from 'semver';

import {
  getInvocableExtendedHandler,
  type AsStrictExecutionContext
} from 'multiverse/@black-flag/extensions';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse/@-xun/cli-utils/logging';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse/@-xun/cli-utils/extensions';

import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';
import { softAssert } from 'multiverse/@-xun/cli-utils/error';

import {
  default as format,
  type CustomCliArguments as FormatCliArguments
} from 'universe/commands/format';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { ErrorMessage } from 'universe/error';
import { checkIsNotNil, globalPreChecks, readFile, writeFile } from 'universe/util';

import {
  type ConventionalChangelogCliConfig,
  defaultChangelogTopmatter
} from 'universe/assets/config/_conventional.config.js';

import type { Promisable } from 'type-fest';

const extractVersionRegExp = /^#+\s\[?([^\s\]]+)/;

/**
 * Determines the output format of the changelog file.
 */
export enum OutputOrder {
  /**
   * Sections (heading level 2) are comprised of major and minor releases with
   * patch changes becoming subsections (heading level 3) of their nearest
   * major/minor release section.
   *
   * Such changelogs read as a "storybook".
   */
  Storybook = 'storybook',
  /**
   * The default changelog formatting where sections are listed in chronological
   * release order.
   */
  Descending = 'descending'
}

/**
 * @see {@link OutputOrder}.
 */
export const availableOutputOrders = Object.values(OutputOrder);

export type CustomCliArguments = GlobalCliArguments & {
  skipTopmatter: boolean;
  patchChangelog: boolean;
  formatChangelog: boolean;
  onlyPatchChangelog: boolean;
  outputUnreleased: boolean;
  outputOrder: OutputOrder;
  importSectionFile: string;
  changelogFile: string;
};

export default function command(
  globalExecutionContext: AsStrictExecutionContext<GlobalExecutionContext>
) {
  const { log, debug_, state, runtimeContext } = globalExecutionContext;

  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    'skip-topmatter': {
      boolean: true,
      description: 'Do not prepend topmatter when compiling output',
      default: false,
      implies: { 'format-changelog': false },
      looseImplications: true
    },
    'patch-changelog': {
      boolean: true,
      description: 'Patch compiled output using the nearest changelog patcher file',
      default: true
    },
    'only-patch-changelog': {
      boolean: true,
      description:
        'Instead of compiling new output, only patch an existing changelog file',
      default: false,
      conflicts: ['skip-topmatter', 'output-order', 'import-section-file'],
      implies: { 'patch-changelog': true }
    },
    'format-changelog': {
      boolean: true,
      description: 'Run the "format" command on compiled output',
      default: true
    },
    'output-unreleased': {
      boolean: true,
      description: 'Add all commits, including unreleased commits, to the changelog',
      default: false
    },
    'output-order': {
      choices: availableOutputOrders,
      description: 'Set the order in which sections are written to the changelog',
      default: 'storybook'
    },
    'import-section-file': {
      string: true,
      description: 'Add a custom section from the given file to the changelog',
      conflicts: 'only-patch-changelog',
      check: checkIsNotNil
    },
    'changelog-file': {
      string: true,
      description: 'The path to the changelog file to generate/update',
      default: 'CHANGELOG.md',
      check: checkIsNotNil
    }
  });

  return {
    builder,
    description: 'Compile a changelog from conventional commits',
    usage: withStandardUsage(
      '$1.\n\nUse --output-order to control the order in which major, minor, and patch version sections will be output to the changelog. The default order is "storybook," which places patch versions below the nearest major/minor version section. The other choice is "descending," which will output sections in the more familiar chronological descending order.\n\nUse --patch-changelog and --no-patch-changelog (or --only-patch-changelog) to control changelog file patching via the changelog.patch.js (or changelog.patch.[cm]js) file. Searching for this file will begin at the current working directory and, if not found, continue up to the project root. See the xscripts documentation for further details.\n\nUse --import-section-file to add a custom release section to the changelog. The file must contain a single custom release section generated by conventional-changelog. This is useful when, for instance, semantic-release generates a new release section that we want to include in our final changelog file.'
    ),
    handler: withStandardHandler(async function (argv) {
      const {
        $0: scriptFullName,
        skipTopmatter,
        formatChangelog,
        patchChangelog,
        onlyPatchChangelog,
        outputUnreleased,
        outputOrder,
        importSectionFile,
        changelogFile
      } = argv;

      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Compiling changelog...');

      const {
        project: { root }
      } = runtimeContext;

      debug('skipTopmatter: %O', skipTopmatter);
      debug('formatChangelog: %O', formatChangelog);
      debug('patchChangelog: %O', patchChangelog);
      debug('onlyPatchChangelog: %O', onlyPatchChangelog);
      debug('outputUnreleased: %O', outputUnreleased);
      debug('outputOrder: %O', outputOrder);
      debug('importSectionFile: %O', importSectionFile);
      debug('changelogFile: %O', changelogFile);

      if (onlyPatchChangelog) {
        debug(`skipped regenerating ${changelogFile}`);
      } else {
        const conventionalConfigPath = `${root}/conventional.config.js`;

        debug('conventionalConfigPath: %O', conventionalConfigPath);
        debug('outputting changelog to path: %O', changelogFile);

        const conventionalConfig = await (async () => {
          try {
            const { default: config } = await import(conventionalConfigPath);

            if (!config) {
              throw new Error(ErrorMessage.DefaultImportFalsy());
            }

            return config as ConventionalChangelogCliConfig;
          } catch (error) {
            throw new CliError(
              ErrorMessage.CannotImportConventionalConfig(conventionalConfigPath),
              { cause: error }
            );
          }
        })();

        debug.extend('cc')('conventionalConfig: %O', conventionalConfig);

        const { gitRawCommitsOpts, parserOpts, writerOpts } = conventionalConfig;
        // TODO: perhaps this can be of use later...
        const handlebarsTemplateGlobalContext = undefined;

        const changelogSectionStream = conventionalChangelogCore(
          {
            config: conventionalConfig,
            releaseCount: 0,
            skipUnstable: true,
            outputUnreleased,
            warn: genericLogger.extend('cc-core').warn
          },
          handlebarsTemplateGlobalContext,
          gitRawCommitsOpts,
          parserOpts,
          writerOpts
        );

        const changelogOutputStream = createWriteStream(changelogFile);

        if (skipTopmatter) {
          debug(`skipped prepending topmatter to ${changelogFile}`);
        } else {
          debug(`prepending topmatter to ${changelogFile}`);
          debug('defaultChangelogTopmatter: %O', defaultChangelogTopmatter);
          changelogOutputStream.write(`${defaultChangelogTopmatter}\n\n`);
        }

        debug('running pipeline...');

        const withheldChangelogPatchSections: string[] = [];
        let additionalSection: { version: string; notes: string } | undefined = undefined;

        if (importSectionFile) {
          debug('importing additional release section from: %O', importSectionFile);

          const additionalSectionNotes = await readFile(importSectionFile);
          const additionalSectionVersion = additionalSectionNotes
            .match(extractVersionRegExp)
            ?.at(1);

          softAssert(
            additionalSectionVersion && isValidSemver(additionalSectionVersion),
            ErrorMessage.BadAdditionalChangelogSection(importSectionFile)
          );

          additionalSection = {
            version: additionalSectionVersion,
            notes: additionalSectionNotes
          };

          debug('additionalSection: %O', additionalSection);
        }

        await pipeline(
          changelogSectionStream,

          // ! These generator functions expects commits to arrive in
          // ! descending release order (latest first).

          async function* (source) {
            const debug_ = debug.extend('tap1');
            debug_('initialized tap1 on changelog section stream');

            source.setEncoding('utf8');

            if (additionalSection) {
              const { notes: additionalChunk } = additionalSection;

              debug_('flushing additional section as first chunk');
              yield additionalChunk;
            }

            for await (const currentChunk of source as unknown as string[]) {
              debug_('passing through chunk: %O', currentChunk.slice(0, 20), '...');
              yield currentChunk;
            }
          },

          async function* (source) {
            const debug_ = debug.extend('tap2');
            debug_('initialized tap2 on changelog section stream');

            let isFirst = true;

            for await (const chunk of source as unknown as string[]) {
              debug_('saw chunk: %O', chunk.slice(0, 20), '...');

              if (outputOrder === OutputOrder.Descending) {
                debug_('descending sort order: chunk passed through as-is');
                yield chunk;
              } else {
                const isPatchChunk = chunk.startsWith('### ');

                if (!isPatchChunk) {
                  debug_('storybook sort order: non-patch chunk passed through');

                  if (!skipTopmatter || !isFirst) {
                    yield '<br />\n\n';
                  }

                  isFirst = false;
                  yield chunk;

                  debug_(
                    'storybook sort order: %O patch chunks released',
                    withheldChangelogPatchSections.length
                  );

                  if (withheldChangelogPatchSections.length) {
                    yield '٠ –— ٠ —— ٠ —— ٠  —– ٠<br />\n\n';

                    for (const section of withheldChangelogPatchSections.reverse()) {
                      yield '### 🏗️ Patch ' + section.slice(4);
                    }

                    withheldChangelogPatchSections.length = 0;
                  }
                } else {
                  debug_('storybook sort order: patch chunk held');
                  withheldChangelogPatchSections.push(chunk);
                  yield '';
                }
              }
            }

            if (withheldChangelogPatchSections.length) {
              debug_(
                'storybook sort order: %O patch chunks released (no non-patch available)',
                withheldChangelogPatchSections.length
              );

              for (const section of withheldChangelogPatchSections) {
                // ? These are probably pre-1.0.0 sections. Give each of this
                // ? patches-only changelog's sections -1 heading level (i.e.
                // ? promote them)
                yield section.slice(1);
              }

              withheldChangelogPatchSections.length = 0;
            }
          },

          changelogOutputStream
        );
      }

      if (formatChangelog) {
        debug(`formatting ${changelogFile} (calling out to sub-command)`);

        const formatHandler = await getInvocableExtendedHandler<
          FormatCliArguments,
          GlobalExecutionContext
        >(format, globalExecutionContext);

        await formatHandler({
          ...argv,
          $0: 'format',
          _: [],
          files: [changelogFile],
          silent: true,
          quiet: true,
          hush: true,
          renumberReferences: true,
          skipIgnored: false,
          skipUnknown: false,
          onlyPackageJson: false,
          onlyMarkdown: false,
          onlyPrettier: false
        });

        debug('sub-command completed successfully');
      } else {
        debug(`skipped formatting ${changelogFile}`);
      }

      const { findUp } = await import('find-up');
      const changelogPatcherFile = await findUp([
        'changelog.patch.mjs',
        'changelog.patch.cjs',
        'changelog.patch.js'
      ]);

      if (patchChangelog && changelogPatcherFile) {
        debug('importing changelog patcher at: %O', changelogPatcherFile);

        let changelogPatcher: ImportedChangelogPatcher | undefined = undefined;

        try {
          changelogPatcher = await import(changelogPatcherFile);
          debug('import successful');
        } catch (error) {
          debug('import attempt failed catastrophically: %O', error);
          throw new CliError(ErrorMessage.BadChangelogPatcher(changelogPatcherFile), {
            cause: error
          });
        }

        debug('changelogPatcher: %O', changelogPatcher);

        if (changelogPatcher) {
          // ? ESM <=> CJS interop. If there's a default property, we'll use it.
          if (changelogPatcher.default !== undefined) {
            changelogPatcher = changelogPatcher.default;
          }

          // ? ESM <=> CJS interop, again. See: @black-flag/core/src/discover.ts
          // ! We cannot trust the type of changelogPatcher.default yet
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (changelogPatcher?.default !== undefined) {
            changelogPatcher = changelogPatcher.default;
          }
        }

        if (changelogPatcher) {
          const contents = await readFile(changelogFile);
          const patcher = (changelog: string, patches: ChangelogPatches) => {
            // eslint-disable-next-line unicorn/no-array-reduce
            return patches.reduce(function (str, [searchValue, replaceValue]) {
              return str.replace(searchValue, replaceValue);
            }, changelog);
          };

          if (typeof changelogPatcher === 'function') {
            debug('invoking changelogPatcher as a function');
            await writeFile(changelogFile, await changelogPatcher(contents, patcher));
          } else if (Array.isArray(changelogPatcher)) {
            debug('invoking patcher using changelogPatcher array');
            await writeFile(changelogFile, patcher(contents, changelogPatcher));
          } else {
            throw new CliError(ErrorMessage.BadChangelogPatcher(changelogPatcherFile));
          }
        } else {
          throw new CliError(ErrorMessage.BadChangelogPatcher(changelogPatcherFile));
        }
      } else {
        debug(
          `${patchChangelog ? 'no changelog.patch.js (or changelog.patch.[cm]js) file found' : 'changelog patching manually disabled'}; changelog patching skipped`
        );
      }

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}

/**
 * A changelog patch that will be applied to the changelog file.
 *
 * It mirrors the parameters of {@link String.prototype.replace} in form and
 * function. That is: each `ChangelogPatch` `searchValue` will be replaced by
 * `replaceValue` in the changelog file.
 *
 * Note that replacements are made in-place, meaning order does matter.
 */
export type ChangelogPatch = [searchValue: string | RegExp, replaceValue: string];

/**
 * An array of zero or more {@link ChangelogPatch}es.
 *
 * `changelog.patch.js` (or `changelog.patch.[cm]js`) can export via default
 * either `ChangelogPatches` or a {@link ChangelogPatcherFunction}.
 */
export type ChangelogPatches = ChangelogPatch[];

/**
 * A function that receives the current contents of the changelog file and a
 * `patcher` function. `ChangelogPatcherFunction` must return a string that will
 * become the new contents of the changelog file.
 *
 * `patcher` is the optional second parameter of `ChangelogPatcherFunction` that
 * accepts a `changelog` string and `patches`, which is an array of
 * {@link ChangelogPatches}. `patcher` can be used to quickly apply an array of
 * `patches` to the given `changelog` string. Its use is entirely optional.
 *
 * `changelog.patch.js` (or `changelog.patch.[cm]js`) can export via default
 * either `ChangelogPatcherFunction` or a {@link ChangelogPatches} array.
 */
export type ChangelogPatcherFunction = (
  changelog: string,
  patcher: (changelog: string, patches: ChangelogPatches) => string
) => Promisable<string>;

/**
 * Represents the result of importing a `changelog.patch.js` (or
 * `changelog.patch.[cm]js`) file from a CJS/ESM file.
 */
export type ImportedChangelogPatcher = (ChangelogPatches | ChangelogPatcherFunction) & {
  default?: ImportedChangelogPatcher;
};
