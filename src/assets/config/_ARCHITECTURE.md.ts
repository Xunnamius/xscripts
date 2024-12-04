/* eslint-disable unicorn/filename-case */
import { compileTemplate, makeTransformer } from 'universe:assets.ts';

import type { RelativePath } from 'multiverse+project-utils:fs.ts';

export const { transformer } = makeTransformer({
  async transform(context) {
    const { asset } = context;

    return {
      [asset]: await compileTemplate('ARCHITECTURE.md' as RelativePath, context)
    };
  }
});
