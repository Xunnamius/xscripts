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
  - [`getInvocableExtendedHandler`](#getinvocableextendedhandler)
- [Examples](#examples)
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

Note in the below example how the option names passed to configuration keys,
e.g. `{ demandThisOptionXor: ['my-argument'] }`, are represented by their exact
names as defined (e.g. `'my‑argument'`) and not their aliases (`'arg1'`) or
camelCase forms (`'myArgument'`):

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

Also note how `withBuilderExtensions` returns a two-element array of the form:
`[builder, withHandlerExtensions]`. `builder` should be exported as your
command's [`builder`][5] function **without being invoked**. If you want to
implement additional imperative logic, pass a `customBuilder` _function_ to
`withBuilderExtensions` as demonstrated above; otherwise, you should pass a
options configuration _object_.

On the other hand, `withHandlerExtensions` **should be invoked immediately**,
and its return value should be exported as your command's `handler` function, as
demonstrated above. You should pass a `customHandler` to `withHandlerExtensions`
upon invocation, though this is not required. If you call
`withHandlerExtensions()` without providing a `customHandler`, a placeholder
function that throws `CommandNotImplementedError` will be used instead,
indicating that the command has not yet been implemented. This mirrors [Black
Flag's default behavior for unimplemented command handlers][6].

#### New Option Configuration Keys

This section details the new configuration keys made available by BFE, each
implementing an options-related unit of functionality beyond that offered by
vanilla yargs and Black Flag.

Note that the checks enabled by these configuration keys:

- Are run on Black Flag's [second parsing pass][7] except where noted. This
  allows BFE to perform checks against argument _values_ in addition to the
  argument existence checks enabled by vanilla yargs.

- Will ignore the existence of the [`default`][8] key ([unless it's a custom
  check][9]). This means you can use keys like [`requires`][10] and
  [`conflicts`][11] alongside [`default`][8] without causing unresolvable CLI
  errors. This avoids a rather unintuitive [yargs footgun][12].

**Logical Keys**

> In the below definitions, `P`, `Q`, and `R` are arguments (or argument-value
> pairs) configured via a hypothetical call to
> [`blackFlag.options({ P: { [key]: [Q, R] }})`][13]. The truth values of `P`,
> `Q`, and `R` represent the existence of each respective argument (and its
> value) in the `argv` parse result. `gwav` is a predicate standing for "given
> with any value," meaning the argument was given on the command line.

| Key                         | Definition                                    |
| :-------------------------- | :-------------------------------------------- |
| [`requires`][10]            | `P ⟹ (Q ∧ R)` or `¬P ∨ (Q ∧ R)`               |
| [`conflicts`][11]           | `P ⟹ (¬Q ∧ ¬R)` or `¬P ∨ (¬Q ∧ ¬R)`           |
| [`implies`][14]             | `P ⟹ (Q ∧ R ∧ (gwav(Q) ⟹ Q) ∧ (gwav(R) ⟹ R))` |
| [`demandThisOptionIf`][15]  | `(Q ∨ R) ⟹ P` or `P ∨ (¬Q ∧ ¬R)`              |
| [`demandThisOption`][16]    | `P`                                           |
| [`demandThisOptionOr`][17]  | `P ∨ Q ∨ R`                                   |
| [`demandThisOptionXor`][18] | `P ⊕ Q ⊕ R`                                   |

**Relational Keys**

| Key                       |
| :------------------------ |
| [`check`][9]              |
| [`subOptionOf`][19]       |
| [`looseImplications`][20] |

---

##### `requires`

> `requires` is a superset of and replacement for vanilla yargs's
> [`implies`][21]. BFE also has [its own implication implementation][14]. Choose
> [BFE's `implies`][14] over `requires` when you want one argument to imply the
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

> `conflicts` is a superset of vanilla yargs's [`conflicts`][22].

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

##### `implies`

> BFE's `implies`, since it sets arguments in `argv` if they are not already
> set, is a weaker form of [`requires`][10]. Choose `requires` over BFE's
> `implies` when you want one argument to imply the value of another _while_
> requiring the other argument to be explicitly given in `argv`.

> BFE's `implies` replaces vanilla yargs's `implies` in a breaking way. The two
> implementations are nothing alike. If you're looking for vanilla yargs's
> functionality, see [`requires`][10].

`implies` will set a default value for the specified arguments conditioned on
the existence of another argument. Unless [`looseImplications`][20] is set to
`true`, if any of the specified arguments are explicitly given, their values
must match the specified argument-value pairs respectively (similar to
[`requires`][10]/[`conflicts`][11]). For this reason, `implies` only accepts one
or more argument-value pairs and not raw strings. For example:

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

Additionally, if any of the specified arguments have their own [`default`][8]s
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
transitively satisfy any other BFE logic checks** (such as
[`demandThisOptionXor`][18]) **or trigger any relational behavior** (such as
with [`subOptionOf`][19]). The implied argument-value pair will simply be merged
into `argv` as if you had done it manually in your command's [`handler`][23].
Instead of relying on implicit transitive relationships via `implies`, prefer
the explicit direct relationships described by other [configuration keys][24].

However, any per-option [`check`][9]s you've configured, which are run last (at
the very end of `withHandlerExtensions`), _will_ see the implied argument-value
pairs. Therefore, use [`check`][9] to guarantee any complex invariants, if
necessary; ideally, you shouldn't be setting bad defaults via `implies`, but BFE
won't stop you from doing so.

For describing much more intricate implications between various arguments and
their values, see [`subOptionOf`][19].

###### `looseImplications`

If [`looseImplications`][20] is set to `true`, any of the specified arguments,
when explicitly given on the command line, will _override_ any configured
implications instead of causing an error. When [`looseImplications`][20] is set
to `false`, which is the default, values given on the command line must match
the specified argument-value pairs respectively (similar to [`requires`][10]).

---

##### `demandThisOptionIf`

> `demandThisOptionIf` is a superset of vanilla yargs's [`demandOption`][25].

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
`‑y=...`, `‑x ‑y=...`, `‑xz`, `-xz y=...`; and disallows: `‑z`, `‑y=one`,
`‑y=... ‑z`.

Note that a more powerful implementation of `demandThisOptionIf` can be achieved
via [`subOptionOf`][19].

---

##### `demandThisOption`

> `demandThisOption` is an alias of vanilla yargs's [`demandOption`][25].
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

> Note that, as an alias of vanilla yargs's [`demandOption`][25], this check is
> outsourced to yargs, which means it runs on Black Flag's _first and second
> parsing passes_ like any other configurations key coming from vanilla yargs.

---

##### `demandThisOptionOr`

> `demandThisOptionOr` is a superset of vanilla yargs's [`demandOption`][25].

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

> `demandThisOptionXor` is a superset of vanilla yargs's [`demandOption`][25] +
> [`conflicts`][22].

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

##### `check`

`check` is the declarative option-specific version of vanilla yargs's
[`yargs::check()`][26].

This function receives the `currentArgumentValue`, which you are free to type as
you please, and the fully parsed `argv`. If this function throws, the exception
will bubble. If this function returns an instance of `Error`, a string, or any
non-truthy value (including `undefined` or not returning anything), Black Flag
will throw a `CliError` on your behalf.

All `check` functions are run in definition order and always at the very end of
the [second parsing pass][7], well after all other BFE checks have passed and
all updates to `argv` have been applied (including from [`subOptionOf`][19] and
[BFE's `implies`][14]). This means `check` always sees the _final_ version of
`argv`, which is the same version that the command's [`handler`][23] is passed.

> Note that `check` functions are skipped if their corresponding argument does
> not exist in `argv`.

When a check fails, execution of its command's [`handler`][23] function will
cease and [`configureErrorHandlingEpilogue`][27] will be invoked (unless you
threw/returned a [`GracefulEarlyExitError`][28]).

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

      return true;
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

      return true;
    }
  }
});
```

See the yargs documentation on [`yargs::check()`][26] for more information.

---

##### `subOptionOf`

One of Black Flag's killer features is [native support for dynamic options][29].
However, taking advantage of this feature in a command's [`builder`][5] export
requires a strictly imperative approach.

Take, for example, [the `init` command from @black-flag/demo][30]:

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
      lang: {
        choices: ['node', 'python'],
        demandOption: true,
        default: 'python'
      },
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

Ideally, Black Flag would allow us to describe the relationship between `‑‑lang`
and its _suboption_ `‑‑version` declaratively, without having to drop down to
imperative interactions with the yargs API like we did above.

This is the goal of the `subOptionOf` configuration key. Using `subOptionOf`,
developers can take advantage of dynamic options without sweating the
implementation details.

> Note that `subOptionOf` updates are run and applied during Black Flag's
> [second parsing pass][7].

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
              return (
                currentZArgValue.length >= 2 ||
                `"z" must be an array of two or more strings, only saw: ${currentZArgValue.length ?? 0}`
              );
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
        demandThisOption: true,
        default: 'python',

        subOptionOf: {
          // ▼ Yep, --lang is also a suboption of --lang
          lang: [
            {
              when: (lang) => lang === 'node',
              // ▼ Remember: updates overwrite any old config (including baseline)
              update: {
                choices: ['node'],
                demandThisOption: true
              }
            },
            {
              when: (lang) => lang !== 'node',
              update: {
                choices: ['python'],
                demandThisOption: true
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

BFE (and, consequently, BF/yargs when not generating help text) will ignore the
existence of the [`default`][8] key until near the end of BFE's execution.

> This means the optional `customBuilder` function passed to
> `withBuilderExtensions` will _not_ see any defaulted values. However, your
> command handlers will.

> Note that an explicitly `undefined` default, i.e. `{ default: undefined }`,
> will be deleted from the configuration object and completely ignored by BFE,
> Black Flag, and yargs. This differs from yargs's default behavior, which is to
> recognize `undefined` defaults.

Defaults are set _before_ any [`check`][9] functions are run, _before_ any
[implications][14] are set, and _before_ the relevant command [`handler`][23] is
invoked, but _after_ all other BFE checks have succeeded. This enables the use
of keys like [`requires`][10] and [`conflicts`][11] alongside [`default`][8]
without causing [impossible configurations][31] that throw unresolvable CLI
errors.

This workaround avoids a (in my opinion) rather unintuitive [yargs footgun][12],
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

BFE supports automatic [grouping][32] of related options for improved UX. These
new groups are:

- **"Required Options"**: options configured with [`demandThisOption`][16].
- **"Required Options (at least one)"**: options configured with
  [`demandThisOptionOr`][17].
- **"Required Options (mutually exclusive)"**: options configured with
  [`demandThisOptionXor`][18].
- **"Common Options"**: options provided via `{ commonOptions: [...] }` to
  `withBuilderExtensions` as its second parameter:
  `withBuilderExtensions({/*...*/}, { commonOptions });`
- **"Optional Options"**: remaining options that do not fall into any of the
  above categories.

An example from [xunnctl][33]:

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

> ⪢ API reference: [`withUsageExtensions`][34]

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

### `getInvocableExtendedHandler`

> ⪢ API reference:
> [`getInvocableExtendedHandler`](./docs/functions/getInvocableExtendedHandler.md)

Unlike Black Flag, BFE puts strict constraints on the order in which command
exports must be invoked and evaluated. Specifically: an extended command's
`builder` export must be invoked twice, with the correct parameters each time,
before that extended command's `handler` can be invoked.

This can make it especially cumbersome to import an extended command from a file
and then invoke its `handler`, which is dead simple for normal Black Flag
commands.

For example, take the following extended command:

```typescript
// file: my-cli/commands/command-A.ts
import { type CustomExecutionContext } from '../configure';

export type CustomCliArguments = {
  /* ... */
};

export default function command({ state }: CustomExecutionContext) {
  const [builder, withHandlerExtensions] =
    withBuilderExtensions<CustomCliArguments>({
      // ...
    });

  return {
    builder,
    handler: withHandlerExtensions<CustomCliArguments>(
      async function (/* ... */) {
        // ...
      }
    )
  };
}
```

Were `command-A` a normal non-extended Black Flag command, we could simply
import it into another command (`command-B`) and run it like so:

```typescript
// file: my-cli/commands/command-B.ts
import { type CustomExecutionContext } from '../configure';

export type CustomCliArguments = {
  /* ... */
};

export default function command(context: CustomExecutionContext) {
  const [builder, withHandlerExtensions] =
    withBuilderExtensions<CustomCliArguments>({
      // ...
    });

  return {
    builder,
    handler: withHandlerExtensions<CustomCliArguments>(async function (argv) {
      const { handler } = (await import('./command-A.js')).default(context);
      await handler({ ...argv, somethingElse: true });

      // ...
    })
  };
}
```

Instead, since `command-A` was created using Black Flag Extensions, we must go
through the following rigamarole:

```typescript
// file: my-cli/commands/command-B.ts
import { type CustomExecutionContext } from '../configure';

export type CustomCliArguments = {
  /* ... */
};

export default function command(context: CustomExecutionContext) {
  const [builder, withHandlerExtensions] =
    withBuilderExtensions<CustomCliArguments>({
      // ...
    });

  return {
    builder,
    handler: withHandlerExtensions<CustomCliArguments>(async function (argv) {
      const blackFlag = {
        /* some kind of black hole mock or proxy */
      };

      const commandAArgv = {
        ...argv,
        somethingElse: true
      };

      const { builder, handler } = (await import('./command-A.js')).default(
        context
      );

      builder(blackFlag, false, undefined);
      builder(blackFlag, false, commandAArgv);

      await handler(commandAArgv);

      // ...
    })
  };
}
```

Having to go through all that just to invoke one command within another quickly
becomes verbose and tiresome. To say nothing of the fact that `command-A` might
be changed down the road to export a configuration object or something other
than a default function.

Now we've got transitive tight-couplings between commands, which makes bugs more
likely and harder to spot.

Hence the purpose of `getInvocableExtendedHandler`. This function returns a
version of the extended command's `handler` function that is ready to invoke
immediately. It can be used with both BFE and normal Black Flag command exports.

For example, in JavaScript:

```javascript
// file: my-cli/commands/command-B.js
export default function command(context) {
  const [builder, withHandlerExtensions] = withBuilderExtensions({
    // ...
  });

  return {
    builder,
    handler: withHandlerExtensions(async function (argv) {
      const handler = await getInvocableExtendedHandler(
        // This accepts a function, an object, a default export, a Promise, etc
        import('./command-A.js'),
        context
      );

      await handler({ ...argv, somethingElse: true });

      // ...
    })
  };
}
```

Or in TypeScript:

```typescript
// file: my-cli/commands/command-B.ts
import { type CustomExecutionContext } from '../configure';

import {
  default as commandA,
  type CustomCliArguments as CommandACliArguments
} from './command-A';

export type CustomCliArguments = {
  /* ... */
};

export default function command(context: CustomExecutionContext) {
  const [builder, withHandlerExtensions] =
    withBuilderExtensions<CustomCliArguments>({
      // ...
    });

  return {
    builder,
    handler: withHandlerExtensions<CustomCliArguments>(async function (argv) {
      const handler = await getInvocableExtendedHandler<
        CommandACliArguments,
        typeof context
      >(commandA, context);

      await handler({ ...argv, somethingElse: true });

      // ...
    })
  };
}
```

## Examples

In this section are two example implementations of a "deploy" command.

### Example 1

Suppose we wanted a "deploy" command with the following somewhat contrived
feature set:

- Ability to deploy to a Vercel production target, a Vercel preview target, or
  to a remote target via SSH.

- When deploying to Vercel, allow the user to choose to deploy _only_ to preview
  (`‑‑only-preview`) or _only_ to production (`‑‑only-production`), if desired.

  - Deploy to the preview target only by default.

  - If both `‑‑only-preview=false` and `‑‑only-production=false`, deploy to
    _both_ the preview and production environments.

  - If both `‑‑only-preview=true` and `‑‑only-production=true`, throw an error.

- When deploying to a remote target via SSH, require both a `‑‑host` and
  `‑‑to-path` be provided.

  - If `‑‑host` or `‑‑to-path` are provided, they must be accompanied by
    `‑‑target=ssh` since these options don't make sense if `‑‑target` is
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
        // ▼ Error if --only-preview/--only-preview=true, otherwise set to false
        implies: { 'only-preview': false },
        requires: { target: DeployTarget.Vercel }, // ◄ Error if --target != vercel
        default: false, // ◄ Works in a sane way alongside conflicts/requires
        description: 'Only deploy to the remote production environment'
      },
      'only-preview': {
        alias: ['preview'],
        boolean: true,
        implies: { 'only-production': false },
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
          if (previewOnly || (!productionOnly && !previewOnly)) {
            // Push to preview via vercel
          }

          if (productionOnly) {
            // Push to production via vercel
          }

          break;
        }

        case DeployTarget.Ssh: {
          // Push to host at path via ssh
          break;
        }
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, CustomExecutionContext>;
}
```

### Example 2

Suppose we wanted a "deploy" command with the following [more realistic][35]
feature set:

- Ability to deploy to a Vercel production target, a Vercel preview target, or
  to a remote target via SSH.

- When deploying to Vercel, allow the user to choose to deploy to preview
  (`‑‑preview`), or to production (`‑‑production`), or both.

  - Deploy to the preview target by default.

  - If both `‑‑preview=false` and `‑‑production=false`, throw an error.

  - If both `‑‑preview=true` and `‑‑production=true`, deploy to both the preview
    and production environments.

- When deploying to a remote target via SSH, require a `‑‑host` and `‑‑to-path`
  be provided.

  - If `‑‑host` or `‑‑to-path` are provided, they must be accompanied by
    `‑‑target=ssh` since these options don't make sense if `‑‑target` is
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
          update(oldOptionConfig, { target }) {
            return {
              ...oldOptionConfig,
              choices: [target]
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
      // ▼ This overrides --preview's default if --production is given
      implies: { preview: false },
      // ▼ This allows implications to be overridden by command line arguments
      looseImplications: true,
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
      requires: { target: DeployTarget.Vercel },
      default: true,
      check: function (preview, argv) {
        return (
          argv.target !== DeployTarget.Vercel ||
          preview ||
          argv.production ||
          'must choose either --preview or --production deployment environment'
        );
      },
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
      //demandThisOptionIf: { target: DeployTarget.Ssh },
      subOptionOf: {
        target: [
          {
            // ▼ Unlike demandThisOptionIf, this changes the help text output!
            when: (target: DeployTarget) => target === DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                demandThisOption: true
              };
            }
          },
          {
            when: (target: DeployTarget) => target !== DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                hidden: true
              };
            }
          }
        ]
      }
    },
    'to-path': {
      string: true,
      description: 'The ssh deploy destination path',
      requires: { target: DeployTarget.Ssh },
      //demandThisOptionIf: { target: DeployTarget.Ssh },
      subOptionOf: {
        target: [
          {
            when: (target: DeployTarget) => target === DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                demandThisOption: true
              };
            }
          },
          {
            when: (target: DeployTarget) => target !== DeployTarget.Ssh,
            update(oldOptionConfig) {
              return {
                ...oldOptionConfig,
                hidden: true
              };
            }
          }
        ]
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
          if (production) {
            // Push to production via vercel
          }

          if (preview) {
            // Push to preview via vercel
          }

          break;
        }

        case DeployTarget.Ssh: {
          // Push to host at path via ssh
          break;
        }
      }
    })
  } satisfies ChildConfiguration<CustomCliArguments, CustomExecutionContext>;
}
```

#### Sample Outputs

```text
$ x deploy
Usage: xscripts deploy

