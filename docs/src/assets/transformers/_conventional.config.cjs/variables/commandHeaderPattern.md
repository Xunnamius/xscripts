[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/transformers/\_conventional.config.cjs](../README.md) / commandHeaderPattern

# Variable: commandHeaderPattern

> `const` **commandHeaderPattern**: `RegExp`

This regular expression matches well-known xpipeline command strings that may
appear as commands in commit headers and is used to remove said commands so
they do not appear in the changelog.

Matches against `commandHeaderPattern` should return two matching groups, the
first containing the input string without the command string(s) or a trailing
space and the second containing the command string(s) without its surrounding
brackets or space prefix.

### Xpipline commands

Xpipline commands expand on the [conventional commits
specification](https://www.conventionalcommits.org/en/v1.0.0/#specification)
to include a new "command" structure in addition to "type", "scope",
"description" (alias of "subject"), "header" (combination of type + scope +
description + command), "body", and "footer".

```text
<type>[scope][!]: <description/subject> [command]

[body]

[footer(s)]
```

#### Expanded specification

- A command MAY be provided; if provided, it MUST be after the description.
- A header MUST have exactly zero or one commands.
- A command MUST consist of a space followed by an opening bracket ("[")
  followed by one or more well-known command strings followed by a closing
  bracket ("]"). The closing bracket MUST be the final character of the
  header.
- A well-known command string MUST be lowercase alphanumeric and MAY contain
  spaces or dashes. It MUST NOT contain any other characters.
- A command MAY consist of one or more well-known command strings. Each
  command string beyond the first MUST be separated from the previous
  well-known command string by a comma (",") and OPTIONAL space.

Examples:

```text
type(scope): description [skip ci]
```

```text
type!: description [skip ci, skip cd]
```

```text
type: subject [skip ci,skip cd]
```

#### Xpipeline footers

Xpipeline also acknowledges well-known command strings via "xpipeline
footers", which are simply [spec-compliant
footers](https://www.conventionalcommits.org/en/v1.0.0/#specification) of the
form `xpipeline: command string` or `xpipeline: command string 1, command
string 2, etc`, or the `xpipe: ...`/`x: ...`.

Both commands and footers can be used simultaneously.

Examples:

```text
type(scope): description

This is a really detailed commit message body.

xpipeline: skip ci
xpipe: skip cd
x: some-other-command, yet-another-command, a-5th-command
```

## Defined in

[src/assets/transformers/\_conventional.config.cjs.ts:230](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/assets/transformers/_conventional.config.cjs.ts#L230)
