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

import type { EmptyObject } from 'type-fest';

// TODO: turn this into an actual plugin package with tests

export type AccumulatedMetadata = {
  /**
   * Two sets, one containing the accumulated import metadata for all
   * "type-only" imports and the other containing the same information but for
   * all "normal" imports.
   */
  imports: { normal: Set<string>; typeOnly: Set<string> };
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
export type Options = EmptyObject;

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
          accumulator.set(sourceFilePath, {
            imports: { normal: new Set(), typeOnly: new Set() }
          });
        },

        ImportDeclaration(path, state) {
          //const { excludeTypeImports = true } = state.opts;
          const isWholeTypeImport = path.node.importKind !== 'value';
          const hasOnlyTypeSpecifiers =
            path.node.specifiers.length > 0 &&
            path.node.specifiers.every(
              (s) => s.type === 'ImportSpecifier' && s.importKind !== 'value'
            );

          if (isWholeTypeImport || hasOnlyTypeSpecifiers) {
            addImportSpecifierFromPath('type-only', state, path);
          } else {
            addImportSpecifierFromPath('normal', state, path);
          }
        },

        ExportNamedDeclaration(path, state) {
          if (path.node.source) {
            //const { excludeTypeImports = true } = state.opts;
            const isWholeTypeExport = path.node.exportKind !== 'value';
            const hasOnlyTypeSpecifiers =
              path.node.specifiers.length > 0 &&
              path.node.specifiers.every(
                (s) => s.type === 'ExportSpecifier' && s.exportKind !== 'value'
              );

            if (isWholeTypeExport || hasOnlyTypeSpecifiers) {
              addImportSpecifierFromPath('type-only', state, path);
            } else {
              addImportSpecifierFromPath('normal', state, path);
            }
          }
        },

        ExportAllDeclaration(path, state) {
          //const { excludeTypeImports = true } = state.opts;
          const isWholeTypeExport = path.node.exportKind !== 'value';

          if (isWholeTypeExport) {
            addImportSpecifierFromPath('type-only', state, path);
          } else {
            addImportSpecifierFromPath('normal', state, path);
          }
        },

        TSImportType(path, state) {
          //const { excludeTypeImports = true } = state.opts;

          const firstArgument = path.node.argument;
          addImportSpecifier('type-only', state, firstArgument.value);
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
                addImportSpecifier('normal', state, firstArgument.value);
              } else if (util.isIdentifier(firstArgument) && identifierName) {
                const binding = getBinding(path.scope, identifierName);

                if (
                  binding.constant &&
                  util.isVariableDeclarator(binding.path.node) &&
                  util.isStringLiteral(binding.path.node.init)
                ) {
                  addImportSpecifier('normal', state, binding.path.node.init.value);
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

  function addImportSpecifier(
    kind: 'type-only' | 'normal',
    state: PluginPass,
    specifier: string
  ) {
    filenameToMetadata(stateToFilename(state)).imports[
      kind === 'type-only' ? 'typeOnly' : 'normal'
    ].add(specifier);
  }

  function addImportSpecifierFromPath(
    kind: 'type-only' | 'normal',
    state: PluginPass,
    path: NodePath<
      util.ImportDeclaration | util.ExportNamedDeclaration | util.ExportAllDeclaration
    >
  ) {
    const specifier = path.node.source?.value;
    assert(specifier, ErrorMessage.GuruMeditation() + ' (addImportSpecifierFromPath)');
    addImportSpecifier(kind, state, specifier);
  }

  function getBinding(scope: Scope, identifierName: string): Binding {
    return scope.bindings[identifierName] || getBinding(scope.parent, identifierName);
  }
}
