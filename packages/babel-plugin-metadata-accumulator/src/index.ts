/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import assert from 'node:assert';

import {
  types as util,
  type NodePath,
  type PluginObj,
  type PluginPass
} from '@babel/core';

import { type Binding, type Scope } from '@babel/traverse';

import {
  toAbsolutePath,
  type AbsolutePath
} from 'multiverse+project-utils:fs/common.ts';

import { ErrorMessage } from 'rootverse+babel-plugin-metadata-accumulator:src/error.ts';

// TODO: turn this into an actual plugin package with tests

export type AccumulatedMetadata = {
  /**
   * A set containing accumulated import metadata.
   */
  imports: Set<string>;
};

/**
 * @see {@link createMetadataAccumulatorPlugin}
 */
export type PluginAndAccumulator = {
  /**
   * The actual metadata accumulator plugin itself. This should be passed into
   * Babel when calling `babel.transform` etc.
   */
  plugin: PluginObj<State>;
  /**
   * A {@link Map} mapping absolute file paths to their accumulated metadata.
   */
  accumulator: Map<AbsolutePath, AccumulatedMetadata>;
};

/**
 * The options that can be passed to this plugin from babel.
 */
export type Options = {
  /**
   * If `true`, "type-only" and "typeof" imports will be ignored by the
   * accumulator, including imports that aren't marked type-only but all their
   * specifiers _are_ marked type-only.
   *
   * @default true
   */
  excludeTypeImports?: boolean;
};

/**
 * @internal
 */
export type State = PluginPass & { opts: Options };

/**
 * Create and return a metadata accumulator plugin and corresponding object
 * containing all accumulated metadata.
 *
 * If analyzing source with no originating file path, the accumulator will map
 * retain its metadata under the `"/dev/null"` key.
 */
export function createMetadataAccumulatorPlugin(): PluginAndAccumulator {
  const pluginAndAccumulator: PluginAndAccumulator = {
    accumulator: new Map(),
    plugin: {
      visitor: {
        Program(_path, state) {
          const sourceFilePath = stateToFilename(state);
          accumulator.set(sourceFilePath, { imports: new Set() });
        },

        ImportDeclaration(path, state) {
          const { excludeTypeImports = true } = state.opts;
          const isWholeTypeImport = path.node.importKind !== 'value';
          const hasOnlyTypeSpecifiers =
            path.node.specifiers.length > 0 &&
            path.node.specifiers.every(
              (s) => s.type === 'ImportSpecifier' && s.importKind !== 'value'
            );

          if (!excludeTypeImports || (!isWholeTypeImport && !hasOnlyTypeSpecifiers)) {
            addImportSpecifierFromPath(state, path);
          }
        },

        ExportNamedDeclaration(path, state) {
          if (path.node.source) {
            const { excludeTypeImports = true } = state.opts;
            const isWholeTypeExport = path.node.exportKind !== 'value';
            const hasOnlyTypeSpecifiers =
              path.node.specifiers.length > 0 &&
              path.node.specifiers.every(
                (s) => s.type === 'ExportSpecifier' && s.exportKind !== 'value'
              );

            if (!excludeTypeImports || (!isWholeTypeExport && !hasOnlyTypeSpecifiers)) {
              addImportSpecifierFromPath(state, path);
            }
          }
        },

        ExportAllDeclaration(path, state) {
          const { excludeTypeImports = true } = state.opts;
          const isWholeTypeExport = path.node.exportKind !== 'value';

          if (!excludeTypeImports || !isWholeTypeExport) {
            addImportSpecifierFromPath(state, path);
          }
        },

        TSImportType(path, state) {
          const { excludeTypeImports = true } = state.opts;

          if (!excludeTypeImports) {
            const firstArgument = path.node.argument;
            addImportSpecifier(state, firstArgument.value);
          }
        },

        CallExpression(path, state) {
          const isDynamicImport = path.node.callee.type === 'Import';
          const isRequire =
            path.node.callee?.type === 'Identifier' &&
            path.node.callee?.name === 'require';

          if (isDynamicImport || isRequire) {
            const firstArgument = path.node.arguments?.[0] as
              | (typeof path.node.arguments)[0]
              | undefined;

            if (firstArgument) {
              const { identifierName } = firstArgument.loc || {};

              if (util.isStringLiteral(firstArgument)) {
                addImportSpecifier(state, firstArgument.value);
              } else if (util.isIdentifier(firstArgument) && identifierName) {
                const binding = getBinding(path.scope, identifierName);

                if (
                  binding.constant &&
                  util.isVariableDeclarator(binding.path.node) &&
                  util.isStringLiteral(binding.path.node.init)
                ) {
                  addImportSpecifier(state, binding.path.node.init.value);
                }
              }
            } else {
              throw new TypeError(
                ErrorMessage.EncounteredEmptyImportCallExpression(isRequire)
              );
            }
          }
        }
      }
    }
  };

  const { accumulator } = pluginAndAccumulator;

  return pluginAndAccumulator;

  function stateToFilename(state: PluginPass) {
    return toAbsolutePath(state.filename || '/dev/null');
  }

  function filenameToMetadata(sourceFilePath: AbsolutePath) {
    const metadata = accumulator.get(sourceFilePath);
    assert(metadata, ErrorMessage.GuruMeditation() + ' (filenameToMetadata)');
    return metadata;
  }

  function addImportSpecifier(state: PluginPass, specifier: string) {
    filenameToMetadata(stateToFilename(state)).imports.add(specifier);
  }

  function addImportSpecifierFromPath(
    state: PluginPass,
    path: NodePath<
      util.ImportDeclaration | util.ExportNamedDeclaration | util.ExportAllDeclaration
    >
  ) {
    const specifier = path.node.source?.value;
    assert(specifier, ErrorMessage.GuruMeditation() + ' (addImportSpecifierFromPath)');
    addImportSpecifier(state, specifier);
  }

  function getBinding(scope: Scope, identifierName: string): Binding {
    return scope.bindings[identifierName] || getBinding(scope.parent, identifierName);
  }
}
