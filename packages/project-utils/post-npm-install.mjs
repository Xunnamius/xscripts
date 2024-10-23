// @ts-check
import { mkdir, writeFile } from 'node:fs/promises';

import { glob as globAsync } from 'glob';

// TODO: replace with rejoinder once published
import { createGenericLogger } from '../../node_modules/@-xun/scripts/dist/packages/rejoinder/src/index.js';

const root = import.meta.dirname;
const log = createGenericLogger({ namespace: 'post-npm-install' });

await Promise.all([
  globAsync(`${root}/test/fixtures/dummy-repo/*/`, {
    absolute: true,
    dot: true,
    cwd: root
  }).then(async (paths) => {
    await Promise.all(paths.map((path) => mkdir(`${path}/.git`, { recursive: true })));
    log('Created %O test fixture dummy .git directories', paths.length);
  }),
  mkdir(`${root}/test/fixtures/dummy-repo/good-hybridrepo/.git-ignored`, {
    recursive: true
  }).then(async () => {
    await writeFile(
      `${root}/test/fixtures/dummy-repo/good-hybridrepo/.git-ignored/nope.md`,
      'Nope!',
      { encoding: 'utf8' }
    );

    log('Created .git-ignored dummy directory in good-hybridrepo');
  })
]);
