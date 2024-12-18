import { tstycheConfigProjectBase } from 'multiverse+project-utils:fs.ts';

import { generateRootOnlyAssets, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath } = context;

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(tstycheConfigProjectBase),
        generate: () =>
          JSON.stringify(
            {
              $schema: 'https://tstyche.org/schemas/config.json',
              testFileMatch: ['**/type-*.test.ts', '**/type-*.test.tsx']
            },
            undefined,
            2
          )
      }
    ];
  });
});
