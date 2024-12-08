import { isNativeError } from 'node:util/types';

import { makeNamedError } from 'named-app-errors';

import { type WorkspacePackageName } from 'rootverse+project-utils:src/analyze/common.ts';

import {
  uriSchemeDelimiter,
  uriSchemeSubDelimiter
} from 'rootverse+project-utils:src/constant.ts';

import type { WellKnownImportAlias } from 'rootverse+project-utils:src/alias.ts';

// TODO: replace a lot of all that follows with the official package(s),
// TODO: including the symbol use below. Symbols and stuff need to be auto-generated.

export const $type = Symbol.for('object-type-hint');
export const $type_ProjectError = Symbol.for('object-type-hint:ProjectError');
export const $type_NotAGitRepositoryError = Symbol.for(
  'object-type-hint:NotAGitRepositoryError'
);
export const $type_XPackageJsonNotParsableError = Symbol.for(
  'object-type-hint:XPackageJsonNotParsableError'
);
export const $type_DuplicatePackageNameError = Symbol.for(
  'object-type-hint:DuplicatePackageNameError'
);
export const $type_DuplicatePackageIdError = Symbol.for(
  'object-type-hint:DuplicatePackageIdError'
);

/**
 * Options available when constructing a new `ProjectError` object.
 */
export type ProjectErrorOptions = {
  /**
   * By default, if an {@link Error} object is passed to `CliError`, that
   * `Error` instance will be passed through as `CliError.cause` and that
   * instance's `Error.message` will be passed through as `CliError.message`.
   *
   * Use this option to override this default behavior and instead set
   * `CliError.cause` manually.
   */
  cause?: ErrorOptions['cause'];
};

// TODO: Need to ensure isXError functions deal with inheritance/extends

/**
 * Type guard for {@link ProjectError}.
 */
// TODO: make-named-error should create and return this function automatically
export function isProjectError(parameter: unknown): parameter is ProjectError {
  return (
    isNativeError(parameter) &&
    $type in parameter &&
    Array.isArray(parameter[$type]) &&
    parameter[$type].includes($type_ProjectError)
  );
}

/**
 * Type guard for {@link NotAGitRepositoryError}.
 */
export function isNotAGitRepositoryError(
  parameter: unknown
): parameter is NotAGitRepositoryError {
  return (
    isProjectError(parameter) && parameter[$type].includes($type_NotAGitRepositoryError)
  );
}

/**
 * Type guard for {@link XPackageJsonNotParsableError}.
 */
export function isXPackageJsonNotParsableError(
  parameter: unknown
): parameter is XPackageJsonNotParsableError {
  return (
    isProjectError(parameter) &&
    parameter[$type].includes($type_XPackageJsonNotParsableError)
  );
}

/**
 * Type guard for {@link DuplicatePackageNameError}.
 */
export function isDuplicatePackageNameError(
  parameter: unknown
): parameter is DuplicatePackageNameError {
  return (
    isProjectError(parameter) &&
    parameter[$type].includes($type_DuplicatePackageNameError)
  );
}

/**
 * Type guard for {@link DuplicatePackageIdError}.
 */
export function isDuplicatePackageIdError(
  parameter: unknown
): parameter is DuplicatePackageIdError {
  return (
    isProjectError(parameter) && parameter[$type].includes($type_DuplicatePackageIdError)
  );
}

// TODO: this type of error should probably be foundational since we're using it
// TODO: often
/**
 * Represents an exception originating from `@-xun/project-utils`.
 */
export class ProjectError extends Error implements NonNullable<ProjectErrorOptions> {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = [$type_ProjectError];
  /**
   * Represents a CLI-specific error, optionally with suggested exit code and
   * other context.
   */
  constructor(reason?: Error | string, options?: ProjectErrorOptions);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(
    reason: Error | string,
    options: ProjectErrorOptions,
    message: string,
    superOptions: ErrorOptions
  );
  constructor(
    reason: Error | string | undefined,
    options: ProjectErrorOptions = {},
    message: string | undefined = undefined,
    superOptions: ErrorOptions = {}
  ) {
    let { cause } = options;

    message =
      message ??
      (typeof reason === 'string' ? reason : reason?.message) ??
      ErrorMessage.Generic();

    if (!('cause' in options)) {
      cause = typeof reason === 'string' ? undefined : reason;
    }

    super(message, { cause, ...superOptions });
  }
}
makeNamedError(ProjectError, 'ProjectError');

