import { toRelativePath } from 'multiverse+project-utils:fs.ts';

import { compileTemplates, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(async function (context) {
  const { toProjectAbsolutePath } = context;

  return compileTemplates(
    {
      [toProjectAbsolutePath('.husky/commit-msg')]: toRelativePath('husky/commit-msg'),
      [toProjectAbsolutePath('.husky/pre-commit')]: toRelativePath('husky/pre-commit'),
      [toProjectAbsolutePath('.husky/pre-push')]: toRelativePath('husky/pre-push')
    },
    context
  );
});
