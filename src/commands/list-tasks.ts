import { type ChildConfiguration } from '@black-flag/core';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { globalPreChecks } from 'universe/util';

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

const frontmatter = `\n⮞  `;

export type CustomCliArguments = GlobalCliArguments & {
  full: boolean;
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
    full: {
      boolean: true,
      description: 'List all tasks along with their implementation code',
      default: false
    }
  });

  return {
    builder,
    description: 'List all tasks (typically NPM scripts) supported by this project',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName, full }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      await globalPreChecks({ debug_, runtimeContext });

      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Gathering available tasks...');
      genericLogger.newline([LogTag.IF_NOT_QUIETED]);

      const {
        context,
        project: { json: rootPkgJson, packages: packages_ }
      } = runtimeContext;

      const workspacePkgsJson = Array.from(packages_?.values() ?? []).map(
        ({ json }) => json
      );

      debug('run context: %O', context);
      debug('root package.json contents: %O', rootPkgJson);
      debug('workspaces package json contents: %O', workspacePkgsJson);

      const packages = [rootPkgJson, ...workspacePkgsJson];

      for (const [index, { name, scripts }] of packages.entries()) {
        const pkgName = name ?? '(unnamed package)';
        const pkgLogger =
          packages.length > 1 ? genericLogger.extend(`[${pkgName}]`) : genericLogger;

        pkgLogger(
          [LogTag.IF_NOT_QUIETED],
          `Available NPM run commands for ${pkgName}:${full ? '\n' : ''}` +
            frontmatter +
            Object.entries(scripts ?? {})
              .map(([name, script], index_, array) => {
                let str = name;

                if (full) {
                  str += `\n${String(script)}${index_ < array.length - 1 ? '\n' : ''}`;
                }

                return str;
              })
              .join(frontmatter) +
            '\n'
        );

        if (index < packages.length - 1) {
          genericLogger.newline([LogTag.IF_NOT_QUIETED]);
        }
      }

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
