import { type RootConfiguration } from '@black-flag/core';
import { CommandNotImplementedError } from '@black-flag/core/util';

import { type AsStrictExecutionContext } from 'multiverse#bfe';

import {
  UnlimitedGlobalScope as RootScope,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe configure.ts';

import { globalCliName } from 'universe constant.ts';

import { withGlobalBuilder, withGlobalUsage } from 'universe util.ts';

/**
 * @see {@link RootScope}
 */
export const rootScopes = Object.values(RootScope);

export type CustomCliArguments = GlobalCliArguments<RootScope>;

export default function command({
  debug_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>(
    { scope: { choices: rootScopes, default: RootScope.Unlimited } },
    { additionalCommonOptions: ['version'] }
  );

  return {
    name: globalCliName,
    builder,
    description:
      "A collection of commands for interacting with Xunnamius's NPM-based projects",
    usage: withGlobalUsage(),
    handler: withGlobalHandler(function () {
      const debug = debug_.extend('handler');
      debug('entered handler');
      throw new CommandNotImplementedError();
    })
  } satisfies RootConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
