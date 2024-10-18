import { accessSync, readFileSync } from 'node:fs';
import { access as accessAsync, readFile as readFileAsync } from 'node:fs/promises';

import { toss } from 'toss-expression';

import { runNoRejectOnBadExit } from 'multiverse#run';

import { ErrorMessage } from '#project-utils src/error.ts';

import {
  deriveVirtualGitignoreLines,
  deriveVirtualPrettierignoreLines,
  ensurePathIsAbsolute,
  isAccessible,
  readJson,
  readJsonc,
  readPackageJsonAtRoot,
  type AbsolutePath
} from '#project-utils src/fs/index.ts';

import { fixtures } from '#project-utils test/helpers/dummy-repo.ts';

import { asMockedFunction } from 'testverse setup.ts';

jest.mock('node:fs');
jest.mock('node:fs/promises');
jest.mock('multiverse#run');

const mockedReadFileSync = asMockedFunction(readFileSync);
const mockedReadFileAsync = asMockedFunction(readFileAsync);
const mockedAccessSync = asMockedFunction(accessSync);
const mockedAccessAsync = asMockedFunction(accessAsync);
const mockedRun = asMockedFunction(runNoRejectOnBadExit);

describe('::ensurePathIsAbsolute', () => {
  describe('<synchronous>', () => {
    it('throws iff path is not absolute', async () => {
      expect.hasAssertions();

      expect(() => ensurePathIsAbsolute.sync({ path: './not/absolute' })).toThrow(
        ErrorMessage.PathIsNotAbsolute('./not/absolute')
      );

      expect(ensurePathIsAbsolute.sync({ path: '/absolute' })).toBe('/absolute');
    });
  });

  describe('<asynchronous>', () => {
    it('returns a rejected promise iff path is not absolute', async () => {
      expect.hasAssertions();

      await expect(ensurePathIsAbsolute({ path: './not/absolute' })).rejects.toThrow(
        ErrorMessage.PathIsNotAbsolute('./not/absolute')
      );

      await expect(ensurePathIsAbsolute({ path: '/absolute' })).resolves.toBe(
        '/absolute'
      );
    });
  });
});

describe('::isAccessible', () => {
  describe('<synchronous>', () => {
    it('returns true for path with default accessibility (R_OK)', async () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementationOnce(() => undefined);

      expect(isAccessible.sync({ path: '/pretend/it/does/exist' })).toBeTrue();
    });

    it('returns false for path without default accessibility (R_OK)', async () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementationOnce(() => toss(new Error('nope')));

      expect(isAccessible.sync({ path: '/pretend/it/does/exist' })).toBeFalse();
    });

    it('returns false for non-existent path', async () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementationOnce(() => toss(new Error('no')));

      expect(isAccessible.sync({ path: '/does/not/exist' })).toBeFalse();
    });
  });

  describe('<asynchronous>', () => {
    it('returns true for path with default accessibility (R_OK)', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementationOnce(() => Promise.resolve());

      await expect(isAccessible({ path: '/pretend/it/does/exist' })).resolves.toBeTrue();
    });

    it('returns false for path without default accessibility (R_OK)', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementationOnce(() => Promise.reject(new Error('nope')));

      await expect(isAccessible({ path: '/pretend/it/does/exist' })).resolves.toBeFalse();
    });

    it('returns false for non-existent path', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementationOnce(() => Promise.reject(new Error('no')));

      await expect(isAccessible({ path: '/does/not/exist' })).resolves.toBeFalse();
    });
  });
});

describe('::readJson', () => {
  describe('<synchronous>', () => {
    it('accepts a package.json path and returns its parsed contents', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      expect(
        readJson.sync({ path: '/fake/path/package.json' as AbsolutePath })
      ).toStrictEqual(expectedJson);
    });

    it('throws if path is not absolute', async () => {
      expect.hasAssertions();

      expect(() =>
        readJson.sync({ path: 'does/not/exist/package.json' as AbsolutePath })
      ).toThrow(ErrorMessage.PathIsNotAbsolute('does/not/exist/package.json'));
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(() =>
        readJson.sync({ path: '/does/not/exist/package.json' as AbsolutePath })
      ).toThrow(ErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileSync.mockImplementation(() => '{{');

      expect(() => readJson.sync({ path })).toThrow(ErrorMessage.NotParsable(path));
    });
  });

  describe('<asynchronous>', () => {
    it('accepts a package.json path and returns its parsed contents', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      await expect(
        readJson({ path: '/fake/path/package.json' as AbsolutePath })
      ).resolves.toStrictEqual(expectedJson);
    });

    it('throws if path is not absolute', async () => {
      expect.hasAssertions();

      await expect(
        readJson({ path: 'does/not/exist/package.json' as AbsolutePath })
      ).rejects.toThrow(ErrorMessage.PathIsNotAbsolute('does/not/exist/package.json'));
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject());

      await expect(
        readJson({ path: '/does/not/exist/package.json' as AbsolutePath })
      ).rejects.toThrow(ErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(readJson({ path })).rejects.toThrow(ErrorMessage.NotParsable(path));
    });
  });
});

