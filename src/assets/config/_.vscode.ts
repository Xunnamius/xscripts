import { toRelativePath } from 'multiverse+project-utils:fs.ts';

import { compileTemplates, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer({
  async transform(context) {
    return compileTemplates(
      {
        '.vscode/launch.example.json': toRelativePath('vscode/launch.example.json'),
        '.vscode/settings.json': toRelativePath('vscode/settings.json'),
        '.vscode/tasks.example.json': toRelativePath('vscode/tasks.example.json')
      },
      context
    );
  }
});
