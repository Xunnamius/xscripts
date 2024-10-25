/* eslint-disable unicorn/filename-case */
import { assertIsExpectedTransformerContext, makeTransformer } from 'universe assets.ts';

import type { EmptyObject } from 'type-fest';

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: `

`.trimStart()
    };
  }
});