/**
 * Represents encountering a project that is not a git repository.
 */
export class NotAGitRepositoryError extends ProjectError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = [$type_NotAGitRepositoryError, $type_ProjectError];
  /**
   * Represents encountering a project that is not a git repository.
   */
  constructor();
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(message: string);
  constructor(message: string | undefined = undefined) {
    super(message ?? ErrorMessage.NotAGitRepositoryError());
  }
}
makeNamedError(NotAGitRepositoryError, 'NotAGitRepositoryError');

/**
 * Represents encountering an unparsable package.json file in an
 * xscripts-powered project.
 */
export class XPackageJsonNotParsableError extends ProjectError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = [$type_XPackageJsonNotParsableError, $type_ProjectError];
  /**
   * Represents encountering an unparsable package.json file.
   */
  constructor(packageJsonPath: string, reason: unknown);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(packageJsonPath: string, reason: unknown, message: string);
  constructor(
    public readonly packageJsonPath: string,
    public readonly reason: unknown,
    message: string | undefined = undefined
  ) {
    super(message ?? ErrorMessage.PackageJsonNotParsable(packageJsonPath, reason));
  }
}
makeNamedError(XPackageJsonNotParsableError, 'XPackageJsonNotParsableError');

/**
 * Represents encountering a workspace package.json file with the same `"name"`
 * field as another workspace.
 */
export class DuplicatePackageNameError extends ProjectError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = [$type_DuplicatePackageNameError, $type_ProjectError];
  /**
   * Represents encountering a workspace package.json file with the same
   * `"name"` field as another workspace.
   */
  constructor(packageName: string, firstPath: string, secondPath: string);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(
    packageName: string,
    firstPath: string,
    secondPath: string,
    message: string
  );
  constructor(
    public readonly packageName: string,
    public readonly firstPath: string,
    public readonly secondPath: string,
    message: string | undefined = undefined
  ) {
    super(
      message ?? ErrorMessage.DuplicatePackageName(packageName, firstPath, secondPath)
    );
  }
}
makeNamedError(DuplicatePackageNameError, 'DuplicatePackageNameError');

/**
 * Represents encountering an unnamed workspace with the same package-id as
 * another workspace.
 */
