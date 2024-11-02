import { type ChildConfiguration } from '@black-flag/core';
import { type PackageJson } from 'type-fest';

import { type AsStrictExecutionContext } from 'multiverse+bfe';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';

import {
  DefaultGlobalScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { runGlobalPreChecks, withGlobalBuilder, withGlobalUsage } from 'universe:util.ts';

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

      const { type, rootPackage, cwdPackage, subRootPackages } = projectMetadata;
      const { json: rootPackageJson } = rootPackage;

      const subrootPackagesJson =
        scope === DefaultGlobalScope.ThisPackage
          ? []
          : Array.from(subRootPackages?.all.values() ?? []).map(({ json }) => json);

      debug('repo type: %O', type);
      debug('root package.json contents: %O', rootPackageJson);
      debug('sub-root packages json contents: %O', subrootPackagesJson);

      const packages = [
        scope === DefaultGlobalScope.ThisPackage ? cwdPackage.json : rootPackageJson,
        ...subrootPackagesJson
      ];

      let savedForLast = '';

      for (const [index, packageJson] of packages.entries()) {
        const { scripts } = packageJson;

        const isCwdPackage = cwdPackage.json === packageJson;
        const packageName = getPackageName(packageJson);
        const packageFullName =
          packageName +
          (subrootPackagesJson.length && index === 0 ? ' (root package)' : '') +
          (isCwdPackage ? ' (current package)' : '');

        const packageLogger = getPackageLogger(packageName);

        const tasks = Object.entries(scripts ?? {})
          .map(([name, script], index_, array) => {
            let str = name;

            if (full) {
              str += `\n${String(script)}${index_ < array.length - 1 ? '\n' : ''}`;
            }

            return str;
          })
          .join(frontmatter);

        const output =
          `${packageFullName}:${full ? '\n' : ''}` +
          (tasks ? frontmatter + tasks : '\n(none)') +
          '\n';

        if (isCwdPackage) {
          savedForLast = output;
        } else {
          packageLogger([LogTag.IF_NOT_QUIETED], output);
          genericLogger.newline([LogTag.IF_NOT_QUIETED]);
        }
      }

      if (savedForLast) {
        const packageName = getPackageName(cwdPackage.json);
        getPackageLogger(packageName)([LogTag.IF_NOT_QUIETED], savedForLast);
        genericLogger.newline([LogTag.IF_NOT_QUIETED]);
      }

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);

      function getPackageName({ name }: PackageJson) {
        return name ?? '(unnamed package)';
      }

      function getPackageLogger(packageName: string) {
        return genericLogger.extend(`[${packageName}]`);
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