Deploy distributes to the appropriate remote.

Required Options:
  --target  Select deployment target and strategy                       [required] [choices: "vercel", "ssh"]

Optional Options:
  --production, --prod  Deploy to the remote production environment                                 [boolean]
  --preview             Deploy to the remote preview environment                    [boolean] [default: true]
  --host                The ssh deploy host                                                          [string]
  --to-path             The ssh deploy destination path                                              [string]

Common Options:
  --help    Show help text                                                                          [boolean]
  --hush    Set output to be somewhat less verbose                                 [boolean] [default: false]
  --quiet   Set output to be dramatically less verbose (implies --hush)            [boolean] [default: false]
  --silent  No output will be generated (implies --quiet)                          [boolean] [default: false]

  xscripts:<error> ❌ Execution failed: missing required argument: target
```

```text
$ x deploy --help
Usage: xscripts deploy

Deploy distributes to the appropriate remote.

Required Options:
  --target  Select deployment target and strategy                       [choices: "vercel", "ssh"]

Optional Options:
  --production, --prod  Deploy to the remote production environment     [boolean]
  --preview             Deploy to the remote preview environment        [boolean] [default: true]
  --host                The ssh deploy host                             [string]
  --to-path             The ssh deploy destination path                 [string]

Common Options:
  --help    Show help text                                              [boolean]
  --hush    Set output to be somewhat less verbose                      [boolean] [default: false]
  --quiet   Set output to be dramatically less verbose (implies --hush) [boolean] [default: false]
  --silent  No output will be generated (implies --quiet)               [boolean] [default: false]
