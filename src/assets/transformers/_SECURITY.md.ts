/* eslint-disable unicorn/filename-case */
import {
  markdownSecurityProjectBase,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import {
  compileTemplate,
  generateRootOnlyAssets,
  makeTransformer
} from 'universe:assets.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath } = context;

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(markdownSecurityProjectBase),
        generate: () => compileTemplate('SECURITY.md' as RelativePath, context)
      }
    ];
  });
});
