import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

import { CliError, type ChildConfiguration } from '@black-flag/core';
import conventionalChangelogCore from 'conventional-changelog-core';

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

import {
  default as format,
  type CustomCliArguments as FormatCliArguments
} from 'universe/commands/format';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { ErrorMessage } from 'universe/error';
import { globalPreChecks, readFile, writeFile } from 'universe/util';

import {
  type ConventionalChangelogCliConfig,
  defaultChangelogTopmatter
} from 'universe/assets/config/_conventional.config.js';

import type { Promisable } from 'type-fest';

export enum OutputOrder {
  Storybook = 'storybook',
  Descending = 'descending'
}

export const availableOutputOrders = Object.values(OutputOrder);

export type CustomCliArguments = GlobalCliArguments & {
  skipTopmatter: boolean;
  patchChangelog: boolean;
  formatChangelog: boolean;
  onlyPatchChangelog: boolean;
  outputUnreleased: boolean;
  outputOrder: OutputOrder;
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
        'Instead of compiling new output, only patch an existing CHANGELOG.md file',
      default: false,
      conflicts: 'skip-topmatter',
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
    }
  });

  return {
    builder,
    description: 'Compile a changelog from conventional commits',
    usage: withStandardUsage(
      '$1.\n\nUse --output-order to control the order in which major, minor, and patch version sections will be output to CHANGELOG.md. The default order is "storybook," which places patch versions below the nearest major/minor version section. The other choice is "descending," which will output sections in the more familiar chronological descending order.\n\nUse --patch-changelog and --no-patch-changelog (or --only-patch-changelog) to control CHANGELOG.md patching via the changelog.patch.js (or changelog.patch.[cm]js) file. Searching for this file will begin at the current working directory and, if not found, continue up to the project root.\n\nSee the xscripts documentation for details.'
    ),
    handler: withStandardHandler(async function (argv) {
      const {
        $0: scriptFullName,
        skipTopmatter,
        formatChangelog,
        patchChangelog,
        onlyPatchChangelog,
        outputUnreleased,
        outputOrder
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

      if (onlyPatchChangelog) {
        debug('skipped regenerating CHANGELOG.md');
      } else {
        const conventionalConfigPath = `${root}/conventional.config.js`;
        const changelogOutputPath = 'CHANGELOG.md';

        debug('conventionalConfigPath: %O', conventionalConfigPath);
        debug('outputting changelog to path: %O', changelogOutputPath);

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

        const changelogOutputStream = createWriteStream(changelogOutputPath);

        if (skipTopmatter) {
          debug('skipped prepending topmatter to CHANGELOG.md');
        } else {
          debug('prepending topmatter to CHANGELOG.md');
          debug('defaultChangelogTopmatter: %O', defaultChangelogTopmatter);
          changelogOutputStream.write(`${defaultChangelogTopmatter}\n\n`);
        }

        const withheldChangelogPatchSections: string[] = [];

        await pipeline(
          changelogSectionStream,
          async function* (source) {
            const debug_ = debug.extend('tap');
            debug_('initialized tap on changelog section stream');

            let isFirst = true;
            source.setEncoding('utf8');

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
                    yield '٠ —– ٠ —— ٠ –— ٠  —– ٠<br />\n\n';

                    for (const section of withheldChangelogPatchSections) {
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
        debug('formatting CHANGELOG.md (calling out to sub-command)');

        const formatHandler = await getInvocableExtendedHandler<
          FormatCliArguments,
          GlobalExecutionContext
        >(format, globalExecutionContext);

        await formatHandler({
          ...argv,
          $0: 'format',
          _: [],
          files: ['CHANGELOG.md'],
          silent: true,
          quiet: true,
          hush: true,
          renumberReferences: false,
          skipIgnored: false,
          skipUnknown: false,
          onlyPackageJson: false,
          onlyMarkdown: false,
          onlyPrettier: false
        });

        debug('sub-command completed successfully');
      } else {
        debug('skipped formatting CHANGELOG.md');
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
          const contents = await readFile('CHANGELOG.md');
          const patcher = (changelog: string, patches: ChangelogPatches) => {
            // eslint-disable-next-line unicorn/no-array-reduce
            return patches.reduce(
              (str, [searchValue, replaceValue]) =>
                str.replace(searchValue, replaceValue),
              changelog
            );
          };

          if (typeof changelogPatcher === 'function') {
            debug('invoking changelogPatcher as a function');
            await writeFile('CHANGELOG.md', await changelogPatcher(contents, patcher));
          } else if (Array.isArray(changelogPatcher)) {
            debug('invoking patcher using changelogPatcher array');
            await writeFile('CHANGELOG.md', patcher(contents, changelogPatcher));
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
 * A changelog patch that will be applied to the contents of `CHANGELOG.md`.
 *
 * It mirrors the parameters of {@link String.prototype.replace} in form and
 * function. That is: each `ChangelogPatch` `searchValue` will be replaced by
 * `replaceValue` in the contents of `CHANGELOG.md`.
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
 * A function that receives the current contents of `CHANGELOG.md` and a
 * `patcher` function. `ChangelogPatcherFunction` must return a string that will
 * become the new contents of `CHANGELOG.md`.
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
