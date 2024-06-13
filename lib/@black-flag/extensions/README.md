<!-- badges-start -->

[![Black Lives Matter!][x-badge-blm-image]][x-badge-blm-link]
[![Last commit timestamp][x-badge-lastcommit-image]][x-badge-repo-link]
[![Codecov][x-badge-codecov-image]][x-badge-codecov-link]
[![Source license][x-badge-license-image]][x-badge-license-link]
[![Monthly Downloads][x-badge-downloads-image]][x-badge-npm-link]
[![NPM version][x-badge-npm-image]][x-badge-npm-link]
[![Uses Semantic Release!][x-badge-semanticrelease-image]][x-badge-semanticrelease-link]

<!-- badges-end -->

# @black-flag/extensions

Black Flag Extensions (BFE) is a collection of high-order functions that wrap
Black Flag commands' exports to provide a bevy of new declarative features, some
of which are heavily inspired by [yargs's GitHub Issues reports][1]. It's like
type-fest or jest-extended, but for Black Flag and yargs!

The goal of these extensions is to collect validation behavior that I find
myself constantly re-implementing while also standardizing my workarounds for a
few of yargs's rough edges. That said, it's important to note that BFE does not
represent a complete propositional logic and so cannot describe every possible
relation between arguments. Nor should it; BFE makes it easy to fall back to
using the yargs API imperatively when required.

In exchange for straying a bit from the vanilla yargs API, BFE greatly increases
Black Flag's declarative powers.

> See also: [why are @black-flag/extensions and @black-flag/core separate
> packages?][2]

---

<!-- remark-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Usage](#usage)
  - [`withBuilderExtensions`](#withbuilderextensions)
  - [`withUsageExtensions`](#withusageextensions)
- [Example](#example)
  - [Example 1](#example-1)
  - [Example 2](#example-2)
- [Appendix](#appendix)
  - [Differences between Black Flag Extensions and Yargs](#differences-between-black-flag-extensions-and-yargs)
  - [Black Flag versus Black Flag Extensions](#black-flag-versus-black-flag-extensions)
  - [Published Package Details](#published-package-details)
  - [License](#license)
- [Contributing and Support](#contributing-and-support)
  - [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- remark-ignore-end -->

## Install

```shell
npm install @black-flag/extensions
```

## Usage

> See also: [differences between BFE and Yargs][3].

### `withBuilderExtensions`

> ⪢ API reference: [`withBuilderExtensions`][4]

This function enables several additional options-related units of functionality
via analysis of the returned options configuration object and the parsed command
line arguments (i.e. `argv`).

Note that options passed to configuration keys, e.g.
`{ demandThisOptionXor: ['my‑argument', 'my‑argument‑2'] }`, are represented by
their exact names as defined (e.g. `'my‑argument'`) and not their aliases
(`'arg1'`) or camelCase forms (`'myArgument'`).

For example:

```javascript
import { withBuilderExtensions } from '@black-flag/extensions';

export default function command({ state }) {
  const [builder, withHandlerExtensions] = withBuilderExtensions(
    (blackFlag, helpOrVersionSet, argv) => {
      blackFlag.strict(false);

      // ▼ The "returned options configuration object"
      return {
        'my-argument': {
          alias: ['arg1'],
          demandThisOptionXor: ['arg2'],
          string: true
        },
        arg2: {
          boolean: true,
          demandThisOptionXor: ['my-argument']
        }
      };
    },
    { disableAutomaticGrouping: true }
  );

  return {
    name: 'my-command',
    builder,
    handler: withHandlerExtensions(({ myArgument, arg2 }) => {
      state.outputManager.log(
        'Executing command with arguments: arg1=${myArgument} arg2=${arg2}'
      );
    })
  };
}
```

#### New Option Configuration Keys

The following new configuration keys enable additional options-related units of
functionality beyond that offered by vanilla yargs and Black Flag:

> In the below definitions, `P`, `Q`, and `R` are arguments (or argument-value
> pairs) configured via a hypothetical call to
> [`blackFlag.options({ P: { [key]: [Q, R] }})`][5]. The truth values of `P`,
> `Q`, and `R` represent the existence of each respective argument in `argv`.

| Key                         | Definition                          |
| :-------------------------- | :---------------------------------- |
| [`requires`][6]             | `P ⟹ (Q ∧ R)` or `¬P ∨ (Q ∧ R)`     |
| [`conflicts`][7]            | `P ⟹ (¬Q ∧ ¬R)` or `¬P ∨ (¬Q ∧ ¬R)` |
| [`demandThisOptionIf`][8]   | `(Q ∨ R) ⟹ P` or `P ∨ (¬Q ∧ ¬R)`    |
| [`demandThisOption`][9]     | `P`                                 |
| [`demandThisOptionOr`][10]  | `P ∨ Q ∨ R`                         |
| [`demandThisOptionXor`][11] | `P ⊕ Q ⊕ R`                         |
| [`implies`][12]             | N/A                                 |
| [`check`][13]               | N/A                                 |
| [`subOptionOf`][14]         | N/A                                 |

Note that the checks enabled by these configuration keys:

- Are run on Black Flag's [second parsing pass][15] except where noted. This
  allows BFE to perform checks against argument _values_ in addition to the
  argument existence checks enabled by vanilla yargs.

- Will ignore the existence of the [`default`][16] key. This means you can use
  keys like `requires` and `conflicts` alongside `default` without causing
  unresolvable CLI errors. This avoids a rather unintuitive [yargs footgun][17].

---

##### `requires`

> `requires` is a superset of and replacement for vanilla yargs's
> [`implies`][18]. BFE also has [its own implication implementation][12]. Choose
> [BFE's `implies`][12] over `requires` when you want one argument to imply the
> value of another _without_ requiring the other argument to be explicitly given
> in `argv`.

> `{ P: { requires: [Q, R] }}` can be read as `P ⟹ (Q ∧ R)` or `¬P ∨ (Q ∧ R)`,
> with truth values denoting existence.

`requires` enables checks to ensure the specified arguments, or argument-value
pairs, are given conditioned on the existence of another argument. For example:

```jsonc
{
  "x": { "requires": "y" }, // ◄ Disallows x without y
  "y": {}
}
```

This configuration will trigger a check to ensure that `‑y` is given whenever
`‑x` is given.

`requires` also supports checks against the parsed _values_ of arguments in
addition to the argument existence checks demonstrated above. For example:

```jsonc
{
  // ▼ Disallows x unless y == 'one' and z is given
  "x": { "requires": [{ "y": "one" }, "z"] },
  "y": {},
  "z": { "requires": "y" } // ◄ Disallows z unless y is given
}
```

This configuration allows the following arguments: no arguments (`∅`), `‑y=...`,
`‑y=... ‑z`, `‑xz ‑y=one`; and disallows: `‑x`, `‑z`, `‑x ‑y=...`, `‑xz ‑y=...`,
`‑xz`.

---

##### `conflicts`

> `conflicts` is a superset of vanilla yargs's [`conflicts`][19].

> `{ P: { conflicts: [Q, R] }}` can be read as `P ⟹ (¬Q ∧ ¬R)` or
> `¬P ∨ (¬Q ∧ ¬R)`, with truth values denoting existence.

`conflicts` enables checks to ensure the specified arguments, or argument-value
pairs, are _never_ given conditioned on the existence of another argument. For
example:

```jsonc
{
  "x": { "conflicts": "y" }, // ◄ Disallows y if x is given
  "y": {}
}
```

This configuration will trigger a check to ensure that `‑y` is never given
whenever `‑x` is given.

`conflicts` also supports checks against the parsed _values_ of arguments in
addition to the argument existence checks demonstrated above. For example:

```jsonc
{
  // ▼ Disallows y == 'one' or z if x is given
  "x": { "conflicts": [{ "y": "one" }, "z"] },
  "y": {},
  "z": { "conflicts": "y" } // ◄ Disallows y if z is given
}
```

This configuration allows the following arguments: no arguments (`∅`), `‑y=...`,
`‑x`, `‑z`, `‑x ‑y=...`; and disallows: `‑y=... ‑z`, `‑x ‑y=one`, `‑xz ‑y=one`,
`‑xz`.

---

##### `demandThisOptionIf`

> `demandThisOptionIf` is a superset of vanilla yargs's [`demandOption`][20].

> `{ P: { demandThisOptionIf: [Q, R] }}` can be read as `(Q ∨ R) ⟹ P` or
> `P ∨ (¬Q ∧ ¬R)`, with truth values denoting existence.

`demandThisOptionIf` enables checks to ensure an argument is given when at least
one of the specified groups of arguments, or argument-value pairs, is also
given. For example:

```jsonc
{
  "x": {},
  "y": { "demandThisOptionIf": "x" }, // ◄ Demands y if x is given
  "z": { "demandThisOptionIf": "x" } // ◄ Demands z if x is given
}
```

This configuration allows the following arguments: no arguments (`∅`), `‑y`,
`‑z`, `‑yz`, `‑xyz`; and disallows: `‑x`, `‑xy`, `‑xz`.

`demandThisOptionIf` also supports checks against the parsed _values_ of
arguments in addition to the argument existence checks demonstrated above. For
example:

```jsonc
{
  // ▼ Demands x if y == 'one' or z is given
  "x": { "demandThisOptionIf": [{ "y": "one" }, "z"] },
  "y": {},
  "z": {}
}
```

This configuration allows the following arguments: no arguments (`∅`), `‑x`,
`‑y=...`, `‑x ‑y=...`, `‑xz`, `‑y=... ‑z`, `-xz y=...`; and disallows: `‑z`,
`‑y=one`, `‑y=one ‑z`.

---

##### `demandThisOption`

> `demandThisOption` is an alias of vanilla yargs's [`demandOption`][20].
> `demandOption` is disallowed by intellisense.

> `{ P: { demandThisOption: true }}` can be read as `P`, with truth values
> denoting existence.

`demandThisOption` enables checks to ensure an argument is always given. This is
equivalent to `demandOption` from vanilla yargs. For example:

```jsonc
{
  "x": { "demandThisOption": true }, // ◄ Disallows ∅, y
  "y": { "demandThisOption": false }
}
```

This configuration will trigger a check to ensure that `‑x` is given.

---

##### `demandThisOptionOr`

> `demandThisOptionOr` is a superset of vanilla yargs's [`demandOption`][20].

> `{ P: { demandThisOptionOr: [Q, R] }}` can be read as `P ∨ Q ∨ R`, with truth
> values denoting existence.

`demandThisOptionOr` enables non-optional inclusive disjunction checks per
group. Put another way, `demandThisOptionOr` enforces a "logical or" relation
within groups of required options. For example:

```jsonc
{
  "x": { "demandThisOptionOr": ["y", "z"] }, // ◄ Demands x or y or z
  "y": { "demandThisOptionOr": ["x", "z"] }, // ◄ Mirrors the above (discarded)
  "z": { "demandThisOptionOr": ["x", "y"] } // ◄ Mirrors the above (discarded)
}
```

This configuration will trigger a check to ensure _at least one_ of `x`, `y`, or
`z` is given. In other words, this configuration allows the following arguments:
`‑x`, `‑y`, `‑z`, `‑xy`, `‑xz`, `‑yz`, `‑xyz`; and disallows: no arguments
(`∅`).

In the interest of readability, consider mirroring the appropriate
`demandThisOptionOr` configuration to the other relevant options, though this is
not required (redundant groups are discarded). The previous example demonstrates
proper mirroring.

`demandThisOptionOr` also supports checks against the parsed _values_ of
arguments in addition to the argument existence checks demonstrated above. For
example:

```jsonc
{
  // ▼ Demands x or y == 'one' or z
  "x": { "demandThisOptionOr": [{ "y": "one" }, "z"] },
  "y": {},
  "z": {}
}
```

This configuration allows the following arguments: `‑x`, `‑y=one`, `‑z`,
`‑x ‑y=...`, `‑xz`, `‑y=... ‑z`, `‑xz ‑y=...`; and disallows: no arguments
(`∅`), `‑y=...`.

---

##### `demandThisOptionXor`

> `demandThisOptionXor` is a superset of vanilla yargs's [`demandOption`][20] +
> [`conflicts`][19].

> `{ P: { demandThisOptionXor: [Q, R] }}` can be read as `P ⊕ Q ⊕ R`, with truth
> values denoting existence.

`demandThisOptionXor` enables non-optional exclusive disjunction checks per
exclusivity group. Put another way, `demandThisOptionXor` enforces mutual
exclusivity within groups of required options. For example:

```jsonc
{
  "x": { "demandThisOptionXor": ["y"] }, // ◄ Disallows ∅, z, w, xy, xyw, xyz, xyzw
  "y": { "demandThisOptionXor": ["x"] }, // ◄ Mirrors the above (discarded)
  "z": { "demandThisOptionXor": ["w"] }, // ◄ Disallows ∅, x, y, zw, xzw, yzw, xyzw
  "w": { "demandThisOptionXor": ["z"] } // ◄ Mirrors the above (discarded)
}
```

This configuration will trigger a check to ensure _exactly one_ of `‑x` or `‑y`
is given, and _exactly one_ of `‑z` or `‑w` is given. In other words, this
configuration allows the following arguments: `‑xz`, `‑xw`, `‑yz`, `‑yw`; and
disallows: no arguments (`∅`), `‑x`, `‑y`, `‑z`, `‑w`, `‑xy`, `‑zw`, `‑xyz`,
`‑xyw`, `‑xzw`, `‑yzw`, `‑xyzw`.

In the interest of readability, consider mirroring the appropriate
`demandThisOptionXor` configuration to the other relevant options, though this
is not required (redundant groups are discarded). The previous example
demonstrates proper mirroring.

`demandThisOptionXor` also supports checks against the parsed _values_ of
arguments in addition to the argument existence checks demonstrated above. For
example:

```jsonc
{
  // ▼ Demands x xor y == 'one' xor z
  "x": { "demandThisOptionXor": [{ "y": "one" }, "z"] },
  "y": {},
  "z": {}
}
```

This configuration allows the following arguments: `‑x`, `‑y=one`, `‑z`,
`‑x ‑y=...`, `‑y=... ‑z`; and disallows: no arguments (`∅`), `‑y=...`,
`‑x ‑y=one`, `‑xz`, `‑y=one ‑z`, `‑xz ‑y=...`.

---

##### `implies`

> BFE's `implies` is weaker form of [`requires`][6]. Choose `requires` over
> BFE's `implies` when you want one argument to imply the value of another
> _while_ requiring the other argument to be explicitly given in `argv`.

> BFE's `implies` replaces vanilla yargs's `implies` in a breaking way. The two
> implementations are nothing alike. If you're looking for vanilla yargs's
> functionality, see [`requires`][6].

`implies` will set a default value for the specified arguments conditioned on
the existence of another argument. If any of the specified arguments are
explicitly given, their values must match the specified argument-value pairs
respectively (which is the behavior of [`requires`][6]). For this reason,
`implies` only accepts one or more argument-value pairs and not raw strings. For
example:

```jsonc
{
  "x": { "implies": { "y": true } }, // ◄ x becomes synonymous with xy
  "y": {}
}
```

This configuration make it so that `‑x` and `‑x ‑y=true` result in the exact
same `argv`. Further, unlike `requires`, `implies` _makes no demands on argument
existence_ and so allows the following arguments: no arguments (`∅`), `‑x`,
`‑y=true`, `‑y=false`, `‑x ‑y=true`; and disallows: `‑x ‑y=false`.

Additionally, if any of the specified arguments have their own [`default`][16]s
configured, said defaults will be overridden by the values of `implies`. For
example:

```jsonc
{
  "x": { "implies": { "y": true } },
  "y": { "default": false } // ◄ y will still default to true if x is given
}
```

Note that `implies` configurations **do not cascade transitively**. This means
if argument `P` `implies` argument `Q`, and argument `Q` `implies` argument `R`,
and `P` is given, the only check that will be performed is on `P` and `Q`. If
`P` must imply some value for both `Q` _and `R`_, specify this explicitly in
`P`'s configuration. For example:

```diff
{
- P: { "implies": { Q: true } },
+ P: { "implies": { Q: true, R: true } },
  Q: { "implies": { R: true } },
  R: {}
}
```

This has implications beyond just `implies`. **An implied value will not
transitively trigger _any_ other BFE configurations** (such as
`demandThisOptionXor` or `subOptionOf`). The implied argument-value pair will
simply be merged into `argv` as if you had done it manually in your command's
[`handler`][21].

However, any per-option [`check`][13]s you've configured, which are run last (at
the very end of `withHandlerExtensions`), _will_ see the implied argument-value
pairs. Therefore, use [`check`][13] to guarantee any complex invariants, if
necessary; ideally, you shouldn't be setting bad defaults via `implies`, but BFE
won't stop you from doing so.

For describing much more intricate implications between various arguments and
their values, see [`subOptionOf`][22].

---

##### `check`

`check` is declarative sugar around [`yargs::check()`][23] that is applied
specifically to the option being configured.

As with its sibling configuration extensions, option-specific custom check
functions are run on Black Flag's [second parsing pass][15]; unlike its
siblings, said check functions are always run _at the very end of the second
parsing pass_, after all other configuration checks have passed and all updates
have been applied (including `argv` updates from [BFE's `implies`][12]). This
means `check` always sees the _final_ version of `argv`, which is the same
version that the command's [`handler`][21] is passed.

When a check fails, execution of its command's [`handler`][21] function will
cease and [`configureErrorHandlingEpilogue`][24] will be invoked (unless you
threw a [`GracefulEarlyExitError`][25]).

> Note that there is no concept of a "global" check in this context. If you want
> that, you'll have to call `blackFlag.check(...)` imperatively, run your checks
> in the command's [`builder`][26] function directly, or implement the
> appropriate configuration hooks (see [the bullet point on `yargs::check`][27]
> in the Black Flag docs).

For example:

```javascript
export const [builder, withHandlerExtensions] = withBuilderExtensions({
  x: {
    number: true,
    check: function (currentXArgValue, fullArgv) {
      if (currentXArgValue < 0 || currentXArgValue > 10) {
        throw new Error(
          `"x" must be between 0 and 10 (inclusive), saw: ${currentXArgValue}`
        );
      }
    }
  },
  y: {
    boolean: true,
    default: false,
    requires: 'x',
    check: function (currentYArgValue, fullArgv) {
      if (currentYArgValue && fullArgv.x <= 5) {
        throw new Error(
          `"x" must be greater than 5 to use 'y', saw: ${fullArgv.x}`
        );
      }
    }
  }
});
```

See the yargs documentation on [`yargs::check()`][23] for more information.

---

##### `subOptionOf`

One of Black Flag's killer features is [native support for dynamic options][28].
However, taking advantage of this feature in your commands' [`builder`][26]
exports requires a strictly imperative approach.

Take, for example, [the `init` command from @black-flag/demo][29]:

```javascript
// Taken at 06/04/2024 from @black-flag/demo "myctl" CLI
// @ts-check

/**
 * @type {import('@black-flag/core').Configuration['builder']}
 */
export const builder = function (yargs, _, argv) {
  yargs.parserConfiguration({ 'parse-numbers': false });

  if (argv && argv.lang) {
    // This code block implements our dynamic options (depending on --lang)
    return argv.lang === 'node'
      ? {
          lang: { choices: ['node'], demandOption: true },
          version: { choices: ['19.8', '20.9', '21.1'], default: '21.1' }
        }
      : {
          lang: { choices: ['python'], demandOption: true },
          version: {
            choices: ['3.10', '3.11', '3.12'],
            default: '3.12'
          }
        };
  } else {
    // This code block represents the fallback
    return {
      lang: { choices: ['node', 'python'], demandOption: true },
      version: { string: true, default: 'latest' }
    };
  }
};

/**
 * @type {import('@black-flag/core').Configuration<{ lang: string, version: string }>['handler']}
 */
export const handler = function ({ lang, version }) {
  console.log(`> Initializing new ${lang}@${version} project...`);
};
```

Among other freebies, taking advantage of dynamic options support gifts your CLI
with help text more gorgeous and meaningful than anything you could accomplish
with vanilla yargs:

```text
myctl init --lang 'node' --version=21.1
> initializing new node@21.1 project...
```

```text
myctl init --lang 'python' --version=21.1
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                                                     [choices: "python"]
  --version                                    [choices: "3.10", "3.11", "3.12"]

Invalid values:
  Argument: version, Given: "21.1", Choices: "3.10", "3.11", "3.12"
```

```text
myctl init --lang fake
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                                             [choices: "node", "python"]
  --version                                                             [string]

Invalid values:
  Argument: lang, Given: "fake", Choices: "node", "python"
```

```text
myctl init --help
Usage: myctl init

Options:
  --help     Show help text                                            [boolean]
  --lang                                             [choices: "node", "python"]
  --version                                                             [string]
```

Ideally, Black Flag would allow us to describe the relationship between `--lang`
and its _suboption_ `--version` declaratively, without having to drop down to
imperative interactions with the yargs API like we did above.

This is the goal of the `subOptionOf` configuration key. Using `subOptionOf`,
developers can take advantage of dynamic options without sweating the
implementation details.

> Note that `subOptionOf` updates are run and applied during Black Flag's
> [second parsing pass][15].

For example:

```javascript
/**
 * @type {import('@black-flag/core').Configuration['builder']}
 */
export const [builder, withHandlerExtensions] = withBuilderExtensions({
  x: {
    choices: ['a', 'b', 'c'],
    demandThisOption: true,
    description: 'A choice'
  },
  y: {
    number: true,
    description: 'A number'
  },
  z: {
    // ▼ These configurations are applied as the baseline or "fallback" during
    //   Black Flag's first parsing pass. The updates within subOptionOf are
    //   evaluated and applied during Black Flag's second parsing pass.
    boolean: true,
    description: 'A useful context-sensitive flag',
    subOptionOf: {
      // ▼ Ignored if x is not given
      x: [
        {
          when: (currentXArgValue, fullArgv) => currentXArgValue === 'a',
          update:
            // ▼ We can pass an updater function that returns an opt object.
            //   This object will *replace* the argument's old configuration!
            (oldXArgumentConfig, fullArgv) => {
              return {
                // ▼ We don't want to lose the old config, so we spread it
                ...oldXArgumentConfig,
                description: 'This is a switch specifically for the "a" choice'
              };
            }
        },
        {
          when: (currentXArgValue, fullArgv) => currentXArgValue !== 'a',
          update:
            // ▼ Or we can just pass the replacement configuration object. Note
            //   that, upon multiple `when` matches, the last update in the
            //   chain will win. If you want merge behavior instead of overwrite,
            //   spread the old config in the object you return.
            {
              string: true,
              description: 'This former-flag now accepts a string instead'
            }
        }
      ],
      // ▼ Ignored if y is not given. If x and y ARE given, since this occurs
      //   after the x config, this update will overwrite any others. Use the
      //   functional form + object spread to preserve the old configuration.
      y: {
        when: (currentYArgValue, fullArgv) =>
          fullArgv.x === 'a' && currentYArgValue > 5,
        update: (oldConfig, fullArgv) => {
          return {
            array: true,
            demandThisOption: true,
            description:
              'This former-flag now accepts an array of two or more strings',
            check: function (currentZArgValue, fullArgv) {
              if (currentZArgValue.length < 2) {
                throw new Error(
                  `"z" must be an array of two or more strings', only saw: ${currentZArgValue.length}`
                );
              }
            }
          };
        }
      },
      // ▼ Since "does-not-exist" is not an option defined anywhere, this will
      //   always be ignored
      'does-not-exist': []
    }
  }
});
```

> Note that you cannot nest `subOptionOf` keys within each other or return an
> object containing `subOptionOf` from an `update`. Doing so will trigger a
> framework error.

Now we're ready to re-implement the `init` command from `myctl` using our new
declarative superpowers:

```javascript
export const [builder, withHandlerExtensions] = withBuilderExtensions(
  function (blackFlag) {
    blackFlag.parserConfiguration({ 'parse-numbers': false });

    return {
      lang: {
        // ▼ These two are our fallback or "baseline" configurations for --lang
        choices: ['node', 'python'],
        demandOption: true,

        subOptionOf: {
          // ▼ Yep, --lang is also a suboption of --lang
          lang: [
            {
              when: (lang) => lang === 'node',
              // ▼ Remember: updates overwrite any old config (including baseline)
              update: {
                choices: ['node'],
                demandOption: true
              }
            },
            {
              when: (lang) => lang !== 'node',
              update: {
                choices: ['python'],
                demandOption: true
              }
            }
          ]
        }
      },

      // Another benefit of subOptionOf: all configuration relevant to a specific
      // option is co-located within that option and not spread across some
      // function or file. We don't have to go looking for the logic that's
      // modifying --version since it's all right here in one code block.
      version: {
        // ▼ These two are our fallback or "baseline" configurations for --version
        string: true,
        default: 'latest',

        subOptionOf: {
          // ▼ --version is a suboption of --lang
          lang: [
            {
              when: (lang) => lang === 'node',
              update: {
                choices: ['19.8', '20.9', '21.1'],
                default: '21.1'
              }
            },
            {
              when: (lang) => lang !== 'node',
              update: {
                choices: ['3.10', '3.11', '3.12'],
                default: '3.12'
              }
            }
          ]
        }
      }
    };
  }
);
```

Easy peasy!

#### Support for `default` with `conflicts`/`requires`/etc

BFE will ignore the existence of the [`default`][16] key when performing its
checks. This means you can use keys like `requires` and `conflicts` alongside
`default` without causing [impossible configurations][30] that throw
unresolvable CLI errors.

This workaround avoids a (in my opinion) rather unintuitive [yargs footgun][17],
though there are decent arguments in support of vanilla yargs's behavior.

#### Impossible Configurations

Note that **there are no sanity checks performed to prevent demands that are
unresolvable**, so care must be taken not to ask for something insane.

For example, the following configurations are impossible to resolve:

```jsonc
{
  "x": { "requires": "y" },
  "y": { "conflicts": "x" }
}
```

```jsonc
{
  "x": { "requires": "y", "demandThisOptionXor": "y" },
  "y": {}
}
```

#### Automatic Grouping of Related Options

> To support this functionality, options must be described declaratively.
> [Defining options imperatively][3] will break this feature.

BFE supports automatic [grouping][31] of related options for improved UX. These
new groups are:

- **"Required Options"**: options configured with
  [`demandOption`/`demandThisOption`][9].
- **"Required Options (at least one)"**: options configured with
  [`demandThisOptionOr`][10].
- **"Required Options (mutually exclusive)"**: options configured with
  [`demandThisOptionXor`][11].
- **"Common Options"**: options provided via `{ commonOptions: [...] }` to
  `withBuilderExtensions` as its second parameter:
  `withBuilderExtensions({/*...*/}, { commonOptions });`
- **"Optional Options"**: remaining options that do not fall into any of the
  above categories.

An example from [xunnctl][32]:

```text
$ x f b --help
Usage: xunnctl firewall ban

Add an IP from the global hostile IP list.

Required Options:
  --ip  An ipv4, ipv6, or supported CIDR                                                        [array]

Optional Options:
  --comment  Include custom text with the ban comment where applicable                         [string]

Common Options:
  --help         Show help text                                                               [boolean]
  --hush         Set output to be somewhat less verbose                      [boolean] [default: false]
  --quiet        Set output to be dramatically less verbose (implies --hush) [boolean] [default: false]
  --silent       No output will be generated (implies --quiet)               [boolean] [default: false]
  --config-path  Use a custom configuration file
                                [string] [default: "/home/freelance/.config/xunnctl-nodejs/state.json"]
```

```text
$ x d z u --help
Usage: xunnctl dns zone update

Reinitialize a DNS zones.

Required Options (at least one):
  --apex            Zero or more zone apex domains                                              [array]
  --apex-all-known  Include all known zone apex domains                                       [boolean]

Optional Options:
  --force        Disable protections                                                          [boolean]
  --purge-first  Delete pertinent records on the zone before recreating them                  [boolean]

Common Options:
  --help         Show help text                                                               [boolean]
  --hush         Set output to be somewhat less verbose                      [boolean] [default: false]
  --quiet        Set output to be dramatically less verbose (implies --hush) [boolean] [default: false]
  --silent       No output will be generated (implies --quiet)               [boolean] [default: false]
  --config-path  Use a custom configuration file
                                [string] [default: "/home/freelance/.config/xunnctl-nodejs/state.json"]
```

This feature can be disabled by passing `{ disableAutomaticGrouping: true }` to
`withBuilderExtensions` as its second parameter:

```typescript
const [builder, withHandlerExtensions] = withBuilderExtensions(
  {
    // ...
  },
  { disableAutomaticGrouping: true }
);
```

### `withUsageExtensions`

> ⪢ API reference: [`withUsageExtensions`][33]

This thin wrapper function is used for more consistent and opinionated usage
string generation.

```javascript
// file: xunnctl/commands/firewall/ban.js
return {
  // ...
  description: 'Add an IP from the global hostile IP list',
  usage: withUsageExtensions(
    "$1.\n\nAdditional description text that only appears in this command's help text."
  )
};
```

```text
$ x f b --help
Usage: xunnctl firewall ban

Add an IP from the global hostile IP list.

Additional description text that only appears in this command's help text.

Required Options:
  --ip  An ipv4, ipv6, or supported CIDR                                                        [array]

Optional Options:
  --comment  Include custom text with the ban comment where applicable                         [string]

Common Options:
  --help         Show help text                                                               [boolean]
  --hush         Set output to be somewhat less verbose                      [boolean] [default: false]
  --quiet        Set output to be dramatically less verbose (implies --hush) [boolean] [default: false]
  --silent       No output will be generated (implies --quiet)               [boolean] [default: false]
  --config-path  Use a custom configuration file
                                [string] [default: "/home/freelance/.config/xunnctl-nodejs/state.json"]
```

## Example

In this section are two example implementations of a "deploy" command.

### Example 1

Suppose we wanted a "deploy" command with the following somewhat contrived
feature set:

- Ability to deploy to a Vercel production target, a Vercel preview target, or
  to a remote target via SSH.

- When deploying to Vercel, allow the user to choose to deploy _only_ to preview
  (`--only-preview`) or _only_ to production (`--only-production`), if desired.

  - Deploy to the preview target only by default.

  - If both `--only-preview=false` and `--only-production=false`, deploy to
    _both_ the preview and production environments.

  - If both `--only-preview=true` and `--only-production=true`, throw an error.

- When deploying to a remote target via SSH, require both a `--host` and
  `--to-path` be provided.

  - If `--host` or `--to-path` are provided, they must be accompanied by
    `--target=ssh` since these options don't make sense if `--target` is
    something else.

What follows is an example implementation:

```typescript
import { type ChildConfiguration } from '@black-flag/core';
import {
  withBuilderExtensions,
  withUsageExtensions
} from '@black-flag/extensions';

import { type CustomExecutionContext } from '../configure.ts';

export enum DeployTarget {
  Vercel = 'vercel',
  Ssh = 'ssh'
}

export const deployTargets = Object.values(DeployTarget);

// ▼ Let's keep our custom CLI arguments strongly 💪🏿 typed
export type CustomCliArguments = {
  target: DeployTarget;
} & ( // We could make these subtypes even stronger, but the returns are diminishing
  | {
      target: DeployTarget.Vercel;
      production: boolean;
      preview: boolean;
    }
  | {
      target: DeployTarget.Ssh;
      host: string;
      toPath: string;
    }
);

export default function command({ state }: CustomExecutionContext) {
  const [builder, withHandlerExtensions] =
    withBuilderExtensions<CustomCliArguments>({
      target: {
        demandThisOption: true, // ◄ Just an alias for { demandOption: true }
        choices: deployTargets,
        description: 'Select deployment target and strategy'
      },
      'only-production': {
        alias: ['production', 'prod'],
        boolean: true,
        // ▼ Error if --only-preview or --only-preview=true
        conflicts: { 'only-preview': true },
        requires: { target: DeployTarget.Vercel }, // ◄ Error if --target != vercel
        default: false, // ◄ Works in a sane way alongside conflicts/requires
        description: 'Only deploy to the remote production environment'
      },
      'only-preview': {
        alias: ['preview'],
        boolean: true,
        conflicts: { 'only-production': true },
        requires: { target: DeployTarget.Vercel },
        default: true,
        description: 'Only deploy to the remote preview environment'
      },
      host: {
        string: true,
        // ▼ Inverse of { conflicts: { target: DeployTarget.Vercel }} in this example
        requires: { target: DeployTarget.Ssh }, // ◄ Error if --target != ssh
        // ▼ Demand --host if --target=ssh
        demandThisOptionIf: { target: DeployTarget.Ssh },
        description: 'The host to use'
      },
      'to-path': {
        string: true,
        requires: { target: DeployTarget.Ssh },
        // ▼ Demand --to-path if --target=ssh
        demandThisOptionIf: { target: DeployTarget.Ssh },
        description: 'The deploy destination path to use'
      }
    });

  return {
    builder,
    description: 'Deploy distributes to the appropriate remote',
    usage: withUsageExtensions('$1.\n\nSupports both Vercel and SSH targets!'),
    handler: withHandlerExtensions<CustomCliArguments>(async function ({
      target,
      production: productionOnly,
      preview: previewOnly,
      host,
      toPath
    }) {
      // if(state[...]) ...

      switch (target) {
        case DeployTarget.Vercel: {
          // if(productionOnly) ...
          break;
        }

        case DeployTarget.Ssh: {
          // ...
          break;
        }
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, CustomExecutionContext>;
}
```

### Example 2

Suppose we wanted a "deploy" command with the following [more realistic][34]
feature set:

- Ability to deploy to a Vercel production target, a Vercel preview target, or
  to a remote target via SSH.

- When deploying to Vercel, allow the user to choose to deploy to preview
  (`--preview`), or to production (`--production`), or both.

  - Deploy to the preview target only by default.

  - If both `--preview=false` and `--production=false`, deploy to both the
    preview and production environments.

  - If both `--preview=true` and `--production=true`, deploy to both the preview
    and production environments.

- When deploying to a remote target via SSH, require a `--host` and `--to-path`
  be provided.

  - If `--host` or `--to-path` are provided, they must be accompanied by
    `--target=ssh` since these options don't make sense if `--target` is
    something else.

- Output more useful and extremely specific help text depending on the
  combination of arguments received.

What follows is an example implementation:

```typescript
import { type ChildConfiguration } from '@black-flag/core';
import {
  withBuilderExtensions,
  withUsageExtensions
} from '@black-flag/extensions';

import { type CustomExecutionContext } from '../configure.ts';

export enum DeployTarget {
  Vercel = 'vercel',
  Ssh = 'ssh'
}

export const deployTargets = Object.values(DeployTarget);

export type CustomCliArguments = { target: DeployTarget } & (
  | {
      target: DeployTarget.Vercel;
      production: boolean;
      preview: boolean;
    }
  | {
      target: DeployTarget.Ssh;
      host: string;
      toPath: string;
    }
);

export default function command({ state }: CustomExecutionContext) {
  const [builder, withHandlerExtensions] = withBuilderExtensions<
    CustomCliArguments,
    GlobalExecutionContext
  >({
    target: {
      description: 'Select deployment target and strategy',
      demandThisOption: true,
      choices: deployTargets,
      subOptionOf: {
        target: {
          // Since subOptionOf runs on 2nd parse, target MUST be a DeployTarget
          // by the time subOptionOf is considered. Yay!
          when: () => true,
          update(oldOptionConfig, argv) {
            return {
              ...oldOptionConfig,
              choices: [argv.target]
            };
          }
        }
      }
    },
    production: {
      alias: ['prod'],
      boolean: true,
      description: 'Deploy to the remote production environment',
      requires: { target: DeployTarget.Vercel },
      subOptionOf: {
        target: {
          // Since subOptionOf runs on 2nd parse, target MUST be defined (as
          // a DeployTarget) by the time subOptionOf is considered. If it
          // weren't, we'd have to ensure target was not undefined, too. Boo!
          when: (target: DeployTarget) => target !== DeployTarget.Vercel,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              hidden: true
            };
          }
        }
      }
    },
    preview: {
      boolean: true,
      description: 'Deploy to the remote preview environment',
      default: true,
      requires: { target: DeployTarget.Vercel },
      subOptionOf: {
        target: {
          when: (target: DeployTarget) => target !== DeployTarget.Vercel,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              hidden: true
            };
          }
        }
      }
    },
    host: {
      string: true,
      description: 'The ssh deploy host',
      requires: { target: DeployTarget.Ssh },
      demandThisOptionIf: { target: DeployTarget.Ssh },
      subOptionOf: {
        target: {
          when: (target: DeployTarget) => target !== DeployTarget.Ssh,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              hidden: true
            };
          }
        }
      }
    },
    'to-path': {
      string: true,
      description: 'The ssh deploy destination path',
      requires: { target: DeployTarget.Ssh },
      demandThisOptionIf: { target: DeployTarget.Ssh },
      subOptionOf: {
        target: {
          when: (target: DeployTarget) => target !== DeployTarget.Ssh,
          update(oldOptionConfig) {
            return {
              ...oldOptionConfig,
              hidden: true
            };
          }
        }
      }
    }
  });

  return {
    builder,
    description: 'Deploy distributes to the appropriate remote',
    usage: withUsageExtensions('$1.\n\nSupports both Vercel and SSH targets!'),
    handler: withHandlerExtensions<CustomCliArguments>(async function ({
      target,
      production,
      preview,
      host,
      toPath
    }) {
      // if(state[...]) ...

      switch (target) {
        case DeployTarget.Vercel: {
          // if(production) ...
          break;
        }

        case DeployTarget.Ssh: {
          // ...
          break;
        }
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, CustomExecutionContext>;
}
```

## Appendix

Further documentation can be found under [`docs/`][x-repo-docs].

### Differences between Black Flag Extensions and Yargs

When using BFE, command options must be configured by [returning an `opt`
object][5] from your command's [`builder`][26] rather than imperatively invoking
the yargs API.

For example:

```diff
export function builder(blackFlag) {
- // DO NOT use yargs's imperative API to define options! This *BREAKS* BFE!
- blackFlag.option('f', {
-   alias: 'file',
-   demandOption: true,
-   default: '/etc/passwd',
-   describe: 'x marks the spot',
-   type: 'string'
- });
-
- // DO NOT use yargs's imperative API to define options! This *BREAKS* BFE!
- blackFlag
-   .alias('f', 'file')
-   .demandOption('f')
-   .default('f', '/etc/passwd')
-   .describe('f', 'x marks the spot')
-   .string('f');
-
- // DO NOT use yargs's imperative API to define options! This *BREAKS* BFE!
- blackFlag.options({
-   f: {
-     alias: 'file',
-     demandOption: true,
-     default: '/etc/passwd',
-     describe: 'x marks the spot',
-     type: 'string'
-   }
- });
-
+ // INSTEAD, use yargs / Black Flag's declarative API to define options 🙂
+ return {
+   f: {
+     alias: 'file',
+     demandOption: true,
+     default: '/etc/passwd',
+     describe: 'x marks the spot',
+     type: 'string'
+   }
+ };
}
```

> The yargs API can and should still be invoked for purposes other than defining
> options on a command, e.g. `blackFlag.strict(false)`.

To this end, the following [yargs API functions][35] are soft-disabled via
intellisense:

- `option`
- `options`

However, no attempt is made by BFE to restrict your use of the yargs API at
runtime. Therefore, using yargs's API to work around these artificial
limitations, e.g. in your command's [`builder`][26] function or via the
[`configureExecutionPrologue`][36] hook, will result in **undefined behavior**.

### Black Flag versus Black Flag Extensions

The goal of [Black Flag (@black-flag/core)][37] is to be as close to a drop-in
replacement as possible for vanilla yargs, specifically for users of
[`yargs::commandDir()`][38]. This means Black Flag must go out of its way to
maintain 1:1 parity with the vanilla yargs API ([with a few minor
exceptions][39]).

As a consequence, yargs's imperative nature tends to leak through Black Flag's
abstraction at certain points, such as with [the `blackFlag` parameter of the
`builder` export][26]. **This is a good thing!** Since we want access to all of
yargs's killer features without Black Flag getting in the way.

However, this comes with costs. For one, the yargs's API has suffered from a bit
of feature creep over the years. A result of this is a rigid API [with][40]
[an][17] [abundance][41] [of][42] [footguns][43] and an [inability][44] to
[address][45] them without introducing [massively][46] [breaking][47]
[changes][48].

BFE takes the "YOLO" approach by exporting several functions that build on top
of Black Flag's feature set without worrying too much about maintaining 1:1
parity with the vanilla yargs's API. This way, one can opt-in to a more
opinionated but (in my opinion) cleaner, more consistent, and more intuitive
developer experience.

### Published Package Details

This is a [CJS2 package][x-pkg-cjs-mojito] with statically-analyzable exports
built by Babel for Node.js versions that are not end-of-life. For TypeScript
users, this package supports both `"Node10"` and `"Node16"` module resolution
strategies.

<details><summary>Expand details</summary>

That means both CJS2 (via `require(...)`) and ESM (via `import { ... } from ...`
or `await import(...)`) source will load this package from the same entry points
when using Node. This has several benefits, the foremost being: less code
shipped/smaller package size, avoiding [dual package
hazard][x-pkg-dual-package-hazard] entirely, distributables are not
packed/bundled/uglified, a drastically less complex build process, and CJS
consumers aren't shafted.

Each entry point (i.e. `ENTRY`) in [`package.json`'s
`exports[ENTRY]`][x-repo-package-json] object includes one or more [export
conditions][x-pkg-exports-conditions]. These entries may or may not include: an
[`exports[ENTRY].types`][x-pkg-exports-types-key] condition pointing to a type
declarations file for TypeScript and IDEs, an
[`exports[ENTRY].module`][x-pkg-exports-module-key] condition pointing to
(usually ESM) source for Webpack/Rollup, an `exports[ENTRY].node` condition
pointing to (usually CJS2) source for Node.js `require` _and `import`_, an
`exports[ENTRY].default` condition pointing to source for browsers and other
environments, and [other conditions][x-pkg-exports-conditions] not enumerated
here. Check the [package.json][x-repo-package-json] file to see which export
conditions are supported.

Though [`package.json`][x-repo-package-json] includes
[`{ "type": "commonjs" }`][x-pkg-type], note that any ESM-only entry points will
be ES module (`.mjs`) files. Finally, [`package.json`][x-repo-package-json] also
includes the [`sideEffects`][x-pkg-side-effects-key] key, which is `false` for
optimal [tree shaking][x-pkg-tree-shaking] where appropriate.

</details>

### License

See [LICENSE][x-repo-license].

## Contributing and Support

**[New issues][x-repo-choose-new-issue] and [pull requests][x-repo-pr-compare]
are always welcome and greatly appreciated! 🤩** Just as well, you can [star 🌟
this project][x-badge-repo-link] to let me know you found it useful! ✊🏿 Or you
could [buy me a beer][x-repo-sponsor] 🥺Thank you!

See [CONTRIBUTING.md][x-repo-contributing] and [SUPPORT.md][x-repo-support] for
more information.

### Contributors

<!-- remark-ignore-start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- remark-ignore-end -->

Thanks goes to these wonderful people ([emoji
key][x-repo-all-contributors-emojis]):

<!-- remark-ignore-start -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://xunn.io/"><img src="https://avatars.githubusercontent.com/u/656017?v=4?s=100" width="100px;" alt="Bernard"/><br /><sub><b>Bernard</b></sub></a><br /><a href="#infra-Xunnamius" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/Xunnamius/black-flag-extensions/commits?author=Xunnamius" title="Code">💻</a> <a href="https://github.com/Xunnamius/black-flag-extensions/commits?author=Xunnamius" title="Documentation">📖</a> <a href="#maintenance-Xunnamius" title="Maintenance">🚧</a> <a href="https://github.com/Xunnamius/black-flag-extensions/commits?author=Xunnamius" title="Tests">⚠️</a> <a href="https://github.com/Xunnamius/black-flag-extensions/pulls?q=is%3Apr+reviewed-by%3AXunnamius" title="Reviewed Pull Requests">👀</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- remark-ignore-end -->

This project follows the [all-contributors][x-repo-all-contributors]
specification. Contributions of any kind welcome!

[x-badge-blm-image]: https://xunn.at/badge-blm 'Join the movement!'
[x-badge-blm-link]: https://xunn.at/donate-blm
[x-badge-codecov-image]:
  https://img.shields.io/codecov/c/github/Xunnamius/black-flag-extensions/main?style=flat-square&token=HWRIOBAAPW
  'Is this package well-tested?'
[x-badge-codecov-link]: https://codecov.io/gh/Xunnamius/black-flag-extensions
[x-badge-downloads-image]:
  https://img.shields.io/npm/dm/@black-flag/extensions?style=flat-square
  'Number of times this package has been downloaded per month'
[x-badge-lastcommit-image]:
  https://img.shields.io/github/last-commit/xunnamius/black-flag-extensions?style=flat-square
  'Latest commit timestamp'
[x-badge-license-image]:
  https://img.shields.io/npm/l/@black-flag/extensions?style=flat-square
  "This package's source license"
[x-badge-license-link]:
  https://github.com/Xunnamius/black-flag-extensions/blob/main/LICENSE
[x-badge-npm-image]:
  https://xunn.at/npm-pkg-version/@black-flag/extensions
  'Install this package using npm or yarn!'
[x-badge-npm-link]: https://npmtrends.com/@black-flag/extensions
[x-badge-repo-link]: https://github.com/xunnamius/black-flag-extensions
[x-badge-semanticrelease-image]:
  https://xunn.at/badge-semantic-release
  'This repo practices continuous integration and deployment!'
[x-badge-semanticrelease-link]:
  https://github.com/semantic-release/semantic-release
[x-pkg-cjs-mojito]:
  https://dev.to/jakobjingleheimer/configuring-commonjs-es-modules-for-nodejs-12ed#publish-only-a-cjs-distribution-with-property-exports
[x-pkg-dual-package-hazard]:
  https://nodejs.org/api/packages.html#dual-package-hazard
[x-pkg-exports-conditions]:
  https://webpack.js.org/guides/package-exports#reference-syntax
[x-pkg-exports-module-key]:
  https://webpack.js.org/guides/package-exports#providing-commonjs-and-esm-version-stateless
[x-pkg-exports-types-key]:
  https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta#packagejson-exports-imports-and-self-referencing
[x-pkg-side-effects-key]:
  https://webpack.js.org/guides/tree-shaking#mark-the-file-as-side-effect-free
[x-pkg-tree-shaking]: https://webpack.js.org/guides/tree-shaking
[x-pkg-type]:
  https://github.com/nodejs/node/blob/8d8e06a345043bec787e904edc9a2f5c5e9c275f/doc/api/packages.md#type
[x-repo-all-contributors]: https://github.com/all-contributors/all-contributors
[x-repo-all-contributors-emojis]: https://allcontributors.org/docs/en/emoji-key
[x-repo-choose-new-issue]:
  https://github.com/xunnamius/black-flag-extensions/issues/new/choose
[x-repo-contributing]: /CONTRIBUTING.md
[x-repo-docs]: docs
[x-repo-license]: ./LICENSE
[x-repo-package-json]: package.json
[x-repo-pr-compare]: https://github.com/xunnamius/black-flag-extensions/compare
[x-repo-sponsor]: https://github.com/sponsors/Xunnamius
[x-repo-support]: /.github/SUPPORT.md
[1]: https://github.com/yargs/yargs/issues
[2]: #black-flag-versus-black-flag-extensions
[3]: #differences-between-black-flag-extensions-and-yargs
[4]: ./docs/functions/withBuilderExtensions.md
[5]: https://yargs.js.org/docs#api-reference-optionskey-opt
[6]: #requires
[7]: #conflicts
[8]: #demandthisoptionif
[9]: #demandthisoption
[10]: #demandthisoptionor
[11]: #demandthisoptionxor
[12]: #implies
[13]: #check
[14]: #subOptionOf
[15]:
  https://github.com/Xunnamius/black-flag/tree/main?tab=readme-ov-file#motivation
[16]: https://yargs.js.org/docs#api-reference-defaultkey-value-description
[17]: https://github.com/yargs/yargs/issues/1442
[18]: https://yargs.js.org/docs#implies
[19]: https://yargs.js.org/docs#conflicts
[20]: https://yargs.js.org/docs#demandOption
[21]:
  https://github.com/Xunnamius/black-flag/blob/main/docs/index/type-aliases/Configuration.md#handler
[22]: #suboptionof
[23]: https://yargs.js.org/docs#api-reference-checkfn-globaltrue
[24]:
  https://github.com/Xunnamius/black-flag/blob/main/docs/index/type-aliases/ConfigureErrorHandlingEpilogue.md
[25]:
  https://github.com/Xunnamius/black-flag/blob/main/docs/index/classes/GracefulEarlyExitError.md
[26]:
  https://github.com/Xunnamius/black-flag/blob/main/docs/index/type-aliases/Configuration.md#builder
[27]:
  https://github.com/Xunnamius/black-flag/tree/main?tab=readme-ov-file#irrelevant-differences
[28]:
  https://github.com/Xunnamius/black-flag/tree/main?tab=readme-ov-file#built-in-support-for-dynamic-options-
[29]: https://github.com/Xunnamius/black-flag-demo/blob/main/commands/init.js
[30]: #impossible-configurations
[31]: https://yargs.js.org/docs#api-reference-groupkeys-groupname
[32]: https://
[33]: ./docs/functions/withUsageExtensions.md
[34]: https://github.com/Xunnamius/xscripts/blob/main/src/commands/deploy.ts
[35]: https://yargs.js.org/docs#api-reference
[36]:
  https://github.com/Xunnamius/black-flag/blob/main/docs/index/type-aliases/ConfigureExecutionPrologue.md
[37]: https://npm.im/@black-flag/core
[38]: https://yargs.js.org/docs#api-reference-commanddirdirectory-opts
[39]:
  https://github.com/Xunnamius/black-flag?tab=readme-ov-file#differences-between-black-flag-and-yargs
[40]: https://github.com/yargs/yargs/issues/1323
[41]: https://github.com/yargs/yargs/issues/2340
[42]: https://github.com/yargs/yargs/issues/1322
[43]: https://github.com/yargs/yargs/issues/2089
[44]: https://github.com/yargs/yargs/issues/1975
[45]: https://github.com/yargs/yargs-parser/issues/412
[46]: https://github.com/yargs/yargs/issues/1680
[47]: https://github.com/yargs/yargs/issues/1599
[48]: https://github.com/yargs/yargs/issues/1611
