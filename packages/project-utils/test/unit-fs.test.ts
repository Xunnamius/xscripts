import { accessSync, readFileSync } from 'node:fs';
import { access as accessAsync, readFile as readFileAsync } from 'node:fs/promises';
import { relative } from 'node:path';

import { runNoRejectOnBadExit } from '@-xun/run';
import { toss } from 'toss-expression';

import { asMockedFunction } from 'multiverse+test-utils';

import { cache } from 'rootverse+project-utils:src/cache.ts';
import { ErrorMessage } from 'rootverse+project-utils:src/error.ts';

import {
  deriveVirtualGitignoreLines,
  deriveVirtualPrettierignoreLines,
  isAbsolutePath,
  isAccessible,
  isRelativePath,
  readJson,
  readJsonc,
  readPackageJsonAtRoot,
  toAbsolutePath,
  toPath,
  toRelativePath,
  type AbsolutePath,
  type RelativePath
} from 'rootverse+project-utils:src/fs.ts';

import { fixtures } from 'rootverse+project-utils:test/helpers/dummy-repo.ts';

jest.mock('node:fs');
jest.mock('node:fs/promises');
jest.mock('@-xun/run');

const mockedReadFileSync = asMockedFunction(readFileSync);
const mockedReadFileAsync = asMockedFunction(readFileAsync);
const mockedAccessSync = asMockedFunction(accessSync);
const mockedAccessAsync = asMockedFunction(accessAsync);
const mockedRun = asMockedFunction(runNoRejectOnBadExit);

const cwd = process.cwd();

afterEach(() => {
  cache.clear();
});

describe('::isAccessible', () => {
  describe('<synchronous>', () => {
    it('returns true for path with default accessibility (R_OK)', () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementation(() => undefined);

      expect(isAccessible.sync('/pretend/it/does/exist', { useCached: true })).toBeTrue();
    });

    it('returns false for path without default accessibility (R_OK)', () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementation(() => toss(new Error('nope')));

      expect(
        isAccessible.sync('/pretend/it/does/exist', { useCached: true })
      ).toBeFalse();
    });

    it('returns false for non-existent path', () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementation(() => toss(new Error('no')));

      expect(isAccessible.sync('/does/not/exist', { useCached: true })).toBeFalse();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementation(() => undefined);

      expect(
        isAccessible.sync('/pretend/it/does/exist', { useCached: false })
      ).toBeTrue();

      mockedAccessSync.mockImplementation(() => toss(new Error('no')));

      expect(isAccessible.sync('/pretend/it/does/exist', { useCached: true })).toBeTrue();

      mockedAccessSync.mockImplementation(() => toss(new Error('no')));

      expect(
        isAccessible.sync('/pretend/it/does/exist', { useCached: false })
      ).toBeFalse();

      mockedAccessSync.mockImplementation(() => undefined);

      expect(isAccessible.sync('/different/path', { useCached: true })).toBeTrue();
    });
  });

  describe('<asynchronous>', () => {
    it('returns true for path with default accessibility (R_OK)', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementation(() => Promise.resolve());

      await expect(
        isAccessible('/pretend/it/does/exist', { useCached: true })
      ).resolves.toBeTrue();
    });

    it('returns false for path without default accessibility (R_OK)', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementation(() => Promise.reject(new Error('nope')));

      await expect(
        isAccessible('/pretend/it/does/exist', { useCached: true })
      ).resolves.toBeFalse();
    });

    it('returns false for non-existent path', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementation(() => Promise.reject(new Error('no')));

      await expect(
        isAccessible('/does/not/exist', { useCached: true })
      ).resolves.toBeFalse();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementation(() => Promise.resolve());

      await expect(
        isAccessible('/pretend/it/does/exist', { useCached: false })
      ).resolves.toBeTrue();

      mockedAccessAsync.mockImplementation(() => Promise.reject(new Error('no')));

      await expect(
        isAccessible('/pretend/it/does/exist', { useCached: true })
      ).resolves.toBeTrue();

      mockedAccessAsync.mockImplementation(() => Promise.reject(new Error('no')));

      await expect(
        isAccessible('/pretend/it/does/exist', { useCached: false })
      ).resolves.toBeFalse();

      mockedAccessAsync.mockImplementation(() => Promise.resolve());

      await expect(
        isAccessible('/different/path', { useCached: true })
      ).resolves.toBeTrue();
    });
  });
});