describe('::readJsonc', () => {
  describe('<synchronous>', () => {
    it('accepts a package.json path and returns its parsed contents', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      expect(
        readJsonc.sync({ path: '/fake/path/package.json' as AbsolutePath })
      ).toStrictEqual(expectedJson);
    });

    it('throws if path is not absolute', async () => {
      expect.hasAssertions();

      expect(() =>
        readJsonc.sync({ path: 'does/not/exist/package.json' as AbsolutePath })
      ).toThrow(ErrorMessage.PathIsNotAbsolute('does/not/exist/package.json'));
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(() =>
        readJsonc.sync({ path: '/does/not/exist/package.json' as AbsolutePath })
      ).toThrow(ErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileSync.mockImplementation(() => '{{');

      expect(() => readJsonc.sync({ path })).toThrow(ErrorMessage.NotParsable(path));
    });
  });

  describe('<asynchronous>', () => {
    it('accepts a package.json path and returns its parsed contents', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      await expect(
        readJsonc({ path: '/fake/path/package.json' as AbsolutePath })
      ).resolves.toStrictEqual(expectedJson);
    });

    it('throws if path is not absolute', async () => {
      expect.hasAssertions();

      await expect(
        readJsonc({ path: 'does/not/exist/package.json' as AbsolutePath })
      ).rejects.toThrow(ErrorMessage.PathIsNotAbsolute('does/not/exist/package.json'));
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject('fail'));

      await expect(
        readJsonc({ path: '/does/not/exist/package.json' as AbsolutePath })
      ).rejects.toThrow(ErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(readJsonc({ path })).rejects.toThrow(ErrorMessage.NotParsable(path));
    });
  });
});

describe('::readPackageJsonAtRoot', () => {
  describe('<synchronous>', () => {
    it('accepts a package directory and returns parsed package.json contents', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      expect(
        readPackageJsonAtRoot.sync({ root: fixtures.goodPolyrepo.root })
      ).toStrictEqual(expectedJson);
    });

    it('throws if path is not absolute', async () => {
      expect.hasAssertions();

      expect(() =>
        readPackageJsonAtRoot.sync({ root: 'does/not/exist' as AbsolutePath })
      ).toThrow(ErrorMessage.PathIsNotAbsolute('does/not/exist/package.json'));
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(() =>
        readPackageJsonAtRoot.sync({ root: '/does/not/exist' as AbsolutePath })
      ).toThrow('/does/not/exist/package.json');
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => '{{');

      expect(() =>
        readPackageJsonAtRoot.sync({ root: fixtures.goodPolyrepo.root })
      ).toThrow(`${fixtures.goodPolyrepo.root}/package.json`);
    });
  });

  describe('<asynchronous>', () => {
    it('accepts a package directory and returns parsed package.json contents', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      await expect(
        readPackageJsonAtRoot({ root: fixtures.goodPolyrepo.root })
      ).resolves.toStrictEqual(expectedJson);
    });

    it('throws if path is not absolute', async () => {
      expect.hasAssertions();

      await expect(
        readPackageJsonAtRoot({ root: 'does/not/exist' as AbsolutePath })
      ).rejects.toThrow(ErrorMessage.PathIsNotAbsolute('does/not/exist/package.json'));
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject('fail'));

      await expect(
        readPackageJsonAtRoot({ root: '/does/not/exist' as AbsolutePath })
      ).rejects.toThrow('/does/not/exist/package.json');
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(
        readPackageJsonAtRoot({ root: fixtures.goodPolyrepo.root })
      ).rejects.toThrow(`${fixtures.goodPolyrepo.root}/package.json`);
    });
  });
});

