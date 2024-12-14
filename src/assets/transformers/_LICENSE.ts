/* eslint-disable unicorn/filename-case */
import { type RelativePath } from 'multiverse+project-utils:fs.ts';

import { compileTemplate, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(async function (context) {
  const { asset, toProjectAbsolutePath } = context;

  return [
    {
      path: toProjectAbsolutePath(asset),
      generate: () => compileTemplate('LICENSE' as RelativePath, { ...context })
    }
  ];
});
