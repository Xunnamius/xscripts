import { CliError, type ChildConfiguration } from '@black-flag/core';
import { rimraf as forceDeletePaths } from 'rimraf';

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

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { ErrorMessage } from 'universe/error';
import { runGlobalPreChecks } from 'universe/util';

const matchNothing = '(?!)';

/**
 * These are the default regular expressions matching paths that are excluded
 * from deletion when running the "clean" command.
 */
const defaultCleanExcludedPaths: string[] = [
  '^.env$',
  '^.vscode/',
  '^.vercel/',
  '^.husky/',
  '^.turbo/',
  '^next-env.d.ts$',
  '^node_modules/'
];

export type CustomCliArguments = GlobalCliArguments & {
  excludePaths: string[];
  force: boolean;
};

export default function command({
  log,
  debug_,
  state: { startTime },
  runtimeContext: runtimeContext_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    'exclude-paths': {
      array: true,
      default: defaultCleanExcludedPaths,
      describe: 'Paths matching these regular expressions will never be deleted'
    },
    force: {
      boolean: true,
      default: false,
      describe: 'Actually perform the deletion rather than the default dry run'
    }
  });

  return {
    builder,
    description:
      'Permanently delete paths ignored by or unknown to git (with exceptions)',
    usage: withStandardUsage(
      '$1. You must pass `--force` for any deletions to actually take place.\n\nNote that the regular expressions provided via --exclude-paths are computed with the "i" and "u" flags. If you want to pass an empty array to --exclude-paths, use `--exclude-paths \'\'`'
    ),
    handler: withStandardHandler(async function ({
      $0: scriptFullName,
      excludePaths,
      force
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, runtimeContext_ });

      const excludeRegExps = excludePaths.map(
        (path) => new RegExp(path || matchNothing, 'iu')
      );

      debug('excludePaths: %O', excludePaths);
      debug('excludeRegExps: %O', excludeRegExps);

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Cleaning project...');

      const ignoredPaths = (
        await run('git', [
          'ls-files',
          '--exclude-standard',
          '--ignored',
          '--others',
          '--directory'
        ])
      ).stdout.split('\n');

      debug('raw ignored paths: %O', ignoredPaths);

      const finalIgnoredPaths = ignoredPaths.filter(
        (path) => !excludeRegExps.some((regExp) => path.match(regExp))
      );

      debug('final ignored paths: %O', finalIgnoredPaths);
      genericLogger([LogTag.IF_NOT_HUSHED], 'Deletion targets: %O', finalIgnoredPaths);

      if (force) {
        genericLogger([LogTag.IF_NOT_HUSHED], 'Performing deletions...');
        await forceDeletePaths(finalIgnoredPaths);
      } else {
        throw new CliError(ErrorMessage.CleanCalledWithoutForce());
      }

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
