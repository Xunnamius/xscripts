/**
 * The project-wide namespace that appears in debugger output.
 */
export const globalDebuggerNamespace = 'xproject';

/**
 * ```text
 *                          v
 * URI = scheme+sub-scheme ":" ["//" authority] path ["?" query] ["#" fragment]
 *                          ^
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
 */
export const uriSchemeDelimiter = ':';

/**
 * ```text
 *             v
 * URI = scheme+sub-scheme ":" ["//" authority] path ["?" query] ["#" fragment]
 *             ^
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
 */
export const uriSchemeSubDelimiter = '+';
