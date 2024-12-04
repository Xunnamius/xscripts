/* eslint-disable unicorn/filename-case */
import { type RelativePath } from 'multiverse+project-utils:fs.ts';

import { compileTemplate, makeTransformer } from 'universe:assets.ts';

export const { transformer } = makeTransformer({
  async transform(context) {
    const { asset } = context;

    return {
      [asset]: await compileTemplate('README.md' as RelativePath, context)
    };
  }
});
