import { assertIsExpectedTransformerContext, makeTransformer } from 'universe:assets.ts';

import type { EmptyObject } from 'type-fest';

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: `
# Paths below are ignored by prettier as well as remark and doctoc when called
# with \`xscripts format\`

# Ignore temporary files by giving them a special name
*.ignore
*.ignore.*
ignore.*

# Ignore sensitive files
.env
.npmrc
*.local

# Ignore transpiled source (used for advanced debugging)
.transpiled

# Ignore any external scripts
external-scripts/bin

# Ignore relevant build artifacts (except under src)
*.tsbuildinfo
build/**
!src/build
docs
dist
coverage
.vercel
.next
next-env.d.ts
CHANGELOG.md

# Ignore relevant NPM artifacts
node_modules
package-lock.json

# Ignore test fixtures (which may depend on remaining as they are)
fixtures
`.trimStart()
    };
  }
});
