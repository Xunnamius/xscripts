import assert from 'node:assert';

import { type ChildConfiguration } from '@black-flag/core';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { ErrorMessage } from 'universe/error';
import { getProjectMetadata } from 'universe/util';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse/@-xun/cli-utils/logging';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse/@-xun/cli-utils/extensions';

export enum DeployTarget {
  Vercel = 'vercel',
  Ssh = 'ssh'
}

export const deployTargets = Object.values(DeployTarget);

export type CustomCliArguments = GlobalCliArguments & { target: DeployTarget } & (
    | {
        target: DeployTarget.Vercel;
        production: boolean;
        preview: boolean;
      }
    | {
        target: DeployTarget.Ssh;
        host: string;
        toPath: string;
      }
  );

export default function command({
  log: genericLogger,
  debug_,
  state
}: GlobalExecutionContext) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    target: {
      description: 'Select deployment target and strategy',
      demandThisOption: true,
      choices: deployTargets,
      subOptionOf: {
        target: {
          when: () => true,
          update(oldOptionConfig, { target }) {
            return {
              ...oldOptionConfig,
              choices: [target]
            };
          }
        }
      }
    },
    production: {
      alias: ['prod'],
      boolean: true,
      description: 'Deploy to the remote production environment',
      requires: { target: DeployTarget.Vercel },
      implies: { preview: false },
      looseImplications: true,
      subOptionOf: {
        target: {
          when: (target: DeployTarget) => target !== DeployTarget.Vercel,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              hidden: true
            };
          }
        }
      }
    },
    preview: {
      boolean: true,
      description: 'Deploy to the remote preview environment',
      requires: { target: DeployTarget.Vercel },
      default: true,
      check: function (preview, { target, production }) {
        return (
          target !== DeployTarget.Vercel ||
          preview ||
          production ||
          'must choose either --preview or --production deployment environment'
        );
      },
      subOptionOf: {
        target: {
          when: (target: DeployTarget) => target !== DeployTarget.Vercel,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              hidden: true
            };
          }
        }
      }
    },
    host: {
      string: true,
      description: 'The ssh deploy host',
      requires: { target: DeployTarget.Ssh },
      demandThisOptionIf: { target: DeployTarget.Ssh },
      subOptionOf: {
        target: {
          when: (target: DeployTarget) => target !== DeployTarget.Ssh,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              hidden: true
            };
          }
        }
      }
    },
    'to-path': {
      string: true,
      description: 'The ssh deploy destination path',
      requires: { target: DeployTarget.Ssh },
      demandThisOptionIf: { target: DeployTarget.Ssh },
      subOptionOf: {
        target: {
          when: (target: DeployTarget) => target !== DeployTarget.Ssh,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              hidden: true
            };
          }
        }
      }
    }
  });

  return {
    builder,
    description: 'Deploy distributes to the appropriate remote',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({ production, preview, target }) {
      const debug = debug_.extend('handler');
      debug('entered handler');

      const { startTime } = state;

      logStartTime({ log: genericLogger, startTime });

      const { attributes } = await getProjectMetadata();
      const deployMessage = (deployTarget: string) =>
        `Deploying distributables to ${deployTarget} target...`;

      switch (target) {
        case DeployTarget.Vercel: {
          assert(
            attributes.includes(DeployTarget.Vercel),
            ErrorMessage.WrongProjectAttributes(attributes, [DeployTarget.Vercel])
          );

          if (production) {
            await deployToVercelProduction();
          }

          if (preview) {
            await deployToVercelPreview();
          }

          break;
        }

        case DeployTarget.Ssh: {
          genericLogger([LogTag.IF_NOT_QUIETED], deployMessage('ssh'));

          break;
        }
      }

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);

      async function deployToVercelProduction() {
        genericLogger([LogTag.IF_NOT_QUIETED], deployMessage('vercel (production)'));
      }

      async function deployToVercelPreview() {
        genericLogger([LogTag.IF_NOT_QUIETED], deployMessage('vercel (preview)'));
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
