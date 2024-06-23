import { type ChildConfiguration } from '@black-flag/core';
import { getRunContext } from '@projector-js/core/project';
import { TAB } from 'multiverse/rejoinder';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { findProjectRoot } from 'universe/util';

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

export type CustomCliArguments = GlobalCliArguments;

export default function command({ log, debug_, state }: GlobalExecutionContext) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >();

  return {
    builder,
    description: 'List all tasks (typically NPM scripts) supported by this project',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ $0: scriptFullName }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');
      debug('entered handler');

      const { startTime } = state;

      logStartTime({ log, startTime });

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
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