```

```text
$ x deploy --target=ssh
Usage: xscripts deploy

Deploy distributes to the appropriate remote.

Required Options:
  --target   Select deployment target and strategy                      [required] [choices: "ssh"]
  --host     The ssh deploy host                                        [string] [required]
  --to-path  The ssh deploy destination path                            [string] [required]

Common Options:
  --help    Show help text                                              [boolean]
  --hush    Set output to be somewhat less verbose                      [boolean] [default: false]
  --quiet   Set output to be dramatically less verbose (implies --hush) [boolean] [default: false]
  --silent  No output will be generated (implies --quiet)               [boolean] [default: false]

  xscripts:<error> ❌ Execution failed: missing required arguments: host, to-path
```

```text
$ x deploy --target=vercel --to-path
Usage: xscripts deploy

Deploy distributes to the appropriate remote.

Required Options:
  --target  Select deployment target and strategy                       [required] [choices: "vercel"]

Optional Options:
  --production, --prod  Deploy to the remote production environment                          [boolean]
  --preview             Deploy to the remote preview environment             [boolean] [default: true]

Common Options:
  --help    Show help text                                                                   [boolean]
  --hush    Set output to be somewhat less verbose                          [boolean] [default: false]
  --quiet   Set output to be dramatically less verbose (implies --hush)     [boolean] [default: false]
  --silent  No output will be generated (implies --quiet)                   [boolean] [default: false]

  xscripts:<error> ❌ Execution failed: the following arguments must be given alongside "to-path":
  xscripts:<error>
  xscripts:<error> ⮞  --target="ssh"
