/* eslint-disable unicorn/prevent-abbreviations */
import assert from 'node:assert';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';

import { runNoRejectOnBadExit } from '@-xun/run';
import { CliError, FrameworkExitCode } from '@black-flag/core';

import {
  config as _loadDotEnv,
  type DotenvConfigOptions,
  type DotenvParseOutput,
  type DotenvPopulateInput
} from 'dotenv';

import {
  withStandardBuilder,
  withStandardUsage
} from 'multiverse+cli-utils:extensions.ts';

import { LogTag } from 'multiverse+cli-utils:logging.ts';

import {
  gatherPackageBuildTargets,
  gatherPackageFiles,
  // ? Used in documentation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  WorkspaceAttribute
} from 'multiverse+project-utils';

import {
  isRootPackage,
  ProjectAttribute,
  type GenericProjectMetadata,
  type ProjectMetadata
} from 'multiverse+project-utils:analyze/common.ts';

import {
  aliasMapConfigPackageBase,
  directoryDocumentationPackageBase,
  directorySrcPackageBase,
  directoryTestPackageBase,
  dotEnvConfigPackageBase,
  dotEnvConfigProjectBase,
  dotEnvDefaultConfigPackageBase,
  dotEnvDefaultConfigProjectBase,
  getInitialWorkingDirectory,
  markdownReadmePackageBase,
  toAbsolutePath,
  toPath,
  toRelativePath,
  type AbsolutePath,
  type RelativePath
} from 'multiverse+project-utils:fs.ts';

import {
  createDebugLogger,
  type ExtendedDebugger,
  type ExtendedLogger
} from 'multiverse+rejoinder';

import {
  DefaultGlobalScope,
  globalCliArguments,
  type GlobalCliArguments,
  type GlobalExecutionContext
} from 'universe:configure.ts';

import { globalDebuggerNamespace } from 'universe:constant.ts';
import { ErrorMessage } from 'universe:error.ts';

import type { LiteralUnion, Merge } from 'type-fest';
import type { RawAliasMapping } from 'multiverse+project-utils:alias.ts';
import type { TransformerContext } from 'universe:assets.ts';

/**
 * An array of project-root-relative glob magics matching paths that belong
 * exclusively to the root package, if it exists. **Paths must not begin with
 * _or contain_ a path separator character**.
 *
 * When determining which pathspecs to include for a subroot package, all root
 * paths (excluding packages/) will be included except for these, which are be
 * explicitly ignored; entries from the project root `package.json::files` will
 * be included automatically.
 */
const globPathsExclusiveToRootPackage = [
  directorySrcPackageBase,
  directoryTestPackageBase,
  directoryDocumentationPackageBase,
  // ? All the TsConfig.* configuration files that are package-specific
  'tsc.package.*',
  '*-lock.json',
  'CHANGELOG.md'
  // * package.json, README.md, LICENSE, etc are added from package.json::files
] as unknown as readonly RelativePath[];

const cachedDotEnvResults = new Map<string, Partial<DotenvPopulateInput> | undefined>();

