import { type ChildConfiguration } from '@black-flag/core';

import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';
import { type GlobalExecutionContext } from 'universe/configure';

import { withStandardUsage } from 'multiverse/@-xun/cli-utils/extensions';
import {
  default as buildDistributables,
  type CustomCliArguments
} from './distributables';

export type { CustomCliArguments };

export default function command(
  globalExecutionContext: AsStrictExecutionContext<GlobalExecutionContext>
) {
  return {
    ...buildDistributables(globalExecutionContext),
    aliases: [],
    description: 'Transpile source and assets',
    usage: withStandardUsage(
      `This command is a direct alias for "xscripts build distributables". See that command's help text for more information.`
    )
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
