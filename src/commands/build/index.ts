import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse#bfe';

import {
  default as buildDistributables,
  type CustomCliArguments
} from 'universe commands/build/distributables.ts';

import { type GlobalExecutionContext } from 'universe configure.ts';
import { withGlobalUsage } from 'universe util.ts';

export type { CustomCliArguments };

export default async function command(
  globalExecutionContext: AsStrictExecutionContext<GlobalExecutionContext>
) {
  return {
    ...(await buildDistributables(globalExecutionContext)),
    aliases: [],
    description: 'Transpile source and assets',
    usage: withGlobalUsage(
      `This command is a direct alias for "xscripts build distributables". See that command's help text for more information.`
    )
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