```

```text
$ x deploy --target=ssh --host prime --to-path '/some/path' --preview
Usage: xscripts deploy

Deploy distributes to the appropriate remote.

Required Options:
  --target   Select deployment target and strategy                      [required] [choices: "ssh"]
  --host     The ssh deploy host                                                [string] [required]
  --to-path  The ssh deploy destination path                                    [string] [required]

Common Options:
  --help    Show help text                                                                [boolean]
  --hush    Set output to be somewhat less verbose                       [boolean] [default: false]
  --quiet   Set output to be dramatically less verbose (implies --hush)  [boolean] [default: false]
  --silent  No output will be generated (implies --quiet)                [boolean] [default: false]

  xscripts:<error> ❌ Execution failed: the following arguments must be given alongside "preview":
  xscripts:<error>
  xscripts:<error> ⮞  --target="vercel"
```

```text
$ x deploy --target=vercel --preview=false --production=false
xscripts:<error> ❌ Execution failed: must choose either --preview or --production deployment environment
```

## Appendix

Further documentation can be found under [`docs/`][x-repo-docs].

### Differences between Black Flag Extensions and Yargs

When using BFE, command options must be configured by [returning an `opt`
object][13] from your command's [`builder`][5] rather than imperatively invoking
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
+     demandThisOption: true,
+     default: '/etc/passwd',
+     describe: 'x marks the spot',
+     type: 'string'
+   }
+ };
}
```