export class DuplicatePackageIdError extends ProjectError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = [$type_DuplicatePackageIdError, $type_ProjectError];
  /**
   * Represents encountering an unnamed workspace with the same package-id as
   * another workspace.
   */
  constructor(id: string, firstPath: string, secondPath: string);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(id: string, firstPath: string, secondPath: string, message: string);
  constructor(
    public readonly id: string,
    public readonly firstPath: string,
    public readonly secondPath: string,
    message: string | undefined = undefined
  ) {
    super(message ?? ErrorMessage.DuplicatePackageId(id, firstPath, secondPath));
  }
}
makeNamedError(DuplicatePackageIdError, 'DuplicatePackageIdError');

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  Generic() {
    return 'an error occurred that caused this software to crash';
  },
  GuruMeditation() {
    return 'an impossible scenario occurred';
  },
  PathIsNotAbsolute(path: string) {
    return `"${path}" is not an absolute path`;
  },
  PathIsNotRelative(path: string) {
    return `"${path}" is not a relative path`;
  },
  NotReadable(path: string) {
    return `"${path}" cannot be read and/or does not exist`;
  },
  NotWritable(path: string) {
    return `"${path}" cannot be written to and/or does not exist`;
  },
  NotParsable(path: string, type = 'json') {
    return `${path} cannot be parsed as it does not contain valid ${type}`;
  },
  NotAGitRepositoryError() {
    return 'unable to locate git repository root';
  },
  NotAMonorepoError() {
    return 'the project is not a monorepo (must define "workspaces" field in package.json)';
  },
  PackageJsonNotParsable(packageJsonPath: string, reason: unknown) {
    return `unable to parse ${packageJsonPath}: ${isNativeError(reason) ? reason.message : String(reason)}`;
  },
  DuplicatePackageName(packageName: string, firstPath: string, secondPath: string) {
    return (
      `the following packages must not have the same name "${packageName}":\n` +
      `  ${firstPath}\n` +
      `  ${secondPath}`
    );
  },
  DuplicatePackageId(id: string, firstPath: string, secondPath: string) {
    return (
      `the following unnamed packages must not have the same package-id "${id}":\n` +
      `  ${firstPath}\n` +
      `  ${secondPath}`
    );
  },
  BadProjectTypeInPackageJson(path: string) {
    return `encountered invalid package.json file with a defined "type" field not equal to either "module" or "commonjs": ${path}`;
  },
  MissingNameInPackageJson(path: string) {
    return `encountered invalid package.json file without a "name" field: ${path}`;
  },
  CannotBeCliAndNextJs() {
    return 'project must either provide a CLI or be a Next.js project';
  },
  IllegalAliasKeyInvalidCharacters(key: string, invalids: RegExp | string) {
    return `encountered illegal alias "${key}": alias key cannot include any of the following characters: ${toCharacters(invalids)}`;
  },
  IllegalAliasValueInvalidCharacters(key: string, invalids: RegExp | string) {
    return `encountered illegal alias "${key}": alias value (path) cannot include any of the following characters: ${toCharacters(invalids)}`;
  },
  IllegalAliasValueInvalidSeparatorAdfix(key: string) {
    return `encountered illegal alias "${key}": alias value (path) cannot begin or end with the "/" or "\\" characters, or resemble a relative specifier`;
  },
  IllegalAliasBadSuffix(key: string) {
    return `encountered illegal alias "${key}": when the alias value (path) is configured with \`{ suffix: 'open' }\`, the alias key must also be configured with \`{ suffix: 'open' }\``;
  },
  MissingOptionalBabelDependency(caller: string) {
    return `invoking \`${caller}\` requires the "@babel/core" and "@babel/plugin-syntax-typescript" packages. Run \`npm install --save-dev @babel/core @babel/plugin-syntax-typescript\` and then try again`;
  },
  AssertionFailedWantedPathIsNotSeenPath() {
    return 'assertion failed: wantedPath does not map cleanly to seenPath';
  },
  DeriverAsyncConfigurationConflict() {
    return 'assertion failed: attempted to invoke function with conflicting or illegal configuration options';
  },
  UnsupportedFeature(feature: string) {
    return `this package does not support ${feature}`;
  },
  SpecifierNotOkEmpty(specifier: string, path?: string) {
    return `encountered illegal import specifier "${specifier}": specifier cannot be empty${path ? ` in ${path}` : ''}`;
  },
  SpecifierNotOkRelativeNotRootverse(specifier: string, path?: string) {
    return `encountered illegal import specifier "${specifier}": prefer the rootverse alias over relative or absolute imports${path ? ` in ${path}` : ''}`;
  },
  SpecifierNotOkVerseNotAllowed(
    verse: WellKnownImportAlias,
    specifier: string,
    path?: string
  ) {
    return `encountered illegal import specifier "${specifier}": ${verse} imports are not allowed ${path ? `in ${path}` : 'here'}`;
  },
  SpecifierNotOkMissingExtension(specifier: string, path?: string) {
    return `encountered illegal import specifier "${specifier}": all non-exact aliases must end with an extension${path ? ` in ${path}` : ''}`;
  },
  SpecifierNotOkUnnecessaryIndex(specifier: string, path?: string) {
    return `encountered illegal import specifier "${specifier}": this specifier should be replaced with "${specifier.split(uriSchemeDelimiter)[0]}" or the "index.ts" file renamed to something else${path ? ` in ${path}` : ''}`;
  },
  SpecifierNotOkSelfReferential(specifier: string, path?: string) {
    return `encountered illegal import specifier "${specifier}": this specifier should be replaced with "rootverse${uriSchemeSubDelimiter}${specifier.split(uriSchemeSubDelimiter).at(-1)!.replace(uriSchemeDelimiter, `${uriSchemeDelimiter}src/`)}"${path ? ` in ${path}` : ''}`;
  },
  UnknownWorkspacePackageName(name: WorkspacePackageName) {
    return `this project has no workspace package named "${name}"`;
  },
  PathOutsideRoot(path: string) {
    return `path is outside of the project root: ${path}`;
  }
};

function toCharacters(regExpOrString: RegExp | string) {
  if (typeof regExpOrString === 'string') {
    return regExpOrString;
  }

  const hadBackslash = regExpOrString.source.includes('\\');
  const source = regExpOrString.source.replaceAll('\\', '').split('').join(', ');

  return `${source}${hadBackslash ? (source.length ? ', ' : '') + '\\' : ''}`;
}
