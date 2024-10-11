import { type Tagged } from 'type-fest';

/**
 * Represents an absolute filesystem path, which is any path that is not an
 * absolute path.
 */
export type AbsolutePath = Tagged<string, 'AbsolutePath'>;

/**
 * Represents a relative filesystem path.
 */
export type RelativePath = Tagged<string, 'RelativePath'>;
