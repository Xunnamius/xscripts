import {
  directoryGithubConfigProjectBase,
  toRelativePath
} from 'multiverse+project-utils:fs.ts';

import { compileTemplates, makeTransformer } from 'universe:assets.ts';
import { generateRootOnlyAssets } from 'universe:util.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath } = context;

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return compileTemplates(
      {
        [toProjectAbsolutePath(
          directoryGithubConfigProjectBase,
          'ISSUE_TEMPLATE/BUG_REPORT.md'
        )]: toRelativePath('github/ISSUE_TEMPLATE/BUG_REPORT.md'),
        [toProjectAbsolutePath(
          directoryGithubConfigProjectBase,
          'ISSUE_TEMPLATE/config.yml'
        )]: toRelativePath('github/ISSUE_TEMPLATE/config.yml'),
        [toProjectAbsolutePath(
          directoryGithubConfigProjectBase,
          'ISSUE_TEMPLATE/FEATURE_REQUEST.md'
        )]: toRelativePath('github/ISSUE_TEMPLATE/FEATURE_REQUEST.md'),
        [toProjectAbsolutePath(directoryGithubConfigProjectBase, 'workflows/README.md')]:
          toRelativePath('github/workflows/README.md'),
        [toProjectAbsolutePath(directoryGithubConfigProjectBase, 'CODE_OF_CONDUCT.md')]:
          toRelativePath('github/CODE_OF_CONDUCT.md'),
        [toProjectAbsolutePath(directoryGithubConfigProjectBase, 'CODEOWNERS')]:
          toRelativePath('github/CODEOWNERS'),
        [toProjectAbsolutePath(directoryGithubConfigProjectBase, 'dependabot.yml')]:
          toRelativePath('github/dependabot.yml'),
        [toProjectAbsolutePath(directoryGithubConfigProjectBase, 'FUNDING.yml')]:
          toRelativePath('github/FUNDING.yml'),
        [toProjectAbsolutePath(directoryGithubConfigProjectBase, 'pipeline.config.js')]:
          toRelativePath('github/pipeline.config.js'),
        [toProjectAbsolutePath(
          directoryGithubConfigProjectBase,
          'PULL_REQUEST_TEMPLATE.md'
        )]: toRelativePath('github/PULL_REQUEST_TEMPLATE.md'),
        [toProjectAbsolutePath(directoryGithubConfigProjectBase, 'SUPPORT.md')]:
          toRelativePath('github/SUPPORT.md')
      },
      context
    );
  });
});