const refDefMatcherRegExp = /^\[([a-z0-9-_]+)\]:([^[\]]+)(?=\[|$)/gim;
const beginsWithAlphaRegExp = /^[a-z]/i;

/**
 * A function that receives the current {@link ProjectMetadata} and must return
 * an array of {@link RawAliasMapping}s.
 *
 * `aliases.config.mjs` can export via default either `RawAliasMapperFunction`
 * or an array of {@link RawAliasMapping}s.
 */
export type RawAliasMapperFunction = (
  projectMetadata: ProjectMetadata,
  outputFunctions: { log: ExtendedLogger; debug: ExtendedDebugger }
) => RawAliasMapping[];

/**
 * Represents the result of importing an `aliases.config.mjs` file.
 * `aliases.config.mjs` can export via default either
 * {@link RawAliasMapperFunction} or an array of {@link RawAliasMapping}s.
 */
export type ImportedAliasMap = RawAliasMapping[] | RawAliasMapperFunction;

/**
 * Magic string used to denote the beginning of a replacer region in Markdown
 * files processed by xscripts.
 *
 * This is the photogenic version of
 * {@link magicStringReplacerRegionStartWithId}, which is the actual variable
 * used in computations.
 *
 * Note that this string is actually a regular expression that can be used to
 * match region start comments containing an ID parameter.
 */
export const magicStringReplacerRegionStart = String.raw`<!-- xscripts-template-region-start (\S+) -->`;

/**
 * Magic string used to denote the beginning of a replacer region in Markdown
 * files processed by xscripts.
 */
export const magicStringReplacerRegionEnd = '<!-- xscripts-template-region-end -->';

/**
 * A regular expression that will match a replacer region in a string. Contains
 * two unnamed matching groups: `id` and `contents`.
 */
export const replacerRegionMatcherRegExp = new RegExp(
  `^${magicStringReplacerRegionStart}$(.*?)^${magicStringReplacerRegionEnd}$`,
  'gism'
);

/**
 * A version of {@link withStandardBuilder} that expects `CustomCliArguments` to
 * extend {@link GlobalCliArguments}.
 *
 * When providing a `customBuilder` function or object, any key in the returned
 * object that is also a key in {@link globalCliArguments} will have its value
 * merged with the value in {@link globalCliArguments} _instead_ of fully
 * overwriting it. This means you can pass minimal configuration values for the
 * keys that are also in {@link globalCliArguments} and those values will be
 * merged over the corresponding default configuration value in
 * {@link globalCliArguments}.
 */
export function withGlobalBuilder<CustomCliArguments extends GlobalCliArguments<string>>(
  ...[customBuilder, settings]: Parameters<
    typeof withStandardBuilder<CustomCliArguments, GlobalExecutionContext>
  >
): ReturnType<typeof withStandardBuilder<CustomCliArguments, GlobalExecutionContext>> {
  const debug_ = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:withStandardBuilder`
  });

  return withStandardBuilder<CustomCliArguments, GlobalExecutionContext>(
    function builder(blackFlag, helpOrVersionSet, argv) {
      debug_('entered withGlobalBuilder::builder wrapper function');
      debug_('calling customBuilder (if a function) and returning builder object');

      const customCliArguments =
        (typeof customBuilder === 'function'
          ? customBuilder(blackFlag, helpOrVersionSet, argv)
          : customBuilder) || {};

      for (const key of Object.keys(customCliArguments)) {
        if (key in globalCliArguments) {
          customCliArguments[key] = Object.assign(
            {},
            globalCliArguments[key as keyof typeof globalCliArguments],
            customCliArguments[key]
          );
        }
      }

      debug_('exited withGlobalBuilder::builder wrapper function');

      return {
        ...globalCliArguments,
        ...customCliArguments
      };
    },
    {
      ...settings,
      additionalCommonOptions: [
        ...Object.keys(globalCliArguments),
        ...(settings?.additionalCommonOptions || [])
      ]
    }
  );
}

export { withStandardUsage as withGlobalUsage };

/**
 * This function runs common checks against the runtime to ensure the
 * environment is suitable for running xscripts.
 *
 * This function should be called at the top of just about every command
 * handler.
 *
 * This command also asserts that the `projectMetadata` property is defined by
 * returning it (or throwing a {@link CliError} if undefined).
 */
export async function runGlobalPreChecks({
  debug_,
  projectMetadata_,
  scope
}: {
  debug_: GlobalExecutionContext['debug_'];
  projectMetadata_: GlobalExecutionContext['projectMetadata'];
  scope: LiteralUnion<DefaultGlobalScope, string>;
}): Promise<{
  projectMetadata: NonNullable<GlobalExecutionContext['projectMetadata']>;
}> {
  const debug = debug_.extend('globalPreChecks');

  assert(projectMetadata_, ErrorMessage.CannotRunOutsideRoot());

  const {
    rootPackage: { root: projectRoot, attributes: projectAttributes },
    cwdPackage
  } = projectMetadata_;

  const cwd = toAbsolutePath(getInitialWorkingDirectory());
  const { root: packageRoot } = cwdPackage;

  debug('project root: %O', projectRoot);
  debug('cwdPackage root: %O', packageRoot);
  debug('cwd: %O', cwd);

  debug.message(
    'the following invariant must hold: cwd === project root or cwd === cwdPackage root'
  );

  assert([projectRoot, packageRoot].includes(cwd), ErrorMessage.CannotRunOutsideRoot());

  const scopeIsThisPackage = scope === DefaultGlobalScope.ThisPackage;
  const cwdPackageIsRootPackage = isRootPackage(cwdPackage);
  const projectIsMonorepo = projectAttributes[ProjectAttribute.Monorepo];
  const projectIsHybridrepo = projectAttributes[ProjectAttribute.Hybridrepo];

  debug('scopeIsThisPackage: %O', scopeIsThisPackage);
  debug('cwdPackageIsRootPackage: %O', cwdPackageIsRootPackage);
  debug('projectIsMonorepo: %O', projectIsMonorepo);
  debug('projectIsHybridrepo: %O', projectIsHybridrepo);

  debug.message(
    'at least one of the following invariants must hold: scopeIsThisPackage=false, cwdPackageIsRootPackage=false, projectIsMonorepo=false, or projectIsHybridrepo=true'
  );

  assert(
    !scopeIsThisPackage ||
      !cwdPackageIsRootPackage ||
      !projectIsMonorepo ||
      projectIsHybridrepo,
    ErrorMessage.CannotRunInNonHybridMonorepoRootPackage()
  );

  return { projectMetadata: projectMetadata_ };
}

/**
 * If `gitStatusOutput` is not empty or `gitStatusExitCode` is non-zero, then
 * the current working tree is dirty. This can be checked quickly via the
 * `isDirty` property.
 */
export async function determineRepoWorkingTreeDirty() {
  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:working-tree-state`
  });

  const { all: gitStatusOutput, exitCode: gitStatusExitCode } =
    await runNoRejectOnBadExit('git', ['status', '--porcelain'], { all: true });

  const isDirty = !!gitStatusOutput || gitStatusExitCode !== 0;

  if (isDirty) {
    debug.warn(
      'repository is in an unclean state! Git status output (exit code %O):',
      gitStatusExitCode
    );
  }

  debug.message('gitStatusOutput (empty is good): %O', gitStatusOutput);

  return {
    gitStatusOutput,
    gitStatusExitCode,
    isDirty
  };
}