> The yargs API can and should still be invoked for purposes other than defining
> options on a command, e.g. `blackFlag.strict(false)`.

To this end, the following [yargs API functions][36] are soft-disabled via
intellisense:

- `option`
- `options`

However, no attempt is made by BFE to restrict your use of the yargs API at
runtime. Therefore, using yargs's API to work around these artificial
limitations, e.g. in your command's [`builder`][5] function or via the
[`configureExecutionPrologue`][37] hook, will result in **undefined behavior**.

### Black Flag versus Black Flag Extensions

The goal of [Black Flag (@black-flag/core)][38] is to be as close to a drop-in
replacement as possible for vanilla yargs, specifically for users of
[`yargs::commandDir()`][39]. This means Black Flag must go out of its way to
maintain 1:1 parity with the vanilla yargs API ([with a few minor
exceptions][40]).

As a consequence, yargs's imperative nature tends to leak through Black Flag's
abstraction at certain points, such as with [the `blackFlag` parameter of the
`builder` export][5]. **This is a good thing!** Since we want access to all of
yargs's killer features without Black Flag getting in the way.

However, this comes with costs. For one, the yargs's API has suffered from a bit
of feature creep over the years. A result of this is a rigid API [with][41]
[an][12] [abundance][42] [of][43] [footguns][44] and an [inability][45] to
[address][46] them without introducing [massively][47] [breaking][48]
[changes][49].

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
[5]:
  https://github.com/Xunnamius/black-flag/blob/main/docs/index/type-aliases/Configuration.md#builder
