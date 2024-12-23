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
 * Note that this delimiter is not escaped for use in regular expressions.
 *
 * @see https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
 */
export const uriSchemeDelimiterUnescaped = ':';

/**
 * @see {@link uriSchemeDelimiterUnescaped}
 *
 * This delimiter is escaped for use in regular expressions.
 */
export const uriSchemeDelimiterEscaped = ':';

/**
 * ```text
 *             v
 * URI = scheme+sub-scheme ":" ["//" authority] path ["?" query] ["#" fragment]
 *             ^
 * ```
 *
 * Note that this delimiter is not escaped for use in regular expressions.
 *
 * @see https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
 */
export const uriSchemeSubDelimiterUnescaped = '+';

/**
 * @see {@link uriSchemeSubDelimiterUnescaped}
 *
 * This delimiter is escaped for use in regular expressions.
 */
export const uriSchemeSubDelimiterEscaped = String.raw`\+`;