/**
 * Returns all dotenv file paths relevant to the current package in reverse
 * order of precedence; the most important dotenv file will be last in the
 * returned array.
 *
 * Use `scope` (default: `"both"`) to narrow which dotenv paths are returned.
 */
export function getRelevantDotEnvFilePaths(
  projectMetadata: GenericProjectMetadata | undefined,
  scope: 'both' | 'package-only' | 'project-only' = 'both'
) {
  const { cwdPackage, rootPackage } = projectMetadata || {};

  const cwdPackageEnvFile =
    cwdPackage?.root && rootPackage?.root !== cwdPackage.root
      ? `${cwdPackage.root}/${dotEnvConfigPackageBase}`
      : undefined;

  const cwdPackageEnvDefaultFile =
    cwdPackage?.root && rootPackage?.root !== cwdPackage.root
      ? `${cwdPackage.root}/${dotEnvDefaultConfigPackageBase}`
      : undefined;

  const rootPackageEnvFile = rootPackage?.root
    ? `${rootPackage.root}/${dotEnvConfigProjectBase}`
    : undefined;

  const rootPackageEnvDefaultFile = rootPackage?.root
    ? `${rootPackage.root}/${dotEnvDefaultConfigProjectBase}`
    : undefined;

  // ! Most important env file should be last, least important should be first
  const paths = [
    scope !== 'package-only' ? rootPackageEnvDefaultFile : undefined,
    scope !== 'project-only' ? cwdPackageEnvDefaultFile : undefined,
    scope !== 'package-only' ? rootPackageEnvFile : undefined,
    scope !== 'project-only' ? cwdPackageEnvFile : undefined
  ].filter((p): p is string => !!p) as AbsolutePath[];

  createDebugLogger({
    namespace: `${globalDebuggerNamespace}:discover-env`
  })('dotenv paths (in ascending order of precedence): %O', paths);

  return paths;
}

/**
 * Performs regional replacement on a Markdown file's contents, including
 * overwriting existing non-numeric reference definitions that match those
 * generated by the template (and leaving the others).
 */
