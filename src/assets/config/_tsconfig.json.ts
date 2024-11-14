import { assertIsExpectedTransformerContext, makeTransformer } from 'universe:assets.ts';

import type { EmptyObject } from 'type-fest';

export type Context = EmptyObject;

// TODO: also covers all the other tsc.*.json configuration files

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: `

`.trimStart()
    };
  }
});