describe('::readJson', () => {
  describe('<synchronous>', () => {
    it('accepts a package.json path and returns its parsed contents', () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      expect(
        readJson.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toStrictEqual(expectedJson);
    });

    it('throws on read failure', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(() =>
        readJson.sync('/does/not/exist/package.json' as AbsolutePath, { useCached: true })
      ).toThrow(ErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileSync.mockImplementation(() => '{{');

      expect(() => readJson.sync(path, { useCached: true })).toThrow(
        ErrorMessage.NotParsable(path)
      );
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      const json = readJson.sync('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(json).toStrictEqual(expectedJson);

      expect(
        readJson.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toBe(json);

      const updatedJson = readJson.sync('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(updatedJson).not.toBe(json);

      expect(
        readJson.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toBe(updatedJson);
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
        readJson('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toStrictEqual(expectedJson);
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject());

      await expect(
        readJson('/does/not/exist/package.json' as AbsolutePath, { useCached: true })
      ).rejects.toThrow(ErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(readJson(path, { useCached: true })).rejects.toThrow(
        ErrorMessage.NotParsable(path)
      );
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      const json = await readJson('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(json).toStrictEqual(expectedJson);

      await expect(
        readJson('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toBe(json);

      const updatedJson = await readJson('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(updatedJson).not.toBe(json);

      await expect(
        readJson('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toBe(updatedJson);
    });
  });
});

describe('::readJsonc', () => {
  describe('<synchronous>', () => {
    it('accepts a package.json path and returns its parsed contents', () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      expect(
        readJsonc.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toStrictEqual(expectedJson);
    });

    it('throws on read failure', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(() =>
        readJsonc.sync('/does/not/exist/package.json' as AbsolutePath, {
          useCached: true
        })
      ).toThrow(ErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileSync.mockImplementation(() => '{{');

      expect(() => readJsonc.sync(path, { useCached: true })).toThrow(
        ErrorMessage.NotParsable(path)
      );
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      const json = readJsonc.sync('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(json).toStrictEqual(expectedJson);

      expect(
        readJsonc.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toBe(json);

      const updatedJson = readJsonc.sync('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(updatedJson).not.toBe(json);

      expect(
        readJsonc.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toBe(updatedJson);
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
        readJsonc('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toStrictEqual(expectedJson);
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject('fail'));

      await expect(
        readJsonc('/does/not/exist/package.json' as AbsolutePath, { useCached: true })
      ).rejects.toThrow(ErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(readJsonc(path, { useCached: true })).rejects.toThrow(
        ErrorMessage.NotParsable(path)
      );
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      const json = await readJsonc('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(json).toStrictEqual(expectedJson);

      await expect(
        readJsonc('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toBe(json);

      const updatedJson = await readJsonc('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(updatedJson).not.toBe(json);

      await expect(
        readJsonc('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toBe(updatedJson);
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
        readPackageJsonAtRoot.sync(fixtures.goodPolyrepo.root, { useCached: true })
      ).toStrictEqual(expectedJson);
    });

    it('throws on read failure', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(() =>
        readPackageJsonAtRoot.sync('/does/not/exist' as AbsolutePath, { useCached: true })
      ).toThrow('/does/not/exist/package.json');
    });

    it('throws on parse failure', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => '{{');

      expect(() =>
        readPackageJsonAtRoot.sync(fixtures.goodPolyrepo.root, { useCached: true })
      ).toThrow(`${fixtures.goodPolyrepo.root}/package.json`);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      const json = readPackageJsonAtRoot.sync('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(json).toStrictEqual(expectedJson);

      expect(
        readPackageJsonAtRoot.sync('/fake/path/package.json' as AbsolutePath, {
          useCached: true
        })
      ).toBe(json);

      const updatedJson = readPackageJsonAtRoot.sync(
        '/fake/path/package.json' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedJson).not.toBe(json);

      expect(
        readPackageJsonAtRoot.sync('/fake/path/package.json' as AbsolutePath, {
          useCached: true
        })
      ).toBe(updatedJson);
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
        readPackageJsonAtRoot(fixtures.goodPolyrepo.root, { useCached: true })
      ).resolves.toStrictEqual(expectedJson);
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject('fail'));

      await expect(
        readPackageJsonAtRoot('/does/not/exist' as AbsolutePath, { useCached: true })
      ).rejects.toThrow('/does/not/exist/package.json');
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(
        readPackageJsonAtRoot(fixtures.goodPolyrepo.root, { useCached: true })
      ).rejects.toThrow(`${fixtures.goodPolyrepo.root}/package.json`);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      const json = await readPackageJsonAtRoot(
        '/fake/path/package.json' as AbsolutePath,
        { useCached: false }
      );

      expect(json).toStrictEqual(expectedJson);

      await expect(
        readPackageJsonAtRoot('/fake/path/package.json' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(json);

      const updatedJson = await readPackageJsonAtRoot(
        '/fake/path/package.json' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedJson).not.toBe(json);

      await expect(
        readPackageJsonAtRoot('/fake/path/package.json' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(updatedJson);
    });
  });
});

describe('::deriveVirtualPrettierignoreLines', () => {
  describe('<synchronous>', () => {
    it('returns lines from root .prettierignore file', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation((path) => {
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
        deriveVirtualPrettierignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toStrictEqual(['.git', 'item-1', 'item-2']);
    });

    it('returns base array if .prettierignore does not exist', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(
        deriveVirtualPrettierignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toStrictEqual(['.git']);
    });

    it('triggers a type error given bad sync options', () => {
      expect.hasAssertions();

      expect(() =>
        deriveVirtualPrettierignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true,
          // @ts-expect-error: we expect this to fail or something's wrong
          includeUnknownPaths: true
        })
      ).toThrow(ErrorMessage.DeriverAsyncConfigurationConflict());
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.prettierignore');

        return [
          '# should be ignored',
          'item-1',
          '# should be ignored',
          'item-2',
          '# should be ignored'
        ].join('\n');
      });

      const result = deriveVirtualPrettierignoreLines.sync('/fake/root' as AbsolutePath, {
        useCached: false
      });

      expect(result).toStrictEqual(['.git', 'item-1', 'item-2']);

      expect(
        deriveVirtualPrettierignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toBe(result);

      const updatedResult = deriveVirtualPrettierignoreLines.sync(
        '/fake/root' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedResult).not.toBe(result);

      expect(
        deriveVirtualPrettierignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toBe(updatedResult);
    });
  });

  describe('<asynchronous>', () => {
    it('returns lines from root .prettierignore file', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation((path) => {
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
        deriveVirtualPrettierignoreLines('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toStrictEqual(['.git', 'item-1', 'item-2']);
    });

    it('returns base array if .prettierignore does not exist', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject());

      await expect(
        deriveVirtualPrettierignoreLines('/fake/root' as AbsolutePath, {
          useCached: true,
          includeUnknownPaths: false
        })
      ).resolves.toStrictEqual(['.git']);
    });

    it('returns lines from root .prettierignore file and unknown files from git if requested', async () => {
      expect.hasAssertions();

      mockedRun.mockImplementation(
        () =>
          Promise.resolve({
            stdout: ['.git', 'item-3', 'item-4'].join('\n')
          }) as ReturnType<typeof runNoRejectOnBadExit>
      );

      mockedReadFileAsync.mockImplementation((path) => {
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
        deriveVirtualPrettierignoreLines('/fake/root' as AbsolutePath, {
          useCached: true,
          includeUnknownPaths: true
        })
      ).resolves.toStrictEqual(['.git', 'item-1', 'item-2', 'item-3', 'item-4']);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation((path) => {
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

      const result = await deriveVirtualPrettierignoreLines(
        '/fake/root' as AbsolutePath,
        { useCached: false }
      );

      expect(result).toStrictEqual(['.git', 'item-1', 'item-2']);

      await expect(
        deriveVirtualPrettierignoreLines('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(result);

      const updatedResult = await deriveVirtualPrettierignoreLines(
        '/fake/root' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedResult).not.toBe(result);

      await expect(
        deriveVirtualPrettierignoreLines('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(updatedResult);
    });
  });
});

describe('::deriveVirtualGitignoreLines', () => {
  describe('<synchronous>', () => {
    it('returns lines from root .gitignore file', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation((path) => {
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
        deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toStrictEqual(['.git', 'item-1', 'item-2']);
    });

    it('returns base array if .gitignore does not exist', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(
        deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toStrictEqual(['.git']);
    });

    it('triggers a type error given bad sync options', () => {
      expect.hasAssertions();

      expect(() =>
        deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true,
          // @ts-expect-error: we expect this to fail or something's wrong
          includeUnknownPaths: true
        })
      ).toThrow(ErrorMessage.DeriverAsyncConfigurationConflict());
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.gitignore');

        return [
          '# should be ignored',
          'item-1',
          '# should be ignored',
          'item-2',
          '# should be ignored'
        ].join('\n');
      });

      const result = deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
        useCached: false
      });

      expect(result).toStrictEqual(['.git', 'item-1', 'item-2']);

      expect(
        deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toBe(result);

      const updatedResult = deriveVirtualGitignoreLines.sync(
        '/fake/root' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedResult).not.toBe(result);

      expect(
        deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toBe(updatedResult);
    });
  });

  describe('<asynchronous>', () => {
    it('returns lines from root .gitignore file', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation((path) => {
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
        deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, { useCached: true })
      ).resolves.toStrictEqual(['.git', 'item-1', 'item-2']);
    });

    it('returns base array if .gitignore does not exist', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject());

      await expect(
        deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, {
          useCached: true,
          includeUnknownPaths: true
        })
      ).resolves.toStrictEqual(['.git']);
    });

    it('returns lines from root .gitignore file and unknown files from git if requested', async () => {
      expect.hasAssertions();

      mockedRun.mockImplementation(
        () =>
          Promise.resolve({
            stdout: ['.git', 'item-3', 'item-4'].join('\n')
          }) as ReturnType<typeof runNoRejectOnBadExit>
      );

      mockedReadFileAsync.mockImplementation((path) => {
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
        deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, {
          useCached: true,
          includeUnknownPaths: true
        })
      ).resolves.toStrictEqual(['.git', 'item-1', 'item-2', 'item-3', 'item-4']);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation((path) => {
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

      const result = await deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, {
        useCached: false
      });

      expect(result).toStrictEqual(['.git', 'item-1', 'item-2']);

      await expect(
        deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(result);

      const updatedResult = await deriveVirtualGitignoreLines(
        '/fake/root' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedResult).not.toBe(result);

      await expect(
        deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(updatedResult);
    });
  });
});

describe('::toAbsolutePath', () => {
  it('returns an absolute path', () => {
    expect.hasAssertions();

    expect(toAbsolutePath('/pretend/it/does/exist')).toBe('/pretend/it/does/exist');
    expect(toAbsolutePath('pretend/it/does/exist')).toBe(`${cwd}/pretend/it/does/exist`);
  });
});

describe('::toRelativePath', () => {
  it('returns a relative path from a single absolute argument path using cwd', () => {
    expect.hasAssertions();

    expect(toRelativePath(`${cwd}/pretend/it/does/exist`)).toBe('pretend/it/does/exist');
  });

  it('returns a single relative argument path as-is', () => {
    expect.hasAssertions();

    expect(toRelativePath('pretend/it/does/exist')).toBe('pretend/it/does/exist');
    expect(toRelativePath('pretend')).toBe('pretend');
  });

  it('returns a relative path from two arguments', () => {
    expect.hasAssertions();

    expect(toRelativePath('/a/b/c/x', '/a/b/1/2/3')).toBe('../../1/2/3');
    expect(toRelativePath('/a/b/1/2/3', '/a/b/c/x')).toBe('../../../c/x');
    expect(toRelativePath('/a/b/1/2/3', /* `${cwd}/` + */ 'a/b/c/x')).toBe(
      relative('/a/b/1/2/3', '/') + `${cwd}/a/b/c/x`
    );
    expect(toRelativePath('pretend/it', 'does/exist')).toBe(
      toRelativePath(`${cwd}/pretend/it`, 'does/exist')
    );

    // * Edge cases

    expect(toRelativePath('', '/a/b/1/2/3')).toBe(
      relative(process.cwd(), '/') + '/a/b/1/2/3'
    );

    expect(toRelativePath('/a/b/1/2/3', '')).toBe(relative('/a/b/1/2/3', '/') + cwd);
    expect(toRelativePath('', '1/2/3')).toBe('1/2/3');
    expect(toRelativePath('1/2/3', '')).toBe('../../..');
    expect(toRelativePath('1/2', '1/2/3/..')).toBe('');
  });

  it('returns "" when from === to', () => {
    expect.hasAssertions();
    expect(toRelativePath('/pretend', '/pretend')).toBe('');
  });

  it('returns "" when from points to to', () => {
    expect.hasAssertions();
    expect(toRelativePath('1/2/3/..', '1/2')).toBe('');
  });

  it('returns "" when passed ("", "")', () => {
    expect.hasAssertions();
    expect(toRelativePath('', '')).toBe('');
  });

  it('returns "" when passed ("")', () => {
    expect.hasAssertions();
    expect(toRelativePath('')).toBe('');
  });
});

describe('::toPath', () => {
  it('returns an AbsolutePath or RelativePath or Path depending on inputs', () => {
    expect.hasAssertions();

    expect(toPath('pretend/it/does/exist')).toBe('pretend/it/does/exist');
    expect(toPath('pretend', 'it', 'does', 'exist')).toBe('pretend/it/does/exist');
    expect(toPath('/', 'pretend', 'it', 'does', 'exist')).toBe('/pretend/it/does/exist');

    const p1: AbsolutePath = toPath('something' as AbsolutePath, 'here');
    // @ts-expect-error: should fail or something is wrong
    const p2: RelativePath = toPath('something' as AbsolutePath, 'here');
    // @ts-expect-error: should fail or something is wrong
    const p3: AbsolutePath = toPath('something' as RelativePath, 'here');
    const p4: RelativePath = toPath('something' as RelativePath, 'here');
    const p5: AbsolutePath = toPath('something' as AbsolutePath, 'here' as RelativePath);
    const p6: RelativePath = toPath('something' as RelativePath, 'here' as AbsolutePath);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    void p1, p2, p3, p4, p5, p6;
  });

  it('elides unnecessary dot path components', () => {
    expect.hasAssertions();

    expect(toPath('./pretend/it/does/exist')).toBe('pretend/it/does/exist');
    expect(toPath('./pretend/./it/does/.exist')).toBe('pretend/it/does/.exist');
    expect(toPath('./pretend/./it/../does/.exist')).toBe('pretend/does/.exist');
  });

  it('returns "." when receiving empty arguments', () => {
    expect.hasAssertions();
    expect(toPath('')).toBe('.');
    expect(toPath('', '')).toBe('.');
  });
});

describe('::isAbsolutePath', () => {
  it('returns true iff the given path is an AbsolutePath', () => {
    expect.hasAssertions();

    expect(isAbsolutePath('')).toBeFalse();
    expect(isAbsolutePath('.')).toBeFalse();
    expect(isAbsolutePath('..')).toBeFalse();
    expect(isAbsolutePath('./')).toBeFalse();
    expect(isAbsolutePath('../')).toBeFalse();
    expect(isAbsolutePath('pretend/it/does/exist')).toBeFalse();
    expect(isAbsolutePath('/pretend/it/does/exist')).toBeTrue();
    expect(isAbsolutePath('/')).toBeTrue();
  });
});

describe('::isRelativePath', () => {
  it('returns true iff the given path is an AbsolutePath', () => {
    expect.hasAssertions();

    expect(isRelativePath('')).toBeTrue();
    expect(isRelativePath('.')).toBeTrue();
    expect(isRelativePath('..')).toBeTrue();
    expect(isRelativePath('./')).toBeTrue();
    expect(isRelativePath('../')).toBeTrue();
    expect(isRelativePath('pretend/it/does/exist')).toBeTrue();
    expect(isRelativePath('/pretend/it/does/exist')).toBeFalse();
    expect(isRelativePath('/')).toBeFalse();
  });
});
