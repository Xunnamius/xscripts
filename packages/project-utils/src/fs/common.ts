import { type Tagged } from 'type-fest';

import { createDebugLogger } from 'multiverse+rejoinder';

import { globalDebuggerNamespace } from 'rootverse+project-utils:src/constant.ts';

/**
 * Represents an absolute filesystem path, which is any path that is not an
 * absolute path.
 */
export type AbsolutePath = Tagged<string, 'AbsolutePath'>;

/**
 * Represents a relative filesystem path.
 */
export type RelativePath = Tagged<string, 'RelativePath'>;

export const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:fs`
});
