declare module 'eslint-plugin-import' {
  // {@xscripts/notExtraneous @types/eslint}
  import type { Linter } from 'eslint';

  const eslintPlugin: { flatConfigs: Record<string, Linter.Config> };
  export default eslintPlugin;
}
