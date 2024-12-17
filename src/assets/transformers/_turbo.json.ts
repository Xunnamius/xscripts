import { turboConfigProjectBase } from 'multiverse+project-utils:fs.ts';

import { makeTransformer } from 'universe:assets.ts';
import { generateRootOnlyAssets } from 'universe:util.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath } = context;

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(turboConfigProjectBase),
        generate: () => JSON.stringify({})
      }
    ];
  });
});
