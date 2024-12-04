import { toRelativePath } from 'multiverse+project-utils:fs.ts';

import { compileTemplates, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer({
  async transform(context) {
    return compileTemplates(
      {
        '.husky/commit-msg': toRelativePath('husky/commit-msg'),
        '.husky/pre-commit': toRelativePath('husky/pre-commit'),
        '.husky/pre-push': toRelativePath('husky/pre-push')
      },
      context
    );
  }
});
