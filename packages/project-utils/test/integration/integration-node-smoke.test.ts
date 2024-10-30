/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { debugFactory } from 'multiverse+debug';
import { runNoRejectOnBadExit } from 'multiverse+run';

import {
  exports as packageExports,
  name as packageName,
  version as packageVersion
} from 'rootverse+project-utils:package.json';

import {
  dummyDirectoriesFixture,
  dummyFilesFixture,
  dummyNpmPackageFixture,
  mockFixtureFactory,
  nodeImportAndRunTestFixture,
  npmLinkSelfFixture,
  reconfigureJestGlobalsToSkipTestsInThisFileIfRequested,
  type FixtureOptions
} from 'testverse:setup.ts';

import type { PackageJson } from 'type-fest';

reconfigureJestGlobalsToSkipTestsInThisFileIfRequested({ it: true });

const TEST_IDENTIFIER = 'integration-node';
const debug = debugFactory(`${packageName}:${TEST_IDENTIFIER}`);
const nodeVersion = process.env.XPIPE_MATRIX_NODE_VERSION || process.version;

const packageMainPaths = Object.values(
  packageExports as NonNullable<PackageJson['exports']>
)
  .map((xport) =>
    !xport || typeof xport === 'string' || Array.isArray(xport)
      ? null
      : `${__dirname}/../${String(xport.node ?? xport.default)}`
  )
  .filter(Boolean) as string[];

// eslint-disable-next-line jest/require-hook
debug('packageMainPaths: %O', packageMainPaths);
// eslint-disable-next-line jest/require-hook
debug(`nodeVersion: "${nodeVersion}"`);

const fixtureOptions = {
  performCleanup: true,
  directoryPaths: ['packages/pkg1', 'packages/pkg2', '.git'],
  initialFileContents: {
    'package.json': `{"name":"dummy-pkg","workspaces":["packages/*"],"dependencies":{"${packageName}":"${packageVersion}"}}`,
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
} satisfies Partial<FixtureOptions> & {
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
      ? `import { analyzeProjectStructure } from '${packageName}/project-utils';`
      : `const { analyzeProjectStructure } = require('${packageName}/project-utils');`) +
    '\n' +
    (importAsEsm
      ? `import { getEslintAliases } from '${packageName}/import-aliases';`
      : `const { getEslintAliases } = require('${packageName}/import-aliases');`) +
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
    packageMainPaths.map(async (packageMainPath) => {
      if ((await runNoRejectOnBadExit('test', ['-e', packageMainPath])).exitCode !== 0) {
        debug(`unable to find main distributable: ${packageMainPath}`);
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