export async function replaceRegionsRespectively({
  templateContent,
  outputPath,
  context: { debug, log, forceOverwritePotentiallyDestructive }
}: {
  /**
   * The compiled template contents (typically the result of calling
   * `compileTemplate`).
   */
  templateContent: string;
  /**
   * The path to a potentially-existing file, potentially with replaceable
   * regions.
   */
  outputPath: AbsolutePath;
  context: TransformerContext;
}) {
  let outgoingContent = templateContent;
  const existingContent = await readFile(outputPath).catch((error: unknown) => {
    debug.message('unable to read in an existing .env file: %O', error);
    return '';
  });

  if (forceOverwritePotentiallyDestructive) {
    debug('skipped performing regional replacements (--force was used)');
  } else if (!existingContent) {
    debug('skipped performing regional replacements (no pre-existing content)');
  } else {
    debug('potentially performing regional replacements...');

    const existingReplacerRegions = Array.from(
      existingContent.matchAll(replacerRegionMatcherRegExp)
    );

    const templateReplacerRegionsMap = new Map(
      templateContent
        .matchAll(replacerRegionMatcherRegExp)
        .map(([region, regionId]) => [regionId, region])
    );

    const existingRefDefIds = new Set(existingReplacerRegions.map(([, id]) => id));
    const templateRefDefIds = new Set(templateReplacerRegionsMap.keys());

    debug('existingRefDefIds: %O', existingRefDefIds);
    debug('templateRefDefIds: %O', templateRefDefIds);

    if (!existingRefDefIds.symmetricDifference(templateRefDefIds).size) {
      debug('performing <=%O regional replacements', existingReplacerRegions.length);

      outgoingContent = existingContent;

      for (const [region, regionId] of existingReplacerRegions) {
        debug('replacing region %O', regionId);

        outgoingContent = outgoingContent.replace(
          region,
          templateReplacerRegionsMap.get(regionId)!
        );
      }

      // * Also treat the reference definitions at the bottom of the document as
      // * an ad-hoc "region" and perform specialized replacement (append-only)

      const overridingRefDefs = templateContent
        .matchAll(refDefMatcherRegExp)
        .map((r) => toRefDefMapping(r))
        .toArray();

      const currentRefDefsMap = new Map(
        existingContent
          .matchAll(refDefMatcherRegExp)
          .map((r) => toRefDefMapping(r))
          // ? We only care about our "named" refs and not numeric refs
          .filter(([ref]) => beginsWithAlphaRegExp.test(ref))
      );

      debug('currentRefDefsMap: %O', currentRefDefsMap);
      debug('overridingRefDefs: %O', overridingRefDefs);

      debug.message(
        'replacing region %O (%O additions/updates possible)',
        'ref defs (special)',
        overridingRefDefs.length
      );

      let finalCurrentRefDef = Array.from(currentRefDefsMap.values()).at(-1);
      debug('finalTemplateRefDef (initial): %O', finalCurrentRefDef);

      let changesCount = 0;

      for (const [overridingRef, overridingRefDef] of overridingRefDefs) {
        if (!beginsWithAlphaRegExp.test(overridingRef)) {
          // ? Technically, this should never happen, but alert us if it does
          log.message(
            [LogTag.IF_NOT_HUSHED],
            'Skipped overriding non-conforming ref %O',
            overridingRef
          );
          continue;
        }

        if (currentRefDefsMap.has(overridingRef)) {
          debug(
            'overwriting existing ref %O with new definition %O',
            overridingRef,
            overridingRefDef
          );

          const existingRefDef = currentRefDefsMap.get(overridingRef)!;
          outgoingContent = outgoingContent.replace(existingRefDef, overridingRefDef);

          if (existingRefDef === finalCurrentRefDef) {
            finalCurrentRefDef = overridingRefDef;
          }
        } else {
          debug(
            'adding new ref (after finalTemplateRefDef) %O with definition %O',
            overridingRef,
            overridingRefDef
          );

          outgoingContent = finalCurrentRefDef
            ? outgoingContent.replace(
                finalCurrentRefDef,
                finalCurrentRefDef + '\n' + overridingRefDef
              )
            : outgoingContent + '\n' + overridingRefDef;

          finalCurrentRefDef = overridingRefDef;
          debug('finalTemplateRefDef (updated): %O', finalCurrentRefDef);
        }

        changesCount += 1;
      }

      debug(
        'replaced region %O (%O additions/updates made)',
        'ref defs (special)',
        changesCount
      );
    } else if (existingReplacerRegions.length) {
      log.warn(
        [LogTag.IF_NOT_HUSHED],
        'target %O was overwritten without regional replacements!',
        outputPath
      );
    } else {
      debug(
        'no explicitly replaceable regions were found in existing and/or template content'
      );
    }
  }

  return outgoingContent;
}

