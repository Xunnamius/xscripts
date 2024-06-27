import { type ChildConfiguration } from '@black-flag/core';
import { type GlobalExecutionContext } from 'universe/configure';

import {
  default as buildDistributables,
  type CustomCliArguments
} from './distributables';

export type { CustomCliArguments };

export default function command(globalExecutionContext: GlobalExecutionContext) {
  return {
    ...buildDistributables(globalExecutionContext),
    aliases: []
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
