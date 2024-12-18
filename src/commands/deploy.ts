import { run } from '@-xun/run';
import { type ChildConfiguration } from '@black-flag/core';
import askPassword from 'askpassword';
import uniqueFilename from 'unique-filename';

import { type AsStrictExecutionContext } from 'multiverse+bfe';
import { softAssert } from 'multiverse+cli-utils:error.ts';

import {
  logStartTime,
  LogTag,
  standardSuccessMessage
} from 'multiverse+cli-utils:logging.ts';

import { scriptBasename } from 'multiverse+cli-utils:util.ts';
import { ProjectAttribute } from 'multiverse+project-utils';

import {
  ThisPackageGlobalScope as DeployScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { ErrorMessage } from 'universe:error.ts';

import {
  checkIsNotNil,
  runGlobalPreChecks,
  withGlobalBuilder,
  withGlobalUsage
} from 'universe:util.ts';

export enum DeployTarget {
  Vercel = 'vercel',
  Ssh = 'ssh'
}

/**
 * @see {@link DeployTarget}
 */
export const deployTargets = Object.values(DeployTarget);

/**
 * @see {@link DeployScope}
 */
export const deployScopes = Object.values(DeployScope);

export type CustomCliArguments = GlobalCliArguments<DeployScope> & {
  target: DeployTarget;
} & (
    | {
        target: DeployTarget.Vercel;
        production?: boolean;
        preview: boolean;
        previewUrl?: string;
      }
    | {
        target: DeployTarget.Ssh;
        host: string;
        toPath: string;
      }
  );

export default function command({
  log,
  debug_,
  state,
  projectMetadata: projectMetadata_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>({
    scope: { choices: deployScopes },
    target: {
      string: true,
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
          when: (target) => target !== DeployTarget.Vercel,
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
      check(preview, { target, production }) {
        return (
          target !== DeployTarget.Vercel ||
          preview ||
          production ||
          ErrorMessage.MustChooseDeployEnvironment()
        );
      },
      subOptionOf: {
        target: {
          when: (target) => target !== DeployTarget.Vercel,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              hidden: true
            };
          }
        }
      }
    },
    'preview-url': {
      string: true,
      description: 'The vercel preview deployment custom URL (alias) ',
      requires: { target: DeployTarget.Vercel },
      check: checkIsNotNil,
      subOptionOf: {
        target: {
          when: (target) => target !== DeployTarget.Vercel,
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
      check: checkIsNotNil,
      subOptionOf: {
        target: [
          {
            when: (target) => target === DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                demandThisOption: true
              };
            }
          },
          {
            when: (target) => target !== DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                hidden: true
              };
            }
          }
        ]
      }
    },
    'to-path': {
      string: true,
      description: 'The ssh deploy destination path',
      requires: { target: DeployTarget.Ssh },
      subOptionOf: {
        target: [
          {
            when: (target) => target === DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                demandThisOption: true
              };
            }
          },
          {
            when: (target) => target !== DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                hidden: true
              };
            }
          }
        ]
      }
    }
  });

  return {
    builder,
    description: 'Deploy distributes to the appropriate remote',
    usage: withGlobalUsage(
      `$1.

When using --target=ssh, it is assumed the key pair necessary to authenticate with --host is available in the environment. This command will fail if authenticating to --host requires a password or other user input.`
    ),
    handler: withGlobalHandler(async function (argv) {
      // ? It's down here instead of in the fn signature for typescript reasons
      const { $0: scriptFullName, scope, target } = argv;
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');

      debug('entered handler');

      const { projectMetadata } = await runGlobalPreChecks({ debug_, projectMetadata_ });
      const { startTime } = state;

      logStartTime({ log, startTime });
      genericLogger([LogTag.IF_NOT_QUIETED], 'Deploying project...');

      const { attributes: projectAttributes } = projectMetadata.rootPackage;
      const deployMessage = (deployTarget: string) =>
        `Deploying distributables to ${deployTarget} target...`;

      debug('scope (unused): %O', scope);

      switch (target) {
        case DeployTarget.Vercel: {
          softAssert(
            projectAttributes[ProjectAttribute.Vercel],
            ErrorMessage.WrongProjectAttributes(
              [ProjectAttribute.Vercel],
              projectAttributes
            )
          );

          const { production, preview, previewUrl } = argv;

          if (production) {
            genericLogger([LogTag.IF_NOT_QUIETED], deployMessage('vercel (production)'));
            await run('vercel', ['deploy', '--prod']);
          }

          if (preview) {
            genericLogger([LogTag.IF_NOT_QUIETED], deployMessage('vercel (preview)'));

            const generatedUrl = (await run('vercel', ['deploy'])).stdout;

            if (previewUrl) {
              await run('vercel', ['alias', 'set', generatedUrl, previewUrl]);
            }
          }

          break;
        }

        case DeployTarget.Ssh: {
          genericLogger([LogTag.IF_NOT_QUIETED], deployMessage('ssh'));

          const { host, toPath } = argv;
          const remoteTmpdirPath = uniqueFilename('/tmp', 'x-deploy');

          await run('rsync', [
            '-chavzP',
            '--stats',
            'dist',
            `${host}:${remoteTmpdirPath}`
          ]);

          process.stdout.write(`Enter sudo password for remote ${host}: `);
          const sudoPassword = await askPassword(process.stdin);

          const uploadScript = [
            `echo ${sudoPassword.toString('utf8')} | sudo -S rm -rf ${toPath}`,
            `echo ${sudoPassword.toString('utf8')} | sudo -S mv ${remoteTmpdirPath}/dist ${toPath}`,
            `echo ${sudoPassword.toString('utf8')} | sudo -S chown -R www-data:www-data ${toPath}`
          ];

          await run('ssh', [host, uploadScript.join(' && ')]);

          break;
        }
      }

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
