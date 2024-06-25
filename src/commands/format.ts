import { type ChildConfiguration } from '@black-flag/core';

import { type GlobalCliArguments, type GlobalExecutionContext } from 'universe/configure';

import {
  LogTag,
  logStartTime,
  standardSuccessMessage
} from 'multiverse/@-xun/cli-utils/logging';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse/@-xun/cli-utils/extensions';

import { scriptBasename } from 'multiverse/@-xun/cli-utils/util';
import { findMarkdownFiles } from 'universe/util';

export type CustomCliArguments = GlobalCliArguments & {
  'sort-package-json': boolean;
  'skip-docs': boolean;
  'renumber-references': boolean;
};

export default function command({ log, debug_, state }: GlobalExecutionContext) {
  const [builder, withStandardHandler] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    'sort-package-json': {
      boolean: true,
      description: 'Sort any package.json files',
      default: true
    },
    'skip-docs': {
      boolean: true,
      description: 'Do not format any files with /doc/ in their path',
      default: true
    },
    'renumber-references': {
      boolean: true,
      description: 'Run the renumber-references plugin when formatting Markdown files',
      default: false
    }
  });

  return {
    builder,
    description: 'Run formatters (e.g. prettier, remark) across all relevant files',
    usage: withStandardUsage(),
    handler: withStandardHandler(async function ({
      $0: scriptFullName,
      sortPackageJson,
      skipDocs,
      renumberReferences
    }) {
      const genericLogger = log.extend(scriptBasename(scriptFullName));
      const debug = debug_.extend('handler');
      debug('entered handler');

      const { startTime } = state;

      logStartTime({ log, startTime });

      const mdFiles = await findMarkdownFiles();
      genericLogger([LogTag.IF_NOT_QUIETED], 'mdFiles: %O', mdFiles);

      void sortPackageJson, skipDocs, renumberReferences;

      genericLogger([LogTag.IF_NOT_QUIETED], standardSuccessMessage);
    })
  } satisfies ChildConfiguration<CustomCliArguments, GlobalExecutionContext>;
}
