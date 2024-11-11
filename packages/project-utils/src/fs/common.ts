import { isAbsolute, join, relative, resolve } from 'node:path';

import { type Tagged } from 'type-fest';

import { createDebugLogger } from 'multiverse+rejoinder';

import { globalDebuggerNamespace } from 'rootverse+project-utils:src/constant.ts';

/**
 * This type represents an absolute filesystem path. An absolute path is a
 * non-zero-length string beginning with the directory separator character
 * (usually `/`). Further, absolute paths always resolve to the same location
 * regardless of working directory.
 *
 * @see {@link RelativePath}
 */
export type AbsolutePath = Tagged<string, 'AbsolutePath'>;

/**
 * This type represents a relative filesystem path, which is any path that is
 * not an absolute path.
 *
 * A relative path may _or may not_ begin with a leading dot path component
 * (i.e. `./` or `../`).
 *
 * @see {@link AbsolutePath}
 */
export type RelativePath = Tagged<string, 'RelativePath'>;

/**
 * This type represents either an {@link AbsolutePath} or {@link RelativePath}.
 */
export type Path = AbsolutePath | RelativePath;

export const debug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:fs`
});

/**
 * This function resolves the right-most argument (AKA `to`) to an
 * {@link AbsolutePath}.
 *
 * If `to` isn't already absolute, the remaining arguments are prepended in
 * right-to-left order until an absolute path is formed. If, after prepending
 * all other arguments, no absolute path is formed, the current working
 * directory is then prepended.
 *
 * The resulting path is normalized and, unless the resulting path refers to the
 * root directory, trailing slashes are removed.
 *
 * @see {@link resolve}
 */
export function toAbsolutePath(
  /**
   * A sequence of paths or path segments.
   */
  ...paths: string[]
) {
  return resolve(...paths) as AbsolutePath;
}

/**
 * This function returns the calculated {@link RelativePath} from `from` to
 * `to`.
 *
 * If `from === to` and/or `from` and `to` point to the same location, the empty
 * string `''` is returned. Otherwise, if `to`/`from` are not
 * {@link AbsolutePath}s, `process.cwd()` will be prepended to them before
 * calculation.
 *
 * @see {@link resolve}
 */
export function toRelativePath(from: string, to: string): RelativePath;
/**
 * This function returns `to` as a {@link RelativePath}.
 *
 * If `to` is already relative and/or is the empty string (`""`), it is returned
 * as-is without any modifications. Otherwise, a {@link RelativePath} from
 * `process.cwd()` to `to` will be returned.
 *
 * @see {@link resolve}
 */
export function toRelativePath(to: string): RelativePath;
export function toRelativePath(...args: string[]) {
  const [from, to] = args.length > 1 ? args : [undefined, args[0]];

  if (from === undefined && (!to || isRelativePath(to))) {
    return to;
  }

  return relative(from || '', to);
}

/**
 * This function joins all arguments together and normalizes the resulting path.
 *
 * **WARNING:** during normalization, dot path components representing the
 * "current" working directory, i.e. `"."`, are **elided** from the resulting
 * path. For instance:
 *
 * `toPath('./my/path/to/a/file') === 'my/path/to/a/file'`\
 * `toPath('my/path/./to/a/.file') === 'my/path/to/a/.file'`
 *
 * @see {@link resolve}
 */
export function toPath(...paths: [AbsolutePath, ...(string | Path)[]]): AbsolutePath;
export function toPath(...paths: [RelativePath, ...(string | Path)[]]): RelativePath;
export function toPath(...paths: (string | Path)[]): Path;
export function toPath(...paths: string[]) {
  return join(...paths);
}

/**
 * This function returns `true` iff `path` is an {@link AbsolutePath}.
 *
 * @see {@link AbsolutePath}
 * @see {@link isAbsolute}
 */
export function isAbsolutePath(path: string): path is AbsolutePath {
  return isAbsolute(path);
}

/**
 * This function returns `true` iff `path` is a {@link RelativePath}.
 *
 * @see {@link RelativePath}
 * @see {@link isAbsolutePath}
 */
export function isRelativePath(path: string): path is RelativePath {
  return !isAbsolutePath(path);
}
