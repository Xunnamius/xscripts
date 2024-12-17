import { directoryTypesProjectBase } from 'multiverse+project-utils:fs.ts';

import { makeTransformer } from 'universe:assets.ts';
import { generateRootOnlyAssets } from 'universe:util.ts';

export const { transformer } = makeTransformer(function (context) {
  const { toProjectAbsolutePath } = context;

  // * Only the root package gets these files
  return generateRootOnlyAssets(context, async function () {
    return [
      {
        path: toProjectAbsolutePath(directoryTypesProjectBase, 'global.ts'),
        generate: () => /*js*/ `
export type {};
`
      },
      {
        path: toProjectAbsolutePath(directoryTypesProjectBase, '_example-d.ts'),
        generate: () => /*js*/ `
declare module 'glob-gitignore' {
  import type { GlobOptions } from 'glob';

  export type GlobGitignoreOptions = Omit<GlobOptions, 'ignore'> & {
    /**
     * A string or array of strings used to determine which globbed paths are
     * ignored. Typically this is the result of parsing a .gitignore file (or file
     * with compatible format) split by \`"\n"\`.
     */
    ignore?: string | string[];
  };

  export async function glob(
    patterns: string | string[],
    options: GlobGitignoreOptions
  ): Promise<string[]>;

  export function sync(
    patterns: string | string[],
    options: GlobGitignoreOptions
  ): string[];

  export function hasMagic(patterns: string | string[], options?: GlobOptions): string;
}
`
      }
    ];
  });
});
