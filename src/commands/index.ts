import { type RootConfiguration } from '@black-flag/core';
import { CommandNotImplementedError } from '@black-flag/core/util';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse/@-xun/cli-utils/extensions';

import { type AsStrictExecutionContext } from 'multiverse/@black-flag/extensions';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';
import { globalCliName } from 'universe/constant';

export type CustomCliArguments = GlobalCliArguments;

export default function command({
  debug_
}: AsStrictExecutionContext<GlobalExecutionContext>) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >(undefined, { additionalCommonOptions: ['version'] });

  return {
    name: globalCliName,
    builder,
    description:
      "A collection of commands for interacting with Xunnamius's NPM-based projects",
    usage: withStandardUsage(),
    handler: withStandardHandler(function () {
      const debug = debug_.extend('handler');
      debug('entered handler');
      throw new CommandNotImplementedError();
    })
  } satisfies RootConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
