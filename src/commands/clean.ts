import { CliError, type ChildConfiguration } from '@black-flag/core';
import { rimraf as forceDeletePaths } from 'rimraf';

import { type AsStrictExecutionContext } from 'multiverse+bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';
import { run } from 'multiverse+run';

import {
  DefaultGlobalScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { ErrorMessage } from 'universe:error.ts';
import { runGlobalPreChecks, withGlobalBuilder, withGlobalUsage } from 'universe:util.ts';

const matchNothing = '(?!)';

/**
 * These are the default regular expressions matching paths that are excluded
 * from deletion when running the "clean" command.
 *
 * Paths that should only match directories must include a trailing slash. Paths
 * that should match at any depth (including project root) should be prefixed
 * with `(^|/)`. Note that periods must be escaped (i.e. `'\\.'`).
 */
export const defaultCleanExcludedPaths: string[] = [
  String.raw`(^|/)[^/]*\.env(\.[^/]+)?$`,
  String.raw`(^|/)\.vscode/`,
  String.raw`(^|/)\.vercel/`,
  String.raw`(^|/)\.husky/`,
  String.raw`(^|/)\.turbo/`,
  String.raw`(^|/)next-env\.d\.ts$`,
  '(^|/)node_modules/',
  '(^|/)fixtures/',
  String.raw`(^|/)\.wiki/`
];

export type CustomCliArguments = GlobalCliArguments & {
  excludePaths: string[];
  force: boolean;
};

export default function command({
  log,
  debug_,
  state: { startTime },
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
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
    usage: withGlobalUsage(
      `$1.

You must pass \`--force\` for any deletions to actually take place.

Note that the regular expressions provided via --exclude-paths are computed with the "i" and "u" flags. If you want to pass an empty array to --exclude-paths (overwriting the defaults), use \`--exclude-paths ''\``
    ),
    handler: withGlobalHandler(async function ({
      $0: scriptFullName,
      scope,
      excludePaths,
      force
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await runGlobalPreChecks({ debug_, projectMetadata_ });

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Cleaning project...');

      debug('scope: %O', scope);
      debug('excludePaths (original): %O', excludePaths);

      const excludeRegExps = excludePaths.map(
        (path) => new RegExp(path || matchNothing, 'iu')
      );

      if (scope === DefaultGlobalScope.ThisPackage) {
        // TODO: perhaps replace this and other hardcoded "packages/" paths
        // TODO: with workspace roots?
        excludeRegExps.push(/^packages\//iu);
      }

      debug('excludePaths (final): %O', excludePaths);
      debug('excludeRegExps: %O', excludeRegExps);

      const ignoredPaths = (
        await run('git', [
          'ls-files',
          '--exclude-standard',
          '--ignored',
          '--others',
          // ? Git will include trailing slash for directories :)
          '--directory'
        ])
      ).stdout.split('\n');

      debug('raw ignored paths: %O', ignoredPaths);

      const finalIgnoredPaths = ignoredPaths.filter(
        (path) => path && !excludeRegExps.some((regExp) => path.match(regExp))
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
