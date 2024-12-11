import { toRelativePath } from 'multiverse+project-utils:fs.ts';

import { compileTemplates, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(async function (context) {
  const { toProjectAbsolutePath } = context;

  return compileTemplates(
    {
      [toProjectAbsolutePath('.github/ISSUE_TEMPLATE/BUG_REPORT.md')]: toRelativePath(
        'github/ISSUE_TEMPLATE/BUG_REPORT.md'
      ),
      [toProjectAbsolutePath('.github/ISSUE_TEMPLATE/config.yml')]: toRelativePath(
        'github/ISSUE_TEMPLATE/config.yml'
      ),
      [toProjectAbsolutePath('.github/ISSUE_TEMPLATE/FEATURE_REQUEST.md')]:
        toRelativePath('github/ISSUE_TEMPLATE/FEATURE_REQUEST.md'),
      [toProjectAbsolutePath('.github/workflows/README.md')]: toRelativePath(
        'github/workflows/README.md'
      ),
      [toProjectAbsolutePath('.github/CODE_OF_CONDUCT.md')]: toRelativePath(
        'github/CODE_OF_CONDUCT.md'
      ),
      [toProjectAbsolutePath('.github/CODEOWNERS')]: toRelativePath('github/CODEOWNERS'),
      [toProjectAbsolutePath('.github/dependabot.yml')]: toRelativePath(
        'github/dependabot.yml'
      ),
      [toProjectAbsolutePath('.github/FUNDING.yml')]:
        toRelativePath('github/FUNDING.yml'),
      [toProjectAbsolutePath('.github/pipeline.config.js')]: toRelativePath(
        'github/pipeline.config.js'
      ),
      [toProjectAbsolutePath('.github/PULL_REQUEST_TEMPLATE.md')]: toRelativePath(
        'github/PULL_REQUEST_TEMPLATE.md'
      ),
      [toProjectAbsolutePath('.github/SUPPORT.md')]: toRelativePath('github/SUPPORT.md')
    },
    context
  );
});