describe('::deriveVirtualPrettierignoreLines', () => {
  describe('<synchronous>', () => {
    it('returns lines from root .prettierignore file', async () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementationOnce((path) => {
        expect(path).toBe('/fake/root/.prettierignore');

        return [
          '# should be ignored',
          'item-1',
          '# should be ignored',
          'item-2',
          '# should be ignored'
        ].join('\n');
      });

      expect(
        deriveVirtualPrettierignoreLines.sync({
          projectRoot: '/fake/root' as AbsolutePath
        })
      ).toStrictEqual(['item-1', 'item-2']);
    });

    it('returns empty array if .prettierignore does not exist', async () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementationOnce(() => toss(new Error('contrived')));

      expect(
        deriveVirtualPrettierignoreLines.sync({
          projectRoot: '/fake/root' as AbsolutePath
        })
      ).toStrictEqual([]);
    });

    it('triggers a type error given bad sync options', async () => {
      expect.hasAssertions();

      expect(() =>
        deriveVirtualPrettierignoreLines.sync({
          projectRoot: '/fake/root' as AbsolutePath,
          // @ts-expect-error: we expect this to fail or something's wrong
          includeUnknownPaths: true
        })
      ).toThrow(ErrorMessage.DeriverAsyncConfigurationConflict());
    });
  });

  describe('<asynchronous>', () => {
    it('returns lines from root .prettierignore file', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementationOnce((path) => {
        expect(path).toBe('/fake/root/.prettierignore');

        return Promise.resolve(
          [
            '# should be ignored',
            'item-1',
            '# should be ignored',
            'item-2',
            '# should be ignored'
          ].join('\n')
        );
      });

      await expect(
        deriveVirtualPrettierignoreLines({
          projectRoot: '/fake/root' as AbsolutePath
        })
      ).resolves.toStrictEqual(['item-1', 'item-2']);
    });

    it('returns empty array if .prettierignore does not exist', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementationOnce(() => Promise.reject());

      await expect(
        deriveVirtualPrettierignoreLines({
          projectRoot: '/fake/root' as AbsolutePath,
          includeUnknownPaths: false
        })
      ).resolves.toStrictEqual([]);
    });

    it('returns lines from root .prettierignore file and unknown files from git if requested', async () => {
      expect.hasAssertions();

      mockedRun.mockImplementationOnce(
        () =>
          Promise.resolve({ stdout: ['item-3', 'item-4'].join('\n') }) as ReturnType<
            typeof runNoRejectOnBadExit
          >
      );

      mockedReadFileAsync.mockImplementationOnce((path) => {
        expect(path).toBe('/fake/root/.prettierignore');

        return Promise.resolve(
          [
            '# should be ignored',
            'item-1',
            '# should be ignored',
            'item-2',
            '# should be ignored'
          ].join('\n')
        );
      });

      await expect(
        deriveVirtualPrettierignoreLines({
          projectRoot: '/fake/root' as AbsolutePath,
          includeUnknownPaths: true
        })
      ).resolves.toStrictEqual(['item-1', 'item-2', 'item-3', 'item-4']);
    });
  });
});

describe('::deriveVirtualGitignoreLines', () => {
  describe('<synchronous>', () => {
    it('returns lines from root .gitignore file', async () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementationOnce((path) => {
        expect(path).toBe('/fake/root/.gitignore');

        return [
          '# should be ignored',
          'item-1',
          '# should be ignored',
          'item-2',
          '# should be ignored'
        ].join('\n');
      });

      expect(
        deriveVirtualGitignoreLines.sync({ projectRoot: '/fake/root' as AbsolutePath })
      ).toStrictEqual(['item-1', 'item-2']);
    });

    it('returns empty array if .gitignore does not exist', async () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementationOnce(() => toss(new Error('contrived')));

      expect(
        deriveVirtualGitignoreLines.sync({ projectRoot: '/fake/root' as AbsolutePath })
      ).toStrictEqual([]);
    });

    it('triggers a type error given bad sync options', async () => {
      expect.hasAssertions();

      expect(() =>
        deriveVirtualGitignoreLines.sync({
          projectRoot: '/fake/root' as AbsolutePath,
          // @ts-expect-error: we expect this to fail or something's wrong
          includeUnknownPaths: true
        })
      ).toThrow(ErrorMessage.DeriverAsyncConfigurationConflict());
    });
  });

  describe('<asynchronous>', () => {
    it('returns lines from root .gitignore file', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementationOnce((path) => {
        expect(path).toBe('/fake/root/.gitignore');

        return Promise.resolve(
          [
            '# should be ignored',
            'item-1',
            '# should be ignored',
            'item-2',
            '# should be ignored'
          ].join('\n')
        );
      });

      await expect(
        deriveVirtualGitignoreLines({
          projectRoot: '/fake/root' as AbsolutePath
        })
      ).resolves.toStrictEqual(['item-1', 'item-2']);
    });

    it('returns empty array if .gitignore does not exist', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementationOnce(() => Promise.reject());

      await expect(
        deriveVirtualGitignoreLines({
          projectRoot: '/fake/root' as AbsolutePath,
          includeUnknownPaths: false
        })
      ).resolves.toStrictEqual([]);
    });

    it('returns lines from root .gitignore file and unknown files from git if requested', async () => {
      expect.hasAssertions();

      mockedRun.mockImplementationOnce(
        () =>
          Promise.resolve({ stdout: ['item-3', 'item-4'].join('\n') }) as ReturnType<
            typeof runNoRejectOnBadExit
          >
      );

      mockedReadFileAsync.mockImplementationOnce((path) => {
        expect(path).toBe('/fake/root/.gitignore');

        return Promise.resolve(
          [
            '# should be ignored',
            'item-1',
            '# should be ignored',
            'item-2',
            '# should be ignored'
          ].join('\n')
        );
      });

      await expect(
        deriveVirtualGitignoreLines({
          projectRoot: '/fake/root' as AbsolutePath,
          includeUnknownPaths: true
        })
      ).resolves.toStrictEqual(['item-1', 'item-2', 'item-3', 'item-4']);
    });
  });
});
