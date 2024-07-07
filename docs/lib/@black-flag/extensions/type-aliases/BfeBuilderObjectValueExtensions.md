[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / BfeBuilderObjectValueExtensions

# Type Alias: BfeBuilderObjectValueExtensions\<CustomCliArguments, CustomExecutionContext\>

> **BfeBuilderObjectValueExtensions**\<`CustomCliArguments`, `CustomExecutionContext`\>: `object`

An object containing only those properties recognized by
BFE.

This type + [BfeBuilderObjectValueWithoutExtensions](BfeBuilderObjectValueWithoutExtensions.md) =
[BfeBuilderObjectValue](BfeBuilderObjectValue.md).

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Type declaration

### check()?

> `optional` **check**: (`currentArgumentValue`, `argv`) => `Promisable`\<`unknown`\>

`check` is the declarative option-specific version of vanilla yargs's
`yargs::check()`. Also supports async and promise-returning functions.

This function receives the `currentArgumentValue`, which you are free to
type as you please, and the fully parsed `argv`. If this function throws,
the exception will bubble. If this function returns an instance of `Error`,
a string, or any non-truthy value (including `undefined` or not returning
anything), Black Flag will throw a `CliError` on your behalf.

See [the
documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#check)
for details.

#### Parameters

• **currentArgumentValue**: `any`

• **argv**: `Arguments`\<`CustomCliArguments`, `CustomExecutionContext`\>

#### Returns

`Promisable`\<`unknown`\>

### conflicts?

> `optional` **conflicts**: [`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md)

`conflicts` enables checks to ensure the specified arguments, or
argument-value pairs, are _never_ given conditioned on the existence of
another argument. For example:

```jsonc
{
  "x": { "conflicts": "y" }, // ◄ Disallows y if x is given
  "y": {}
}
```

### default?

> `optional` **default**: `unknown`

`default` will set a default value for an argument. This is equivalent to
`default` from vanilla yargs.

However, unlike vanilla yargs and Black Flag, this default value is applied
towards the end of BFE's execution, enabling its use alongside keys like
`conflicts`. See [the
documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#support-for-default-with-conflictsrequiresetc)
for details.

### demandThisOption?

> `optional` **demandThisOption**: [`BfGenericBuilderObjectValue`](BfGenericBuilderObjectValue.md)\[`"demandOption"`\]

`demandThisOption` enables checks to ensure an argument is always given.
This is equivalent to `demandOption` from vanilla yargs. For example:

```jsonc
{
  "x": { "demandThisOption": true }, // ◄ Disallows ∅, y
  "y": { "demandThisOption": false }
}
```

### demandThisOptionIf?

> `optional` **demandThisOptionIf**: [`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md)

`demandThisOptionIf` enables checks to ensure an argument is given when at
least one of the specified groups of arguments, or argument-value pairs, is
also given. For example:

```jsonc
{
  "x": {},
  "y": { "demandThisOptionIf": "x" }, // ◄ Demands y if x is given
  "z": { "demandThisOptionIf": "x" } // ◄ Demands z if x is given
}
```

### demandThisOptionOr?

> `optional` **demandThisOptionOr**: [`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md)

`demandThisOptionOr` enables non-optional inclusive disjunction checks per
group. Put another way, `demandThisOptionOr` enforces a "logical or"
relation within groups of required options. For example:

```jsonc
{
  "x": { "demandThisOptionOr": ["y", "z"] }, // ◄ Demands x or y or z
  "y": { "demandThisOptionOr": ["x", "z"] },
  "z": { "demandThisOptionOr": ["x", "y"] }
}
```

### demandThisOptionXor?

> `optional` **demandThisOptionXor**: [`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md)

`demandThisOptionXor` enables non-optional exclusive disjunction checks per
exclusivity group. Put another way, `demandThisOptionXor` enforces mutual
exclusivity within groups of required options. For example:

```jsonc
{
  // ▼ Disallows ∅, z, w, xy, xyw, xyz, xyzw
  "x": { "demandThisOptionXor": ["y"] },
  "y": { "demandThisOptionXor": ["x"] },
  // ▼ Disallows ∅, x, y, zw, xzw, yzw, xyzw
  "z": { "demandThisOptionXor": ["w"] },
  "w": { "demandThisOptionXor": ["z"] }
}
```

### implies?

> `optional` **implies**: `Exclude`\<[`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md), `string` \| `unknown`[]\> \| `Exclude`\<[`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md), `string` \| `unknown`[]\>[]

`implies` will set default values for the specified arguments conditioned
on the existence of another argument. These implied defaults will override
any `default` configurations of the specified arguments.

If any of the specified arguments are explicitly given on the command line,
their values must match the specified argument-value pairs respectively
(which is the behavior of `requires`/`conflicts`). Use `looseImplications`
to modify this behavior.

Hence, `implies` only accepts one or more argument-value pairs and not raw
strings. For example:

```jsonc
{
  "x": { "implies": { "y": true } }, // ◄ x is now synonymous with xy
  "y": {}
}
```

For describing more complex implications, see `subOptionOf`.

### looseImplications?

> `optional` **looseImplications**: `boolean`

When `looseImplications` is set to `true`, any implied arguments, when
explicitly given on the command line, will _override_ their configured
implications instead of causing an error.

#### Default

```ts
false
```

#### See

BfeBuilderObjectValueExtensions.implies

### requires?

> `optional` **requires**: [`BfeBuilderObjectValueExtensionValue`](BfeBuilderObjectValueExtensionValue.md)

`requires` enables checks to ensure the specified arguments, or
argument-value pairs, are given conditioned on the existence of another
argument. For example:

```jsonc
{
  "x": { "requires": "y" }, // ◄ Disallows x without y
  "y": {}
}
```

### subOptionOf?

> `optional` **subOptionOf**: `Record`\<`string`, [`BfeSubOptionOfExtensionValue`](BfeSubOptionOfExtensionValue.md)\<`CustomCliArguments`, `CustomExecutionContext`\> \| [`BfeSubOptionOfExtensionValue`](BfeSubOptionOfExtensionValue.md)\<`CustomCliArguments`, `CustomExecutionContext`\>[]\>

`subOptionOf` is declarative sugar around Black Flag's support for double
argument parsing, allowing you to describe the relationship between options
and the suboptions whose configurations they determine.

See [the
documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#suboptionof)
for details.

For describing simpler implicative relations, see `implies`.

## Defined in

[lib/@black-flag/extensions/index.ts:197](https://github.com/Xunnamius/xscripts/blob/4c305ac01bcb5579e4796a0cd2b08508dc5de5e1/lib/@black-flag/extensions/index.ts#L197)
