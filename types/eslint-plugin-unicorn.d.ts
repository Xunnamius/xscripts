declare module 'eslint-plugin-unicorn' {
  // {@xscripts/notExtraneous @types/eslint}
  import { type ESLint } from 'eslint';

  const eslintPlugin: ESLint.Plugin;
  export default eslintPlugin;
}
