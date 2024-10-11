import { type ChildConfiguration } from '@black-flag/core';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse#cli-utils logging.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';
import { type AsStrictExecutionContext } from 'multiverse#bfe';

import { withGlobalBuilder, withGlobalUsage, runGlobalPreChecks } from 'universe util.ts';

import {
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

const frontmatter = `\n⮞  `;

export type CustomCliArguments = GlobalCliArguments & {
  full: boolean;
};

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    full: {
      boolean: true,
      description: 'List all tasks along with their implementation code',
      default: false
    }
  });

  return {
    builder,
    description: 'List all tasks (typically NPM scripts) supported by this project',
    usage: withGlobalUsage(),
    handler: withGlobalHandler(async function ({ $0: scriptFullName, full }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Gathering available tasks...');
      genericLogger.newline([LogTag.IF_NOT_QUIETED]);

      const {
        type,
        project: { json: rootPkgJson, packages: packages_ }
      } = projectMetadata;

      const workspacePkgsJson = Array.from(packages_?.values() ?? []).map(
        ({ json }) => json
      );

      debug('run context: %O', type);
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
