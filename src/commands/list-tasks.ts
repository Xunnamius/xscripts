import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse#bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse#cli-utils logging.ts';

import { scriptBasename } from 'multiverse#cli-utils util.ts';

import {
  DefaultGlobalScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

import { runGlobalPreChecks, withGlobalBuilder, withGlobalUsage } from 'universe util.ts';

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
    scope: { default: DefaultGlobalScope.Unlimited },
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
    handler: withGlobalHandler(async function ({ $0: scriptFullName, scope, full }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Gathering available tasks...');

      debug('scope: %O', scope);

      genericLogger.newline([LogTag.IF_NOT_QUIETED]);

      const { type, project, package: pkg } = projectMetadata;

      const cwdPkg = pkg || project;
      const { json: rootPkgJson, packages: packages_ } = project;

      const workspacePkgsJson =
        scope === DefaultGlobalScope.ThisPackage
          ? []
          : Array.from(packages_?.all.values() ?? []).map(({ json }) => json);

      debug('repo type: %O', type);
      debug('root package.json contents: %O', rootPkgJson);
      debug('workspace packages json contents: %O', workspacePkgsJson);

      const packages = [
        scope === DefaultGlobalScope.ThisPackage ? cwdPkg.json : rootPkgJson,
        ...workspacePkgsJson
      ];

      for (const [index, pkgJson] of packages.entries()) {
        const { name, scripts } = pkgJson;

        const pkgName = name ?? '(unnamed package)';
        const pkgFullName =
          pkgName +
          (workspacePkgsJson.length && index === 0 ? ' (root package)' : '') +
          (cwdPkg.json === pkgJson ? ' (current package)' : '');

        const pkgLogger = genericLogger.extend(`[${pkgName}]`);

        const tasks = Object.entries(scripts ?? {})
          .map(([name, script], index_, array) => {
            let str = name;

            if (full) {
              str += `\n${String(script)}${index_ < array.length - 1 ? '\n' : ''}`;
            }

            return str;
          })
          .join(frontmatter);

        pkgLogger(
          [LogTag.IF_NOT_QUIETED],
          `${pkgFullName}:${full ? '\n' : ''}` +
            (tasks ? frontmatter + tasks : '\n(none)') +
            '\n'
        );

        genericLogger.newline([LogTag.IF_NOT_QUIETED]);
      }

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