[6]:
  https://github.com/Xunnamius/black-flag?tab=readme-ov-file#its-yargs-all-the-way-down-
[7]:
  https://github.com/Xunnamius/black-flag/tree/main?tab=readme-ov-file#motivation
[8]: https://yargs.js.org/docs#api-reference-defaultkey-value-description
[9]: #check
[10]: #requires
[11]: #conflicts
[12]: https://github.com/yargs/yargs/issues/1442
[13]: https://yargs.js.org/docs#api-reference-optionskey-opt
[14]: #implies
[15]: #demandthisoptionif
[16]: #demandthisoption
[17]: #demandthisoptionor
[18]: #demandthisoptionxor
[19]: #suboptionof
[20]: #looseImplications
[21]: https://yargs.js.org/docs#implies
[22]: https://yargs.js.org/docs#conflicts
[23]:
  https://github.com/Xunnamius/black-flag/blob/main/docs/index/type-aliases/Configuration.md#handler
[24]: #new-option-configuration-keys
[25]: https://yargs.js.org/docs#demandOption
[26]: https://yargs.js.org/docs#api-reference-checkfn-globaltrue
[27]:
  https://github.com/Xunnamius/black-flag/blob/main/docs/index/type-aliases/ConfigureErrorHandlingEpilogue.md
