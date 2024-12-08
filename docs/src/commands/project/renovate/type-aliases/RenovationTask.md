[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/commands/project/renovate](../README.md) / RenovationTask

# Type Alias: RenovationTask

> **RenovationTask**: `BfeBuilderObjectValue`\<`Record`\<`string`, `unknown`\>, [`GlobalExecutionContext`](../../../../configure/type-aliases/GlobalExecutionContext.md)\> & `object`

## Type declaration

### actionDescription

> **actionDescription**: `string`

The description reported to the user when the task is run.

#### Default

`Running task ${taskName}`

### emoji

> **emoji**: `string`

A symbol that will be placed before xscripts output text concerning this
task.

### longHelpDescription

> **longHelpDescription**: `string`

The description reported to the user when `--help` is called (via usage).

### requiresForce

> **requiresForce**: `boolean`

If `true`, `--force` must be given on the command line alongside this task.

### run()

> **run**: (`argv`, `taskContextPartial`) => `Promise`\<`void`\>

A function called when the task is triggered.

#### Parameters

##### argv

`unknown`

##### taskContextPartial

[`RenovationTaskContext`](RenovationTaskContext.md)

#### Returns

`Promise`\<`void`\>

### shortHelpDescription

> **shortHelpDescription**: `string`

The description reported to the user when `--help` is called (via option).

### subOptions

> **subOptions**: `BfeBuilderObject`\<`Record`\<`string`, `unknown`\>, [`GlobalExecutionContext`](../../../../configure/type-aliases/GlobalExecutionContext.md)\>

Suboptions of this task are only relevant when this task's flag is given
on the CLI.

### supportedScopes

> **supportedScopes**: [`DefaultGlobalScope`](../../../../configure/enumerations/DefaultGlobalScope.md)[]

Which [ProjectRenovateScope](../../../../configure/enumerations/DefaultGlobalScope.md)s are allowed when attempting this
renovation.

### taskAliases

> **taskAliases**: `string`[]

The alternative names of the task.

### taskName

> **taskName**: `string`

The name of the task.

## Defined in

[src/commands/project/renovate.ts:103](https://github.com/Xunnamius/xscripts/blob/cfe28e3d801ec1b719b0dedbda4e9f63d7924b77/src/commands/project/renovate.ts#L103)
