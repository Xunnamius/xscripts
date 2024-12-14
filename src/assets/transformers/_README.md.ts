/* eslint-disable unicorn/filename-case */
import { type RelativePath } from 'multiverse+project-utils:fs.ts';

import { compileTemplate, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer(async function (context) {
  const { asset, toProjectAbsolutePath } = context;

  return [
    {
      path: toProjectAbsolutePath(asset),
      generate: () => {
        const contents = compileTemplate('README.md' as RelativePath, context);

        // TODO: replace H1 with proper string or "# <!-- TODO: --> Project Title Here"

        // TODO: implement regional replacements as function (but no hoist yet)

        // TODO: drop unused reference from package build explanation text

        // TODO: drop license section if no license

        // TODO: (should be hoisted?) preserve all numeric reference defs

        return contents;
      }
    }
  ];
});
