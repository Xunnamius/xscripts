import {
  directoryVscodeProjectBase,
  toRelativePath
} from 'multiverse+project-utils:fs.ts';

import { compileTemplates, makeTransformer } from 'universe:assets.ts';
import { generateRootOnlyAssets } from 'universe:util.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath } = context;

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, function () {
    return compileTemplates(
      {
        [toProjectAbsolutePath(directoryVscodeProjectBase, 'launch.example.json')]:
          toRelativePath('vscode/launch.example.json'),
        [toProjectAbsolutePath(directoryVscodeProjectBase, 'settings.json')]:
          toRelativePath('vscode/settings.json'),
        [toProjectAbsolutePath(directoryVscodeProjectBase, 'tasks.example.json')]:
          toRelativePath('vscode/tasks.example.json')
      },
      context
    );
  });
});
