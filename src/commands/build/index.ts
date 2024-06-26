
import { ChildConfiguration } from '@black-flag/core';
import { type GlobalExecutionContext } from 'universe/configure';
import { default as command, type CustomCliArguments } from './distributables';

export type { CustomCliArguments };

export default function(globalExecutionContext: GlobalExecutionContext) {
  return {
    ...command(globalExecutionContext),
    aliases: []
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
