import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';
import { type GlobalExecutionContext } from 'universe/configure';

import { default as projectInfo, type CustomCliArguments } from './info';

export type { CustomCliArguments };

export default function command(
  globalExecutionContext: AsStrictExecutionContext<GlobalExecutionContext>
) {
  return {
    ...projectInfo(globalExecutionContext),
    aliases: []
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
