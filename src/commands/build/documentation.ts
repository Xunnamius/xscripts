import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse#bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse#cli-utils logging.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';
import { Tsconfig } from 'multiverse#project-utils fs/index.ts';
import { run } from 'multiverse#run';

import {
  ThisPackageGlobalScope as DocumentationBuilderScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

import {
  checkArrayNotEmpty,
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage
} from 'universe util.ts';

/**
 * @see {@link DocumentationBuilderScope}
 */
export const documentationBuilderScopes = Object.values(DocumentationBuilderScope);

export type CustomCliArguments = GlobalCliArguments<DocumentationBuilderScope> & {
  entries: string[];
};

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const { root: projectRoot } = projectMetadata_?.project || {};
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    scope: { choices: documentationBuilderScopes },
    entries: {
      alias: ['entry'],
      array: true,
      description: 'The entry point(s) of your documentation',
      default: projectRoot
        ? [
            'src/**/*.ts',
            'test/**/*.ts',
            `${projectRoot === process.cwd() ? '' : `${projectRoot}/`}types/**/*.ts`
          ]
        : '(project-dependent)',
      check: checkArrayNotEmpty('--entries')
    }
  });

  return {
    aliases: ['docs'],
    builder,
    description: 'Generate documentation from source and assets',
    usage: withGlobalUsage(),
    handler: withGlobalHandler(async function ({
      $0: scriptFullName,
      scope,
      entries,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Generating documentation...');

      debug('scope (unused): %O', scope);
      debug('entries: %O', entries);

      genericLogger.newline([LogTag.IF_NOT_QUIETED]);

      await run(
        'npx',
        [
          'typedoc',

          '--plugin',
          'typedoc-plugin-markdown',
          '--skipErrorChecking',
          '--excludeInternal',
          '--cleanOutputDir',
          '--tsconfig',
          Tsconfig.PackageDocumentation,
          '--out',
          'docs',
          '--readme',
          'none',
          '--exclude',
          '**/*.test.*',
          '--exclude',
          '**/bin',

          ...entries
        ],
        {
          stdout: isHushed ? 'ignore' : 'inherit',
          stderr: isQuieted ? 'ignore' : 'inherit'
        }
      );

      genericLogger.newline([LogTag.IF_NOT_QUIETED]);
      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
