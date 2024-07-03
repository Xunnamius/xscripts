import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';
import { type GlobalExecutionContext } from 'universe/configure';

import { withStandardUsage } from 'multiverse/@-xun/cli-utils/extensions';
import { default as projectInfo, type CustomCliArguments } from './info';

export type { CustomCliArguments };

export default function command(
  globalExecutionContext: AsStrictExecutionContext<GlobalExecutionContext>
) {
  return {
    ...projectInfo(globalExecutionContext),
    aliases: [],
    description: 'Manage project-wide concerns',
    usage: withStandardUsage(
      `This command is a direct alias for "xscripts project info". See that command's help text for more information.`
    )
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
