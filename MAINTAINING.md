# Maintaining

This is documentation for maintainers of this project.

## Code of Conduct

Please [review][1], understand, and be an example of it. Violations of the code
of conduct are taken seriously, even (especially) for maintainers.

## Issues

We want to support and build the community. We do that best by helping people
learn to solve their own problems. We have an issue template and hopefully most
folks follow it. If it's not clear what the issue is, invite them to create a
minimal reproduction of what they're trying to accomplish or the bug they think
they've found.

Once it's determined that a code change is necessary, point people to
[makeapullrequest.com][2] and invite them to make a pull request. If they're the
one who needs the feature, they're the one who can build it. If they need some
hand holding and you have time to lend a hand, please do so. It's an investment
into another human being, and an investment into a potential maintainer.

Remember that this is open source, so the code is not yours, it's ours. If
someone needs a change in the codebase, you don't have to make it happen
yourself. Commit as much time to the project as you want/need to. Nobody can ask
any more of you than that.

## Pull Requests

As a maintainer, you're fine to make your branches on the main repo or on your
own fork. Either way is fine.

When we receive a pull request, a GitHub Actions build is kicked off
automatically (see [`.github/workflows`][3]). We avoid merging anything that
fails the Actions workflow.

Please review PRs and focus on the code rather than the individual. You never
know when this is someone's first ever PR and we want their experience to be as
positive as possible, so be uplifting and constructive.

When you merge the pull request, 99% of the time you should use the [rebase and
merge][4] feature. This keeps our git history clean. If commit messages need to
be adjusted, maintainers should force push new commits with adjusted messages to
the PR branch before merging it in.

The [squash and merge][5] feature can also be used, but keep in mind that
squashing commits will likely damage the [generated][6] [CHANGELOG.md][7],
hinder [bisection][8], and result in [non-atomic commits][9], so use it
sparingly.

## Releases

Our releases are automatic. They happen whenever code lands into `master`. A
GitHub Actions build gets kicked off and, if it's successful, a tool called
[`semantic-release`][10] is used to automatically publish a new release to npm
and GitHub along with an updated changelog. It is only able to determine the
version and whether a release is necessary by the git commit messages. With this
in mind, **please brush up on [the commit message convention][commit] which
drives our releases.**

> One important note about this: please make sure that commit messages do NOT
> contain the words "BREAKING CHANGE" in them unless we want to push a major
> version. I've been burned by this more than once where someone will include
> "BREAKING CHANGE: None" and it will end up releasing a new major version. Do
> not do this!

### Manual Releases

This project has an automated release set up. That means things are only
released when there are useful changes in the code that justify a release. See
[the release rules][11] for a list of commit types that trigger releases.

However, sometimes things get messed up (e.g. CI workflow / GitHub Actions
breaks) and we need to trigger a release ourselves. When this happens,
semantic-release can be triggered locally by following these steps:

> If one of these steps fails, you should address the failure before running the
> next step.

```bash
# These commands must be run from the project root. It is recommended to clone a
# fresh version of the repo to a temp directory and run these commands from
# there.

# 1. Install dependencies and add your auth tokens to the .env file.
# ! DO NOT COMMIT THE .env FILE !
cp .env.default .env
npm ci

# 2. OPTIONAL: Reset the working tree to a clean state.
# npm run clean -- --force

# 3. Lint all files.
npm run lint:source:all

# 4. Build distributables.
npm run build:dist

# 5. Build any external executables (used in GitHub Actions workflows).
npm run build:externals

# 6. Format all files.
npm run format

# 7. Build auxiliary documentation (AFTER format so line numbers are correct).
npm run build:docs

# 8. Run all possible tests and generate coverage information.
npm run test:all

# 9. Trigger semantic-release locally and generate a new release. This requires
# having valid tokens for NPM and GitHub with the appropriate permissions.
#
# Do a dry run first:
NPM_TOKEN="$(npx --yes dotenv-cli -p NPM_TOKEN)" GH_TOKEN="$(npx --yes dotenv-cli -p GITHUB_TOKEN)" HUSKY=0 UPDATE_CHANGELOG=true GIT_AUTHOR_NAME="$(npx --yes dotenv-cli -p GIT_AUTHOR_NAME)" GIT_COMMITTER_NAME="$(npx --yes dotenv-cli -p GIT_COMMITTER_NAME)" GIT_AUTHOR_EMAIL="$(npx --yes dotenv-cli -p GIT_AUTHOR_EMAIL)" GIT_COMMITTER_EMAIL="$(npx --yes dotenv-cli -p GIT_COMMITTER_EMAIL)" npx --no-install semantic-release --no-ci --extends "$(pwd)/release.config.js" --dry-run
# Then do the actual publish:
NPM_TOKEN="$(npx --yes dotenv-cli -p NPM_TOKEN)" GH_TOKEN="$(npx --yes dotenv-cli -p GITHUB_TOKEN)" HUSKY=0 UPDATE_CHANGELOG=true GIT_AUTHOR_NAME="$(npx --yes dotenv-cli -p GIT_AUTHOR_NAME)" GIT_COMMITTER_NAME="$(npx --yes dotenv-cli -p GIT_COMMITTER_NAME)" GIT_AUTHOR_EMAIL="$(npx --yes dotenv-cli -p GIT_AUTHOR_EMAIL)" GIT_COMMITTER_EMAIL="$(npx --yes dotenv-cli -p GIT_COMMITTER_EMAIL)" npx --no-install semantic-release --no-ci --extends "$(pwd)/release.config.js"

# 10. Upload coverage information to codecov (only if you have a valid token).
CODECOV_TOKEN=$(npx --yes dotenv-cli -p CODECOV_TOKEN) npx codecov
```