/**
 * Return pathspecs for including only certain paths for consideration depending
 * on the project structure and the current working directory.
 *
 * This function takes into account {@link WorkspaceAttribute.Shared} packages
 * and is useful for narrowing the scope of tooling like xchangelog and
 * xrelease.
 */
export function deriveScopeNarrowingPathspecs({
  projectMetadata: { cwdPackage, rootPackage, type }
}: {
  projectMetadata: ProjectMetadata;
}): string[] {
  assert(
    !rootPackage.attributes[ProjectAttribute.Monorepo] ||
      rootPackage.attributes[ProjectAttribute.Hybridrepo] ||
      !isRootPackage(cwdPackage),
    ErrorMessage.GuruMeditation()
  );

  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:derive-pathspecs`
  });

  if (type === ProjectAttribute.Polyrepo) {
    return [];
  }

  const { root: projectRoot } = rootPackage;
  const isCwdPackageTheRootPackage = isRootPackage(cwdPackage);
  const pathspecsWithoutSigMagic: RelativePath[] = [];

  if (isCwdPackageTheRootPackage) {
    // * Include: Everything in the package and all normal and type-only imports
    // * Exclude: No explicit excludes

    pathspecsWithoutSigMagic.push(...globPathsExclusiveToRootPackage);

    const { other: relevantProjectRootPaths } = gatherPackageFiles.sync(rootPackage, {
      useCached: true
    });

    pathspecsWithoutSigMagic.push(
      ...deepPathsToAncestorDirnames(relevantProjectRootPaths)
    );
  } else {
    // * Include: Everything in the package, all normal and type-only imports,
    // *          and all relevant project root paths
    // * Exclude: Irrelevant project root paths that belong exclusively to the
    // *          root package (i.e. irrelevant paths)

    pathspecsWithoutSigMagic.push(cwdPackage.relativeRoot);

    const { other: relevantProjectRootPaths } = gatherPackageFiles.sync(rootPackage, {
      useCached: true,
      ignore: globPathsExclusiveToRootPackage
        .concat(
          // ? Always exclude the README.md file
          toRelativePath(markdownReadmePackageBase),
          (rootPackage.json.files || []).map((file) => {
            return (file.startsWith('/') ? file.slice(1) : file) as RelativePath;
          })
        )
        // ? We're going by gitignore rules, so preceding / means project root
        // ? unlike when dealing with signature/pathspec magic
        .map((path) => '/' + path)
    });

    pathspecsWithoutSigMagic.push(
      ...deepPathsToAncestorDirnames(relevantProjectRootPaths)
    );
  }

  debug(
    'pathspecsWithoutSigMagic (before externals added): %O',
    pathspecsWithoutSigMagic
  );

  const {
    targets: { external }
  } = gatherPackageBuildTargets.sync(cwdPackage, { useCached: true });

  const externals = external.normal.union(external.typeOnly);
  pathspecsWithoutSigMagic.push(...externals.values());

  const pathspecsWithSigMagic = pathspecsWithoutSigMagic.map(
    (path) => ':(top,glob)' + path
  );

  debug('pathspecsWithSigMagic: %O', pathspecsWithSigMagic);
  return pathspecsWithSigMagic;

  function deepPathsToAncestorDirnames(paths: AbsolutePath[]) {
    // eslint-disable-next-line unicorn/no-array-reduce
    return paths.reduce<Set<RelativePath>>((pathspecs, path) => {
      // ? Optimize path count by only including the parent dir, if applicable
      pathspecs.add(toRelativePath(projectRoot, path).split('/')[0] as RelativePath);
      return pathspecs;
    }, new Set());
  }
}

// TODO: transmute this and related functions into @-xun/env

export type LoadDotEnvSettings = {
  log: ExtendedLogger;
  /**
   * Variables from files earlier in this list will be overwritten by
   * variables from files later in the list.
   */
  dotEnvFilePaths: AbsolutePath[];
  /**
   * If `true`, do not throw on errors.
   */
  force: boolean;
  /**
   * Further instructions for the user upon environment validation failure.
   */
  failInstructions: string;
  /**
   * Action to take upon environment validation failure.
   */
  onFail: () => void;
  /**
   * If `true`, loaded environment variables will be added to `process.env`
   * with respect to `override`, and this function will return `void`. If
   * `false`, the environment variables will be returned instead and
   * `override` is ignored.
   *
   * @default true
   */
  updateProcessEnv?: boolean;
} & Pick<DotenvConfigOptions, 'override'>;

/**
 * @see {@link loadDotEnv}
 */
export type LoadDotEnvSimplifiedSettings = Merge<
  LoadDotEnvSettings,
  {
    log?: undefined;
    onFail?: undefined;
    failInstructions?: undefined;
    force?: undefined;
  }
>;

/**
 * Loads environment variables from the given `dotEnvFilePaths` files, with
 * variables from files earlier in the list being overwritten by variables from
 * files later in the list.
 *
 * `process.env` will be updated, and then an object containing only the loaded
 * environment variables is returned.
 *
 * **Note that this function internally caches the result of loading the dotenv
 * files, meaning they'll only be read once.**
 */
export function loadDotEnv(
  settings: LoadDotEnvSimplifiedSettings & { updateProcessEnv?: true }
): DotenvParseOutput;
/**
 * Loads environment variables from the given `dotEnvFilePaths` files, with
 * variables from files earlier in the list being overwritten by variables from
 * files later in the list.
 *
 * An object containing only the loaded environment variables is returned.
 * **`process.env` will NOT be updated!**
 *
 * **Note that this function internally caches the result of loading the dotenv
 * files, meaning they'll only be read once.**
 */
export function loadDotEnv(
  settings: LoadDotEnvSimplifiedSettings & { updateProcessEnv: false }
): DotenvParseOutput;
/**
 * Loads environment variables from the given `dotEnvFilePaths` files, with
 * variables from files earlier in the list being overwritten by variables from
 * files later in the list.
 *
 * `process.env` will be updated, and the resulting environment object (after
 * `overrides` and `updateProcessEnv` are considered) will be checked for the
 * existence of the variables in `expectedEnvironmentVariables`. If the check is
 * successful, an object containing only the loaded environment variables is
 * returned. Otherwise, an error is thrown.
 *
 * **Note that this function internally caches the result of loading the dotenv
 * files, meaning they'll only be read once.**
 */
export function loadDotEnv(
  expectedEnvironmentVariables: string[],
  settings: LoadDotEnvSettings & { updateProcessEnv?: true }
): DotenvParseOutput;
/**
 * Loads environment variables from the given `dotEnvFilePaths` files, with
 * variables from files earlier in the list being overwritten by variables from
 * files later in the list.
 *
 * The resulting environment object (after `overrides` and `updateProcessEnv`
 * are considered) will be checked for the existence of the variables in
 * `expectedEnvironmentVariables`, but **`process.env` will NOT be updated!**.
 * If the check is successful, an object containing only the loaded environment
 * variables is returned. Otherwise, an error is thrown.
 *
 * **Note that this function internally caches the result of loading the dotenv
 * files, meaning they'll only be read once.**
 */
export function loadDotEnv(
  expectedEnvironmentVariables: string[],
  settings: LoadDotEnvSettings & { updateProcessEnv: false }
): DotenvParseOutput;
export function loadDotEnv(
  ...args: [LoadDotEnvSimplifiedSettings] | [string[], LoadDotEnvSettings]
) {
  const expectedEnvironmentVariables = Array.isArray(args[0]) ? args[0] : [];

  const {
    log,
    dotEnvFilePaths,
    force = false,
    failInstructions = '',
    onFail = () => undefined,
    override = false,
    updateProcessEnv = true
  } = (Array.isArray(args[0]) ? args[1] : args[0])!;

  const failLogger = log?.extend('env-valid');
  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:load-env`
  });

  debug('expectedEnvironmentVariables: %O', expectedEnvironmentVariables);
  debug('dotEnvFilePaths: %O', dotEnvFilePaths);
  debug('force: %O', force);
  debug('failInstructions: %O', failInstructions);
  debug('override: %O', override);
  debug('updateProcessEnv: %O', updateProcessEnv);

  const problems: string[] = [];
  const environmentContainer: Partial<Record<string, string>> = {};

  dotEnvFilePaths.forEach((path) => {
    const cachedResult = cachedDotEnvResults.get(path);

    if (cachedResult) {
      Object.assign(environmentContainer, cachedResult);
      debug('loaded dotenv file %O successfully (from cache)', path);
    } else {
      const result = _loadDotEnv({
        debug: !!process.env.DEBUG,
        path,
        override: true,
        processEnv: environmentContainer as DotenvPopulateInput
      });

      if (result.error) {
        debug.warn('attempt to load dotenv file %O failed: %O', path, result.error);
      } else {
        debug('loaded dotenv file %O successfully', path);
      }

      cachedDotEnvResults.set(path, result.parsed);
    }
  });

  if (environmentContainer.GITHUB_TOKEN && !('GH_TOKEN' in environmentContainer)) {
    environmentContainer.GH_TOKEN = environmentContainer.GITHUB_TOKEN;
  }

  const transientEnvironmentContainer = Object.assign(
    updateProcessEnv ? process.env : {},
    environmentContainer,
    override ? {} : process.env
  );

  expectedEnvironmentVariables.forEach((variable) => {
    const isVariableDefined = (transientEnvironmentContainer[variable]?.length || 0) > 0;
    if (!isVariableDefined) {
      problems.push(`variable "${variable}" is empty or missing in environment`);
    }
  });

  problems.forEach((problem, index) => {
    failLogger?.[force ? 'warn' : 'error'](
      [LogTag.IF_NOT_QUIETED],
      'Problem %O: ' + problem,
      index + 1
    );
  });

  if (!force && problems.length) {
    failLogger?.message(
      [LogTag.IF_NOT_SILENCED],
      `Validation failed: %O problem${problems.length === 1 ? '' : 's'} detected.${failInstructions ? ` ${failInstructions}` : ''}`,
      problems.length
    );

    onFail();
  }

  return environmentContainer;
}

