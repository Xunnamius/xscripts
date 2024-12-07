/**
 * The name of the command line interface.
 */
export const globalCliName = 'xscripts';

/**
 * The CLI-wide namespace that appears in logger output.
 */
export const globalLoggerNamespace = globalCliName;

/**
 * The CLI-wide namespace that appears in debugger output.
 */
export const globalDebuggerNamespace = globalCliName;

/**
 * The comment injected before each batch of auto-generated aliases.
 */
export function makeGeneratedAliasesWarningComment(spaces: number) {
  const space = ' '.repeat(spaces);
  return `${space}// ! The aliases described in "paths" are auto-generated by xscripts.
${space}// ! Instead of modifying it directly, consider regenerating aliases
${space}// ! across the entire project with: \`npx xscripts project renovate
${space}// ! --regenerate-aliases\`
${space}// * These aliases appear in:
${space}// *   - tsconfig.json      (JSON)
${space}// *   - babel.config.cjs   (CJS)
${space}// *   - eslint.config.mjs  (ESM)
${space}// *   - jest.config.mjs    (ESM)
${space}// *   - next.config.mjs    (ESM)
${space}// *   - webpack.config.mjs (ESM)
`.trimEnd();
}
