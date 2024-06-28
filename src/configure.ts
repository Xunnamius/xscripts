import {
  CliError,
  type ConfigureArguments,
  type ConfigureExecutionContext
} from '@black-flag/core';

import { getRunContext } from '@projector-js/core/project';

import { globalDebuggerNamespace, globalLoggerNamespace } from 'universe/constant';

import { createDebugLogger, createGenericLogger } from 'multiverse/rejoinder';

import {
  makeStandardConfigureErrorHandlingEpilogue,
  makeStandardConfigureExecutionContext
} from 'multiverse/@-xun/cli-utils/configure';

import {
  type StandardCommonCliArguments,
  type StandardExecutionContext
} from 'multiverse/@-xun/cli-utils/extensions';

import { ErrorMessage } from './error';

const rootGenericLogger = createGenericLogger({ namespace: globalLoggerNamespace });
const rootDebugLogger = createDebugLogger({ namespace: globalDebuggerNamespace });

export { $executionContext } from '@black-flag/core';

export type GlobalExecutionContext = StandardExecutionContext & {
  runtimeContext: ReturnType<typeof getRunContext>;
};

export type GlobalCliArguments = StandardCommonCliArguments;

export const configureExecutionContext: ConfigureExecutionContext<GlobalExecutionContext> =
  async function (context) {
    const standardContext = await makeStandardConfigureExecutionContext({
      rootGenericLogger,
      rootDebugLogger
    })(context);

    return {
      ...standardContext,
      // TODO: probably want to merge this into @projector-js/core's project
      // TODO: metadata package
      runtimeContext: getRunContext()
    };
  };

export const configureArguments: ConfigureArguments<GlobalExecutionContext> =
  async function (rawArgv, { runtimeContext }) {
    const debug = rootDebugLogger.extend('configureArguments');
    const cwd = process.cwd();

    const {
      project: { root },
      package: pkg
    } = runtimeContext;

    debug('project root: %O', root);
    debug('pkg root: %O', pkg?.root);
    debug('cwd (must match one of the above): %O', cwd);

    if (root !== cwd && (!pkg || pkg.root !== cwd)) {
      throw new CliError(ErrorMessage.CannotRunOutsideRoot());
    }

    return rawArgv;
  };

export const configureErrorHandlingEpilogue =
  makeStandardConfigureErrorHandlingEpilogue();
