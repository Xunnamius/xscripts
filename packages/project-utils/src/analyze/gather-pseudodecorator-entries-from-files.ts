import { readFileSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';

import isValidNpmPackageName from 'validate-npm-package-name';

import {
  _internalPseudodecoratorCache,
  cacheDebug
} from 'rootverse+project-utils:src/analyze/cache.ts';

import { debug as debug_ } from 'rootverse+project-utils:src/analyze/common.ts';
import { type AbsolutePath } from 'rootverse+project-utils:src/fs.ts';
import {
  type ParametersNoFirst,
  type SyncVersionOf
} from 'rootverse+project-utils:src/util.ts';

import type { Promisable } from 'type-fest';

const debug = debug_.extend('gatherPseudodecoratorsEntriesFromFiles');

const whitespace = /\s/;
// ! Cannot use "g" flag
const hasAlphanumeric = /[a-z0-9]/i;

/**
 * The available {@link Pseudodecorator} tags. These tags must not contain valid
 * RegExp quantifiers or other RegExp control characters.
 */
export enum PseudodecoratorTag {
  /**
   * This pseudodecorator provides a list of package names that should not be
   * considered extraneous (the relevant checks are skipped).
   *
   * **Valid characters**: any character that is valid in an NPM package name.\
   * **Invalid characters**: whitespace and any character that isn't valid in an
   * NPM package name.
   */
  NotExtraneous = '@xscripts/notExtraneous',
  /**
   * This pseudodecorator provides a list of package names that should not be
   * considered invalid (the relevant checks are skipped).
   *
   * **Valid characters**: any character that is valid in an NPM package name.\
   * **Invalid characters**: whitespace and any character that isn't valid in an
   * NPM package name.
   */
  NotInvalid = '@xscripts/notInvalid'
}

/**
 * A so-called "pseudodecorator" is a decorator-like syntax that can appear
 * anywhere in almost any type of file and is used to pass information to
 * Xscripts. They consist of an opening brace "{", a {@link PseudodecoratorTag},
 * an optional delimiter, a _delimited_ list of _valid characters_, an optional
 * delimiter, and a closing brace "}".
 *
 * A "delimiter" is a _series_ of one or more invalid characters that starts and
 * ends with a whitespace character or the final "}" character. This flexible
 * syntax allows pseudodecorators to survive being nested anywhere within almost
 * any document or file type without corruption. Which characters are valid and
 * which are invalid depend on the {@link PseudodecoratorTag} used.
 *
 * For example, using the `@xscripts/notExtraneous` pseudodecorator:
 *
 * **TypeScript:**
 *
 * ```typescript
 * /·*
 *  * {@xscripts/notExtraneous
 *  *   all-contributors-cli remark-cli
 *  *   jest husky
 *  *   doctoc
 *  * }
 *  ·/
 *
 * import { that } from 'there';
 *
 * export function someFunction() {
 *   // ...
 * }
 * ```
 *
 * **JavaScript:**
 *
 * ```javascript
 * // {@xscripts/notExtraneous
 * //  - all-contributors-cli
 * //  - remark-cli
 * //  - jest
 * //  - husky
 * //  - doctoc
 * // }
 *
 * import { that } from 'there';
 *
 * export function someFunction() {
 *   // ...
 * }
 * ```
 *
 * **JSON:**
 *
 * ```json
 * {
 *   "name": "my-package",
 *   "//": "{@xscripts/notExtraneous all-contributors-cli remark-cli jest husky doctoc}"
 * }
 * ```
 *
 * **Markdown:**
 *
 * ```markdown
 * # My Documentation
 * Something or other.
 *
 * <!-- {@xscripts/notExtraneous all-contributors-cli remark-cli jest husky doctoc } -->
 *
 * ## A Subsection
 * More text.
 * ```
 *
 * **And any other type of file** that can contain text. See [the
 * docs](https://github.com/Xunnamius/xscripts/wiki/Generic-Project-Architecture)
 * for more details.
 *
 * @see {@link PseudodecoratorTag}
 */
export type Pseudodecorator = {
  tag: PseudodecoratorTag;
  items: string[];
};

/**
 * An entry mapping an absolute file path to an array of
 * {@link Pseudodecorator}s present in said file.
 *
 * @see {@link gatherPseudodecoratorsEntriesFromFiles}
 */
export type PseudodecoratorsEntry = [
  filepath: AbsolutePath,
  decorators: Pseudodecorator[]
];

/**
 * @see {@link PseudodecoratorTag}
 */
export const pseudodecoratorTags = Object.values(PseudodecoratorTag);

/**
 * @see {@link gatherPseudodecoratorsEntriesFromFiles}
 */
export type gatherPseudodecoratorsEntriesFromFilesOptions = {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * The result of `gatherPseudodecoratorsEntriesFromFiles` will be cached
   * regardless of `useCached`. `useCached` determines if the cached result will
   * be returned or recomputed on subsequent calls.
   *
   * **Note: cached results returned by this function, while functionally
   * identical to each other, will _NOT_ strictly equal each other.**
   *
   * @default true
   */
  useCached?: boolean;
};

function gatherPseudodecoratorsEntriesFromFiles_(
  shouldRunSynchronously: false,
  files: AbsolutePath[],
  options?: gatherPseudodecoratorsEntriesFromFilesOptions
): Promise<PseudodecoratorsEntry[]>;
function gatherPseudodecoratorsEntriesFromFiles_(
  shouldRunSynchronously: true,
  files: AbsolutePath[],
  options?: gatherPseudodecoratorsEntriesFromFilesOptions
): PseudodecoratorsEntry[];
function gatherPseudodecoratorsEntriesFromFiles_(
  shouldRunSynchronously: boolean,
  files: AbsolutePath[],
  { useCached = true }: gatherPseudodecoratorsEntriesFromFilesOptions = {}
): Promisable<PseudodecoratorsEntry[]> {
  debug('evaluating files: %O', files);

  if (shouldRunSynchronously) {
    const pseudodecoratorsEntries = files.map((filepath, index) => {
      const debug_ = debug.extend(`file-${index}`);
      debug_('evaluating file: %O', filepath);

      const cachedResult = getFromCache(filepath, useCached);

      if (cachedResult) {
        return [filepath, cachedResult] satisfies PseudodecoratorsEntry;
      }

      const decorators = contentsToDecorators(readFileSync(filepath, 'utf8'));
      const entry: PseudodecoratorsEntry = [filepath, decorators];

      debug('new pseudodecorator entry: %O', entry);
      setInCache(entry, useCached);

      return entry;
    });

    debug('pseudodecorator entries: %O', pseudodecoratorsEntries);
    return pseudodecoratorsEntries;
  } else {
    return Promise.all(
      files.map(async (filepath, index) => {
        const debug_ = debug.extend(`file-${index}`);
        debug_('evaluating file: %O', filepath);

        const cachedResult = getFromCache(filepath, useCached);

        if (cachedResult) {
          return [filepath, cachedResult] satisfies PseudodecoratorsEntry;
        }

        const decorators = contentsToDecorators(await readFileAsync(filepath, 'utf8'));
        const entry: PseudodecoratorsEntry = [filepath, decorators];

        debug('new pseudodecorator entry: %O', entry);
        setInCache(entry, useCached);

        return entry;
      })
    ).then((pseudodecoratorsEntries) => {
      debug('pseudodecorator entries: %O', pseudodecoratorsEntries);
      return pseudodecoratorsEntries;
    });
  }
}

/**
 * Accepts zero or more file paths and asynchronously returns an array of
 * {@link PseudodecoratorsEntry}s each mapping a given file path to an array of
 * {@link Pseudodecorator}s present in said file.
 *
 * This function does _not_ rely on Babel or any other parsers and accepts any
 * file regardless of type or extension.
 *
 * @see {@link Pseudodecorator}
 */
export function gatherPseudodecoratorsEntriesFromFiles(
  ...args: ParametersNoFirst<typeof gatherPseudodecoratorsEntriesFromFiles_>
) {
  return gatherPseudodecoratorsEntriesFromFiles_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace gatherPseudodecoratorsEntriesFromFiles {
  /**
   * Accepts zero or more file paths and synchronously returns an array of
   * {@link PseudodecoratorsEntry}s each mapping a given file path to an array
   * of {@link Pseudodecorator}s present in said file.
   *
   * This function does _not_ rely on Babel or any other parsers and accepts any
   * file regardless of type or extension.
   *
   * @see {@link Pseudodecorator}
   */
  export const sync = function (...args) {
    return gatherPseudodecoratorsEntriesFromFiles_(true, ...args);
  } as SyncVersionOf<typeof gatherPseudodecoratorsEntriesFromFiles>;
}

function contentsToDecorators(contents: string): Pseudodecorator[] {
  return Array.from(
    contents
      .matchAll(new RegExp(`{(${pseudodecoratorTags.join('|')})([^}]*)}`, 'gi'))
      .map(function ([, rawTag, rawItems]) {
        return {
          tag: rawTag as PseudodecoratorTag,
          items: rawItems.split(whitespace).filter((m) => {
            const isValid =
              hasAlphanumeric.test(m) && isValidNpmPackageName(m).validForNewPackages;

            return isValid;
          })
        } satisfies Pseudodecorator;
      })
  );
}

function getFromCache(filepath: AbsolutePath, useCached: boolean) {
  if (useCached && _internalPseudodecoratorCache.has(filepath)) {
    cacheDebug('cache hit for %O', filepath);
    const cachedResult = _internalPseudodecoratorCache.get(filepath)!;
    debug('reusing cached sub-resource: %O', cachedResult);
    return cachedResult;
  } else {
    cacheDebug('cache miss for %O', filepath);
  }
}

function setInCache([key, pseudodecorators]: PseudodecoratorsEntry, useCached: boolean) {
  if (useCached || !_internalPseudodecoratorCache.has(key)) {
    _internalPseudodecoratorCache.set(key, pseudodecorators);
    cacheDebug('cache entry %O updated', key);
  } else {
    cacheDebug('skipped updating cache entry %O', key);
  }
}
