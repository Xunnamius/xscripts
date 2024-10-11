import {
  assertIsExpectedTransformerContext,
  makeTransformer
} from 'universe assets/index.ts';

import type { EmptyObject } from 'type-fest';

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: `
* text=auto eol=lf
`.trimStart()
    };
  }
});
