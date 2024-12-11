import { toRelativePath } from 'multiverse+project-utils:fs.ts';

import { compileTemplates, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(async function (context) {
  const { toProjectAbsolutePath } = context;

  return compileTemplates(
    {
      [toProjectAbsolutePath('.vscode/launch.example.json')]: toRelativePath(
        'vscode/launch.example.json'
      ),
      [toProjectAbsolutePath('.vscode/settings.json')]:
        toRelativePath('vscode/settings.json'),
      [toProjectAbsolutePath('.vscode/tasks.example.json')]: toRelativePath(
        'vscode/tasks.example.json'
      )
    },
    context
  );
});
