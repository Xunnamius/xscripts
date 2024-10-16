/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { debugFactory } from 'multiverse#debug';
import { runNoRejectOnBadExit } from 'multiverse#run';

import {
  exports as pkgExports,
  name as pkgName,
  version as pkgVersion
} from '#project-utils package.json';

import {
  dummyDirectoriesFixture,
  dummyFilesFixture,
  dummyNpmPackageFixture,
  mockFixtureFactory,
  nodeImportAndRunTestFixture,
  npmLinkSelfFixture,
  reconfigureJestGlobalsToSkipTestsInThisFileIfRequested,
  type FixtureOptions
} from 'testverse setup';

import type { PackageJson } from 'type-fest';

reconfigureJestGlobalsToSkipTestsInThisFileIfRequested({ it: true });

const TEST_IDENTIFIER = 'integration-node';
const debug = debugFactory(`${pkgName}:${TEST_IDENTIFIER}`);
const nodeVersion = process.env.XPIPE_MATRIX_NODE_VERSION || process.version;

const pkgMainPaths = Object.values(pkgExports as NonNullable<PackageJson['exports']>)
  .map((xport) =>
    !xport || typeof xport === 'string' || Array.isArray(xport)
      ? null
      : `${__dirname}/../${String(xport.node ?? xport.default)}`
  )
  .filter(Boolean) as string[];

// eslint-disable-next-line jest/require-hook
debug('pkgMainPaths: %O', pkgMainPaths);
// eslint-disable-next-line jest/require-hook
debug(`nodeVersion: "${nodeVersion}"`);

const fixtureOptions = {
  performCleanup: true,
  directoryPaths: ['packages/pkg1', 'packages/pkg2', '.git'],
  pkgRoot: `${__dirname}/..`,
  pkgName,
  initialFileContents: {
    'package.json': `{"name":"dummy-pkg","workspaces":["packages/*"],"dependencies":{"${pkgName}":"${pkgVersion}"}}`,
    'packages/pkg1/package.json': `{"name":"pkg-1","version":"1.2.3"}`,
    'packages/pkg2/package.json': `{"name":"pkg-2","version":"1.2.3"}`
  } as FixtureOptions['initialFileContents'],
  use: [
    dummyNpmPackageFixture(),
    dummyDirectoriesFixture(),
    dummyFilesFixture(),
    npmLinkSelfFixture(),
    nodeImportAndRunTestFixture()
  ]
} as Partial<FixtureOptions> & {
  initialFileContents: FixtureOptions['initialFileContents'];
};

const withMockedFixture = mockFixtureFactory(TEST_IDENTIFIER, fixtureOptions);

const runTest = async (
  importAsEsm: boolean,
  testFixtureFn: Parameters<typeof withMockedFixture>[0]
) => {
  const indexPath = `src/index.${importAsEsm ? 'm' : ''}js`;

  fixtureOptions.initialFileContents[indexPath] =
    (importAsEsm
      ? `import { analyzeProjectStructure } from '${pkgName}/project-utils';`
      : `const { analyzeProjectStructure } = require('${pkgName}/project-utils');`) +
    '\n' +
    (importAsEsm
      ? `import { getEslintAliases } from '${pkgName}/import-aliases';`
      : `const { getEslintAliases } = require('${pkgName}/import-aliases');`) +
    `
    console.log(analyzeProjectStructure().project.json.name === 'dummy-pkg');
    console.log(analyzeProjectStructure().project.packages.get('pkg-1').json.name === 'pkg-1');
    console.log(getEslintAliases()[0][0] === 'universe' && getEslintAliases()[0][1] === './src');
`;

  await withMockedFixture(async (context) => {
    if (!context.testResult) throw new Error('must use node-import-test fixture');
    await testFixtureFn(context);
  });

  delete fixtureOptions.initialFileContents[indexPath];
};

beforeAll(async () => {
  await Promise.all(
    pkgMainPaths.map(async (pkgMainPath) => {
      if ((await runNoRejectOnBadExit('test', ['-e', pkgMainPath])).exitCode !== 0) {
        debug(`unable to find main distributable: ${pkgMainPath}`);
        throw new Error('must build distributables first (try `npm run build-dist`)');
      }
    })
  );
});

it('works as an ESM import', async () => {
  expect.hasAssertions();
  await runTest(true, async (context) => {
    expect(context.testResult?.stdout).toBe('true\ntrue\ntrue');
    expect(context.testResult?.code).toBe(0);
  });
});

it('works as a CJS require(...)', async () => {
  expect.hasAssertions();
  await runTest(false, async (context) => {
    expect(context.testResult?.stdout).toBe('true\ntrue\ntrue');
    expect(context.testResult?.code).toBe(0);
  });
});
