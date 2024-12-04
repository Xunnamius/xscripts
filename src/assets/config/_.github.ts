import { toRelativePath } from 'multiverse+project-utils:fs.ts';

import { compileTemplates, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer({
  async transform(context) {
    return compileTemplates(
      {
        '.github/ISSUE_TEMPLATE/BUG_REPORT.md': toRelativePath(
          'github/ISSUE_TEMPLATE/BUG_REPORT.md'
        ),
        '.github/ISSUE_TEMPLATE/config.yml': toRelativePath(
          'github/ISSUE_TEMPLATE/config.yml'
        ),
        '.github/ISSUE_TEMPLATE/FEATURE_REQUEST.md': toRelativePath(
          'github/ISSUE_TEMPLATE/FEATURE_REQUEST.md'
        ),
        '.github/workflows/README.md': toRelativePath('github/workflows/README.md'),
        '.github/CODE_OF_CONDUCT.md': toRelativePath('github/CODE_OF_CONDUCT.md'),
        '.github/CODEOWNERS': toRelativePath('github/CODEOWNERS'),
        '.github/dependabot.yml': toRelativePath('github/dependabot.yml'),
        '.github/FUNDING.yml': toRelativePath('github/FUNDING.yml'),
        '.github/pipeline.config.js': toRelativePath('github/pipeline.config.js'),
        '.github/PULL_REQUEST_TEMPLATE.md': toRelativePath(
          'github/PULL_REQUEST_TEMPLATE.md'
        ),
        '.github/SUPPORT.md': toRelativePath('github/SUPPORT.md')
      },
      context
    );
  }
});
