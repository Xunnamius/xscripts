import { RootConfiguration } from '@black-flag/core';
import { CommandNotImplementedError } from '@black-flag/core/util';

import { CustomExecutionContext } from 'universe/configure';

import {
  GlobalCliArguments,
  makeUsageString,
  withGlobalOptions,
  withGlobalOptionsHandling
} from 'universe/util';

export type CustomCliArguments = GlobalCliArguments;

export default async function command({ debug_ }: CustomExecutionContext) {
  const [builder, builderData] = await withGlobalOptions<CustomCliArguments>(
    undefined,
    // ? hasVersion = true
    true
  );

  return {
    name: 'xscripts',
    builder,
    description:
      "A collection of commands for interacting with Xunnamius's NPM-based projects",
    usage: makeUsageString(),
    handler: await withGlobalOptionsHandling<CustomCliArguments>(
      builderData,
      async function (_argv) {
        const debug = debug_.extend('handler');
        debug('entered handler');
        throw new CommandNotImplementedError();
      }
    )
  } satisfies RootConfiguration<CustomCliArguments, CustomExecutionContext>;
}

export { command };
