import { assertIsExpectedTransformerContext, makeTransformer } from 'universe/assets';

import type { EmptyObject } from 'type-fest';

export type Context = EmptyObject;

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: `
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
!docs/build
dist
coverage
.vercel
.next
next-env.d.ts

# Ignore cloned GitHub wiki (do not regard it as a so-called "submodule")
.wiki

# Ignore local configuration
.vscode
!.vscode/launch.example.json

# Ignore relevant NPM artifacts
node_modules

# Ignore random nothingness
.DS_Store
`.trimStart()
    };
  }
});
