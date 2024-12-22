import { directoryTestPackageBase, isAccessible } from 'multiverse+project-utils:fs.ts';

import {
  generatePerPackageAssets,
  generateRootOnlyAssets,
  makeTransformer
} from 'universe:assets.ts';

export const { transformer } = makeTransformer(async function (context) {
  const { toProjectAbsolutePath, forceOverwritePotentiallyDestructive: force } = context;

  return [
    ...// * Only the root package gets these files
    (await generateRootOnlyAssets(context, function () {
      return [
        {
          path: toProjectAbsolutePath(directoryTestPackageBase, 'index.ts'),
          generate: () => /*js*/ `
/**
 ** This file exports test utilities specific to this project and beyond what is
 ** exported by @-xun/test; these can be imported using the \`testverse\` alias.
 */

export * from '@-xun/test';`
        },
        {
          path: toProjectAbsolutePath(directoryTestPackageBase, 'setup.ts'),
          generate: () => /*js*/ `
/**
 ** This file is automatically imported by Jest, and is responsible for
 **  bootstrapping the runtime for every test file.
 */

// ? https://github.com/jest-community/jest-extended#typescript
import 'jest-extended';
import 'jest-extended/all';`
        }
      ];
    })),

    ...// * Every package gets these files except non-hybrid monorepo roots
    (await generatePerPackageAssets(context, async function ({ toPackageAbsolutePath }) {
      const outputDir = toPackageAbsolutePath(directoryTestPackageBase);

      // ? Only create this file if its parent directory does not already exist
      if (force || !(await isAccessible(outputDir, { useCached: true }))) {
        return [
          {
            path: toProjectAbsolutePath(outputDir, 'unit-x.test.ts'),
            generate: () => /*js*/ `
// * These tests ensure the exported interface under test functions as expected.

test.todo('this');`
          },

          {
            path: toProjectAbsolutePath(outputDir, 'integration', 'config.ts'),
            generate: () => /*js*/ `
// * Configuration state and metadata shared among all integration tests.

export {};`
          },
          {
            path: toProjectAbsolutePath(
              outputDir,
              'integration',
              'integration-node-smoke.test.ts'
            ),
            generate: () => /*js*/ `
// * These brutally minimal "smoke" tests ensure this software can be invoked
// * and, when it is, exits cleanly.

test.todo('this');`
          },
          {
            path: toProjectAbsolutePath(
              outputDir,
              'integration',
              'integration-client.test.ts'
            ),
            generate: () => /*js*/ `
// * These tests verify that consumers of this software actually receive an API
// * that behaves as described in help text and other documentation. Typically,
// * these integration tests limit module-level mocking to peripheral concerns
// * (e.g. mocking output handling and mocking networking while eschewing
// * filesystem mocking) in favor of testing a "fully integrated" system.

test.todo('this');`
          },

          {
            path: toProjectAbsolutePath(outputDir, 'end-to-end', '.config.ts'),
            generate: () => /*js*/ `
// * Configuration state and metadata shared among all end-to-end tests.

export {};`
          },
          {
            path: toProjectAbsolutePath(
              outputDir,
              'integration',
              'integration-node-smoke.test.ts'
            ),
            generate: () => /*js*/ `
// * These are relatively-simple "smoke" tests to ensure this software is
// * fetchable/installable/executable and exits cleanly when run within the
// * runtimes we support (e.g. the currently maintained node versions).
// *
// * Typically, these tests involve the use of deep mock fixtures and/or Docker
// * containers, and are built to run in GitHub Actions CI pipelines; some can
// * also be run locally.

test.todo('this');`
          },
          {
            path: toProjectAbsolutePath(outputDir, 'end-to-end', 'e2e-x.test.ts'),
            generate: () => /*js*/ `
// * These tests run through the entire process of acquiring this software,
// * using its features, and dealing with its error conditions across a variety
// * of runtimes (e.g. the currently maintained node versions).
// *
// * Typically, these tests involve the use of deep mock fixtures and/or Docker
// * containers, and are built to run in GitHub Actions CI pipelines; some can
// * also be run locally.

test.todo('this');`
          }
        ];
      }
    }))
  ];
});