/**
 * Used by renovate and init project-level commands to load additional raw
 * aliases from `aliases.config.mjs`.
 */
export async function importAdditionalRawAliasMappings(
  projectMetadata: ProjectMetadata,
  outputFunctions: { log: ExtendedLogger; debug: ExtendedDebugger }
) {
  const { debug } = outputFunctions;
  const {
    rootPackage: { root: projectRoot }
  } = projectMetadata;

  const aliasMapPath = toPath(projectRoot, aliasMapConfigPackageBase);

  debug(`aliasMapPath: %O`, aliasMapPath);

  const aliasMapImport = await import(aliasMapPath).catch((error: unknown) => {
    debug.warn('failed to import %O: %O', aliasMapPath, error);
    return undefined;
  });

  debug(`aliasMapImport: %O`, aliasMapImport);

  if (aliasMapImport) {
    const aliasMap: ImportedAliasMap | undefined = aliasMapImport?.default;

    if (aliasMap) {
      debug('aliasMap: %O', aliasMap);

      if (typeof aliasMap === 'function') {
        debug('invoking aliases import as a function from %O', aliasMapPath);
        return aliasMap(projectMetadata, outputFunctions);
      } else if (Array.isArray(aliasMap)) {
        debug('returning aliases import as an array from %O', aliasMapPath);
        return aliasMap;
      } else {
        assert.fail(ErrorMessage.BadMjsImport(aliasMapPath));
      }
    } else {
      throw new Error(ErrorMessage.DefaultImportFalsy());
    }
  } else {
    debug(
      'skipped importing additional alias mappings: no importable alias configuration file found at project root'
    );
  }

  return [];
}