<!-- lint ignore -->

## Deprecation and End of Life

> "Everything that has a beginning has an end, Neo."
>
> — Agent Smith, The Matrix Revolutions (2003)

Sometimes, for a variety of reasons, the maintenance window on a project may
close for good. It happens. And when it does, there is a need to make clear to
all current and future users that the project and its assets (repository,
published packages, etc) are to be considered deprecated and that no further
maintenance is intended.

With somber focus, the following steps should be taken:

> If you're using [xscripts][12], all of this can be done automatically via
> `xscripts project renovate --deprecate`.

> These steps were inspired by [Richard Litt's checklist][13].

### Deprecate the Remote (GitHub) repository

> If the deprecated project is using [xscripts][12]/[xpipeline][14], at least
> one of the commits created as a result of following these instructions must be
> of the [`build` type][15]. If operating on a monorepo, said commit must touch
> every package.

<br />

- [ ] **Update Metadata**

GitHub repositories have metadata settings that can be configured via the [gear
icon][16]. Once the modal is revealed, the following settings should be updated:

- `⛔️ [DEPRECATED]` should be prepended to the description.

- If the website is pointing to NPM, the input box should be emptied.

- All three checkboxes under "Include in the home page" (i.e. "Releases,"
  "Packages," and "Deployments) should be unchecked.

Be sure to save the changes by pressing "Save changes"!

<br />

- [ ] **Update `README.md`**

The project root `README.md` file and any README files at `packages/*/README.md`
(if applicable) should be updated as follows:

- The level one heading at the top of the file should be updated to "# ⛔️
  DEPRECATED/UNMAINTAINED" (no quotes).

- All badges except badge-blm should be removed; badge-unmaintained should be
  added.

- Under the updated level one heading, a [caution alert][17] should be included
  that details the reason why this project is being deprecated. Any
  alternatives, forks, see-also's, and/or future projects should be linked here.

What follows is an example outcome of the above steps:

```markdown
<!-- badges-start -->

[![Black Lives Matter!][badge-blm]][link-blm]
[![!!UNMAINTAINED!!][badge-unmaintained]][link-unmaintained]

<!-- badges-end -->

# ⛔️ DEPRECATED/UNMAINTAINED

> \[!CAUTION]
>
> This project has been superseded (and all of its useful bits subsumed) by
> [something-else](https://github.com/something/else).

...

[badge-blm]: https://xunn.at/badge-blm 'Join the movement!'
[link-blm]: https://xunn.at/donate-blm
[badge-unmaintained]:
  https://xunn.at/badge-unmaintained
  'Unfortunately, this project is unmaintained (forks welcome!)'
[link-unmaintained]: https://xunn.at/link-unmaintained
```

<br />

- [ ] **Update `package.json` (if applicable)**

If the project has a `package.json` file at its root and/or at
`packages/*/package.json` (if applicable), they should be updated as follows:

- The [`description` string][18] should be prefixed with `⛔️ [DEPRECATED]`.

- The strings `"deprecated", "obsolete", "archived"` should be added to the
  [`keywords` array][19] if this file defines a published package.

### Deprecate the Published Packages

- [ ] **Update `package.json` (if applicable)**

[See above][20].

- [ ] **Publish Final Version**

Any updates to [source repository][21] assets (including `package.json` files
and adding deprecation language to `README.md` files) should be published as a
single patch release in a polyrepo, or one release per package in a monorepo.

- [ ] **Issue Package-Wide Deprecation Command**

Use [`npm deprecate`][22] to [officially deprecate][23] each package after their
final patch releases are published.

### Deprecate the Local Repository

Consider moving the repository to a place where it is accessible but otherwise
out of the way, e.g. `/repos/.deprecated/<deprecated-repo-here>`.

## Thanks!

Thank you so much for helping to maintain this project!

[commit]:
  https://github.com/conventional-changelog-archived-repos/conventional-changelog-angular/blob/ed32559941719a130bb0327f886d6a32a8cbc2ba/convention.md
[1]: ./.github/CODE_OF_CONDUCT.md
[2]: http://makeapullrequest.com
[3]: ./.github/workflows
[4]:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#rebase-and-merge-your-commits
[5]:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#squash-and-merge-your-commits
[6]: https://github.com/conventional-changelog/conventional-changelog
[7]: https://www.conventionalcommits.org/en/v1.0.0
[8]:
  https://www.metaltoad.com/blog/beginners-guide-git-bisect-process-elimination
[9]: https://dev.to/paulinevos/atomic-commits-will-help-you-git-legit-35i7
[10]: https://github.com/semantic-release/semantic-release
[11]:
  https://github.com/Xunnamius/black-flag/blob/eec78609146a92cab29caa9d1fa05a0581e5bd3f/release.config.js#L27
[12]: https://github.com/Xunnamius/xscripts
[13]:
  https://github.com/RichardLitt/knowledge/blob/master/github/how-to-deprecate-a-repository-on-github.md
[14]: https://github.com/Xunnamius/pipeline
[15]:
  https://github.com/Xunnamius/xscripts/blob/2da3d8abed3de3d2ebc33d3cd54da3190dc2c63c/src/assets/config/_conventional.config.js.ts#L201-L214
[16]: https://github.com/orgs/community/discussions/54372
[17]: https://github.com/orgs/community/discussions/16925
[18]: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#description-1
[19]: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#keywords
[20]: #deprecate-the-remote-github-repository
[21]: #deprecate-the-github-repository
[22]: https://docs.npmjs.com/cli/v8/commands/npm-deprecate
[23]:
  https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions
