import { ChildConfiguration } from '@black-flag/core';
import { getRunContext } from '@projector-js/core/project';
import { TAB } from 'multiverse/rejoinder';

import { CustomExecutionContext } from 'universe/configure';
import { LogTag, standardSuccessMessage } from 'universe/constant';

import {
  GlobalCliArguments,
  findProjectRoot,
  logStartTime,
  makeUsageString,
  withGlobalOptions,
  withGlobalOptionsHandling
} from 'universe/util';

export type CustomCliArguments = GlobalCliArguments;

export default async function command({
  log: genericLogger,
  debug_,
  state
}: CustomExecutionContext) {
  const [builder, builderData] = await withGlobalOptions<CustomCliArguments>();

  return {
    builder,
    description: 'List all tasks (typically NPM scripts) supported by this project',
    usage: makeUsageString(),
    handler: await withGlobalOptionsHandling<CustomCliArguments>(
      builderData,
      async function () {
        const debug = debug_.extend('handler');
        debug('entered handler');

        const { startTime } = state;

        logStartTime({ log: genericLogger, startTime });

        const projectRootPath = await findProjectRoot();
        debug('project root path: %O', projectRootPath);

        const {
          context,
          project: { json: rootPkgJson, packages: packages_ }
        } = getRunContext();

        const workspacePkgsJson = Array.from(packages_?.values() || []).map(
          ({ json }) => json
        );

        debug('run context: %O', context);
        debug('root package.json contents: %O', rootPkgJson);
        debug('workspaces package json contents: %O', workspacePkgsJson);

        for (const { name, scripts } of [rootPkgJson, ...workspacePkgsJson]) {
          const pkgName = name || '(unnamed package)';
          const pkgLogger = genericLogger.extend(`[${pkgName}]`);

          pkgLogger(
            [LogTag.IF_NOT_QUIETED],
            `Available NPM run commands for ${pkgName}:\n\n` +
              TAB +
              Object.keys(scripts || {}).join(`\n${TAB}`) +
              '\n'
          );
        }

        genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
      }
    )
  } satisfies ChildConfiguration<CustomCliArguments, CustomExecutionContext>;
}

export { command };