// TODO: probably prudent to make these part of cli-utils

export async function readFile(path: string) {
  try {
    return await fs.readFile(path, { encoding: 'utf8' });
  } catch (error) {
    throw new CliError(ErrorMessage.CannotReadFile(path), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export async function writeFile(path: string, contents: string) {
  try {
    await fs.writeFile(path, contents, { mode: 0o664 });
  } catch (error) {
    throw new CliError(ErrorMessage.CannotWriteFile(path), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export async function copyFile(from: string, to: string) {
  try {
    await fs.copyFile(from, to);
  } catch (error) {
    throw new CliError(ErrorMessage.CannotCopyFile(from, to), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export async function makeDirectory(path: string) {
  try {
    await fs.mkdir(path, {
      mode: 0o775,
      recursive: true
    });
  } catch (error) {
    throw new CliError(ErrorMessage.CannotMakeDirectory(path), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export function __read_file_sync(path: string) {
  try {
    return fsSync.readFileSync(path, { encoding: 'utf8' });
  } catch (error) {
    throw new CliError(ErrorMessage.CannotReadFile(path), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export function __write_file_sync(path: string, contents: string) {
  try {
    fsSync.writeFileSync(path, contents);
  } catch (error) {
    throw new CliError(ErrorMessage.CannotWriteFile(path), {
      cause: error,
      suggestedExitCode: FrameworkExitCode.AssertionFailed
    });
  }
}

export function hasExitCode(error: unknown): error is object & { exitCode: number } {
  return !!(
    error &&
    typeof error === 'object' &&
    'exitCode' in error &&
    typeof error.exitCode === 'number'
  );
}

// TODO: also consider a package of @-xun/black-flag-common-option-checks that
// TODO: includes the generic checks implemented below:

export function checkIsNotNegative(argName: string) {
  return function (currentArg: unknown) {
    return (
      (typeof currentArg === 'number' && currentArg >= 0) ||
      ErrorMessage.ArgumentMustBeNonNegative(argName)
    );
  };
}

export function checkIsNotNil(argName: string) {
  return function (currentArg: unknown) {
    return !!currentArg || ErrorMessage.ArgumentMustNotBeFalsy(argName);
  };
}

export function checkArrayNotEmpty(argName: string, adjective = 'non-empty') {
  return function (currentArg: unknown[]) {
    return (
      (currentArg.length > 0 && currentArg.every((file) => isNonEmptyString(file))) ||
      ErrorMessage.RequiresMinArgs(argName, 1, undefined, adjective)
    );
  };
}

export function isNonEmptyString(o: unknown): o is string {
  return typeof o === 'string' && o.length > 0;
}

// TODO: migrate some part of this into xpipeline and hoist the other part up ^^

/**
 * The value populating the XSCRIPTS_SPECIAL_INITIAL_COMMIT environment variable
 * when there was no special initialization commit reference found.
 */
export const noSpecialInitialCommitIndicator = 'N/A';

/**
 * Return the commit-ish (SHA hash) of the most recent commit containing the
 * Xpipeline command suffix `[INIT]`, or being pointed to by a
 * `package-name@0.0.0-init` version tag. If no such commit could be found,
 * {@link noSpecialInitialCommitIndicator} is returned.
 *
 * @see {@link XchangelogConfig}
 */
export async function getLatestCommitWithXpipelineInitCommandSuffixOrTagSuffix(
  tagPrefix: string
) {
  const debug = createDebugLogger({
    namespace: `${globalDebuggerNamespace}:find-init-commit`
  });

  const [{ stdout: xpipelineReference }, { stdout: initTagReference }] =
    await Promise.all([
      runNoRejectOnBadExit('git', [
        'log',
        '-1',
        '--pretty=format:%H',
        '--grep',
        String.raw`\[INIT]$`
      ]),
      runNoRejectOnBadExit('git', [
        'log',
        '-1',
        '--pretty=format:%H',
        `${tagPrefix}0.0.0-init`
      ])
    ]);

  debug('xpipelineReference: %O', xpipelineReference);
  debug('initTagReference: %O', initTagReference);

  let reference: string;

  if (xpipelineReference && initTagReference) {
    // ? Use the most recent of the two options
    const { exitCode: isXpipelineReferenceMoreRecent } = await runNoRejectOnBadExit(
      'git',
      [
        'merge-base',
        initTagReference,
        '--is-ancestor',
        xpipelineReference // ? Is xpipelineRef the ancestor of initTagRef?
      ]
    );

    debug('isXpipelineReferenceMoreRecent: %O', isXpipelineReferenceMoreRecent);

    reference = isXpipelineReferenceMoreRecent ? xpipelineReference : initTagReference;
  } else {
    reference =
      xpipelineReference || initTagReference || noSpecialInitialCommitIndicator;
  }

  debug(
    'latest commit with either Xpipeline init command or version tag init suffix: %O',
    reference
  );

  return reference;
}

// TODO: ^^^

function toRefDefMapping([refDef, ref]: RegExpMatchArray) {
  return [ref, refDef.trim()] as const;
}
