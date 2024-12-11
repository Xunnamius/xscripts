/* eslint-disable unicorn/filename-case */
import { compileTemplate, makeTransformer } from 'universe:assets.ts';

import type { RelativePath } from 'multiverse+project-utils:fs.ts';

export const { transformer } = makeTransformer(async function (context) {
  const { asset, toProjectAbsolutePath } = context;

  return [
    {
      path: toProjectAbsolutePath(asset),
      generate: () => compileTemplate('ARCHITECTURE.md' as RelativePath, context)
    }
  ];
});