[28]:
  https://github.com/Xunnamius/black-flag/blob/main/docs/index/classes/GracefulEarlyExitError.md
[29]:
  https://github.com/Xunnamius/black-flag/tree/main?tab=readme-ov-file#built-in-support-for-dynamic-options-
[30]: https://github.com/Xunnamius/black-flag-demo/blob/main/commands/init.js
[31]: #impossible-configurations
[32]: https://yargs.js.org/docs#api-reference-groupkeys-groupname
[33]: https://github.com/Xunnamius/xunnctl?tab=readme-ov-file#xunnctl
[34]: ./docs/functions/withUsageExtensions.md
[35]: https://github.com/Xunnamius/xscripts/blob/main/src/commands/deploy.ts
[36]: https://yargs.js.org/docs#api-reference
[37]:
  https://github.com/Xunnamius/black-flag/blob/main/docs/index/type-aliases/ConfigureExecutionPrologue.md
[38]: https://npm.im/@black-flag/core
[39]: https://yargs.js.org/docs#api-reference-commanddirdirectory-opts
[40]:
  https://github.com/Xunnamius/black-flag?tab=readme-ov-file#differences-between-black-flag-and-yargs
[41]: https://github.com/yargs/yargs/issues/1323
[42]: https://github.com/yargs/yargs/issues/2340
[43]: https://github.com/yargs/yargs/issues/1322
[44]: https://github.com/yargs/yargs/issues/2089
[45]: https://github.com/yargs/yargs/issues/1975
[46]: https://github.com/yargs/yargs-parser/issues/412
[47]: https://github.com/yargs/yargs/issues/1680
[48]: https://github.com/yargs/yargs/issues/1599
[49]: https://github.com/yargs/yargs/issues/1611
