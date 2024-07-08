import { type ChildConfiguration } from '@black-flag/core';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { checkChoicesNotEmpty, globalPreChecks } from 'universe/util';

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
import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';
import { run } from 'multiverse/run';
import { ErrorMessage } from 'universe/error';

export type CustomCliArguments = GlobalCliArguments & {
  entries: string[];
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
    entries: {
      alias: ['entry'],
      array: true,
      description: 'The entry point(s) of your documentation',
      default: [
        'lib/**/*.ts',
        'src/**/*.ts',
        'test/**/*.ts',
        'types/**/*.ts',
        'external-scripts/*.ts',
        'external-scripts/*/index.ts'
      ],
      check: checkChoicesNotEmpty('--entries')
    }
  });

  return {
    aliases: ['docs'],
    builder,
    description: 'Generate documentation from source and assets',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({
      $0: scriptFullName,
      entries,
      hush: isHushed,
      quiet: isQuieted
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Generating documentation...');

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
          'tsconfig.docs.json',
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
