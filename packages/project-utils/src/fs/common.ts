import { isAbsolute, join, relative, resolve, dirname } from 'node:path';

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
 * Note that the returned path will never start with `./` (this prefix is
 * elided), but may start with
 * `../`.
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
 * Note that the returned path will never start with `./` (this prefix is
 * elided), but may start with `../`.
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
 * This function returns the directory name of `path`, i.e. `path`'s parent
 * directory. `"."` is returned if no non-root parent is derivable.
 *
 * @see {@link dirname}
 */
export function toDirname(path: AbsolutePath): AbsolutePath;
export function toDirname(path: RelativePath): RelativePath;
export function toDirname(path: string | Path): Path;
export function toDirname(path: string) {
  return dirname(path);
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

/**
 * This function returns the **current working directory**. It is functionally
 * identical to calling `process.cwd()`.
 *
 * This function exists because tools like NPM will change the current working
 * directory to wherever `package.json` or `node_modules` is. While sensible,
 * this behavior can be surprising, especially if we're expecting to get the
 * actual working directory from where the script was actually executed.
 *
 * This function and its counterpart {@link getInitialWorkingDirectory} exist to
 * surface this behavior and make it clear when you'll get the "current working
 * directory" or the actual working directory from where the script was
 * executed.
 *
 * @returns the result of calling `process.cwd()` (current working directory)
 * @see https://docs.npmjs.com/cli/v9/commands/npm-run-script#description
 */
export function getCurrentWorkingDirectory() {
  // eslint-disable-next-line no-restricted-syntax
  return toAbsolutePath(process.cwd());
}

/**
 * This function returns the **initial working directory**. This is the value of
 * `process.cwd()` _before any NPM or NPM-like tooling changed the working
 * directory_.
 *
 * This function exists because tools like NPM will change the current working
 * directory to wherever `package.json` or `node_modules` is. While sensible,
 * this behavior can be surprising, especially if we're expecting to get the
 * actual working directory from where the script was actually executed.
 *
 * This function and its counterpart {@link getCurrentWorkingDirectory} exist to
 * surface this behavior and make it clear when you'll get the "current working
 * directory" or the actual working directory from where the script was
 * executed.
 *
 * @returns the actual working directory from where the script was executed
 * @see https://docs.npmjs.com/cli/v9/commands/npm-run-script#description
 */
export function getInitialWorkingDirectory() {
  return toAbsolutePath(process.env.INIT_CWD || getCurrentWorkingDirectory());
}
