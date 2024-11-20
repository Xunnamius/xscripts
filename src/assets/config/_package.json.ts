// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type gatherPackageBuildTargets } from 'multiverse+project-utils:analyze.ts';

import { assertIsExpectedTransformerContext, makeTransformer } from 'universe:assets.ts';

import type { EmptyObject, PackageJson } from 'type-fest';

export type Context = EmptyObject;

// TODO ("type": "module")

// TODO: the XPackageJson type goes into @-xun/types (also update deps) because
// TODO: importing this type needs to be lightweight and not require the whole
// TODO: @-xun/scripts package!
export type XPackageJson = PackageJson & {
  scripts?: {
    /**
     * Run by users, xscripts, and related tooling when building the current
     * package's production-ready distributables.
     *
     * This script is usually a reference to `npm run build:dist`.
     *
     * @example `npm run build:dist --`
     */
    build?: string;
    /**
     * Run by users, xscripts, and related tooling when building the current
     * package's `CHANGELOG.md` file.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts build changelog`
     */
    'build:changelog'?: string;
    /**
     * Run by users, xscripts, and related tooling when building the current
     * package's production-ready distributables.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts build distributables`
     */
    'build:dist'?: string;
    /**
     * Run by users, xscripts, and related tooling when building the current
     * package's documentation (typically found under `docs/`).
     *
     * @example `NODE_NO_WARNINGS=1 xscripts build docs`
     */
    'build:docs'?: string;
    /**
     * Run by users, xscripts, and related tooling when removing files from the
     * project or package that are ignored by git (with exceptions).
     *
     * @example `NODE_NO_WARNINGS=1 xscripts clean`
     */
    clean?: string;
    /**
     * Run by users, xscripts, and related tooling when formatting the project
     * or package.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts format --hush`
     */
    format?: string;
    /**
     * Run by users, xscripts, and related tooling when printing information
     * about the current project or package.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts project info`
     */
    info?: string;
    /**
     * Run by users, xscripts, and related tooling when linting the current
     * package's files.
     *
     * This script is usually a reference to `npm run lint:package`.
     *
     * @example `npm run lint:package --`
     */
    lint?: string;
    /**
     * Run by users, xscripts, and related tooling when linting all of the
     * lintable files under the current package's root along with any other
     * source files that comprise this package's build targets (see
     * {@link gatherPackageBuildTargets}).
     *
     * @example `NODE_NO_WARNINGS=1 xscripts lint --scope this-package`
     */
    'lint:package'?: string;
    /**
     * Run by users, xscripts, and related tooling when linting all lintable
     * files in the entire project.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts lint --scope unlimited`
     */
    'lint:packages'?: string;
    /**
     * Run by users, xscripts, and related tooling when linting a project's
     * metadata, such as its file structure and configuration settings.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts project lint`
     */
    'lint:project'?: string;
    /**
     * Run by users, xscripts, and related tooling when printing information
     * about available scripts in `package.json`.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts list-tasks`
     */
    'list-tasks'?: string;
    /**
     * Run by users, xscripts, and related tooling when preparing a fresh
     * development environment.
     *
     * See [the
     * docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#prepare-and-prepublish)
     * for more information.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts project prepare`
     */
    prepare?: string;
    /**
     * Run by users, xscripts, and related tooling when potentially releasing
     * the next version of a package.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts release`
     */
    release?: string;
    /**
     * Run by users, xscripts, and related tooling when manipulating a project's
     * _metadata_, such as its file structure and configuration settings, with
     * the goal of bringing the project up to date on latest best practices.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts project renovate`
     */
    renovate?: string;
    /**
     * Run by users, xscripts, and related tooling when attempting to execute a
     * project's distributables locally.
     *
     * See [the docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-start)
     * for more information.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts start --`
     */
    start?: string;
    /**
     * Run by users, xscripts, and related tooling when spinning up a project's
     * local development environment.
     */
    dev?: string;
    /**
     * Run by users, xscripts, and related tooling  when executing unit tests
     * against the current package.
     *
     * This script is usually a reference to `npm run test:package:unit`. See
     * [the docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-test) for
     * more information.
     *
     * @example `npm run test:package:unit --`
     */
    test?: string;
    /**
     * Run by users, xscripts, and related tooling when executing all possible
     * tests against the current package. In a monorepo context, this script
     * will also run the tests of any package that this package depends on
     * (including transitive dependencies).
     *
     * @example `NODE_NO_WARNINGS=1 xscripts test --scope this-package --coverage`
     */
    'test:package:all'?: string;
    /**
     * Run by users, xscripts, and related tooling when executing end-to-end
     * tests against the current package. In a monorepo context, this script
     * will also run the tests of any package that this package depends on
     * (including transitive dependencies).
     *
     * @example `NODE_NO_WARNINGS=1 xscripts test --scope this-package --tests end-to-end`
     */
    'test:package:e2e'?: string;
    /**
     * Run by users, xscripts, and related tooling when executing integration
     * tests against the current package. In a monorepo context, this script
     * will also run the tests of any package that this package depends on
     * (including transitive dependencies).
     *
     * @example `NODE_NO_WARNINGS=1 xscripts test --scope this-package --tests integration`
     */
    'test:package:integration'?: string;
    /**
     * Run by users, xscripts, and related tooling when executing unit tests
     * against the current package. In a monorepo context, this script
     * will also run the tests of any package that this package depends on
     * (including transitive dependencies).
     *
     * @example `NODE_NO_WARNINGS=1 xscripts test --scope this-package --tests unit`
     */
    'test:package:unit'?: string;
    /**
     * Run by users, xscripts, and related tooling when executing all possible
     * tests across the entire project.
     *
     * @example `NODE_NO_WARNINGS=1 xscripts test --scope unlimited --coverage`
     */
    'test:packages:all'?: string;
  };
};

export const { transformer } = makeTransformer<Context>({
  transform(context) {
    const { name } = assertIsExpectedTransformerContext(context);

    return {
      [name]: `

`.trimStart()
    };
  }
});
