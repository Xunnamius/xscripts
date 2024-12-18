import { directorySrcPackageBase } from 'multiverse+project-utils:fs.ts';

import { generateRootOnlyAssets, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath } = context;

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, function () {
    return [
      {
        path: toProjectAbsolutePath(directorySrcPackageBase, 'index.ts'),
        generate: () => /*js*/ `
/**
 ** This file exports test utilities specific to this project and beyond what is
 ** exported by @-xun/test; these can be imported using \`testverse\` aliases.
 */

export {};
`
      },
      {
        path: toProjectAbsolutePath(directorySrcPackageBase, 'setup.ts'),
        generate: () => /*js*/ `
/**
 ** This file is automatically imported by Jest, and is responsible for
 **  bootstrapping the runtime for every test file.
 */

// ? https://github.com/jest-community/jest-extended#typescript
import 'jest-extended';
import 'jest-extended/all';
`
      }
    ];
  });
});
