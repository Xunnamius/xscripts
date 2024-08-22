[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / getInvocableExtendedHandler

# Function: getInvocableExtendedHandler()

> **getInvocableExtendedHandler**\<`CustomCliArguments`, `CustomExecutionContext`\>(`maybeCommand`, `context`): `Promise`\<(`argv_`) => `Promise`\<`void`\>\>

TODO: a decent comment

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Parameters

• **maybeCommand**: `Promisable`\<`ImportedConfigurationModule`\<`CustomCliArguments`, `CustomExecutionContext`\> \| `ImportedConfigurationModule`\<`CustomCliArguments`, [`AsStrictExecutionContext`](../type-aliases/AsStrictExecutionContext.md)\<`CustomExecutionContext`\>\>\>

• **context**: `CustomExecutionContext`

## Returns

`Promise`\<(`argv_`) => `Promise`\<`void`\>\>

## Defined in

[lib/@black-flag/extensions/index.ts:1153](https://github.com/Xunnamius/xscripts/blob/d6d7a7ba960d4afbaeb1cb7202a4cb4c1a4e6c33/lib/@black-flag/extensions/index.ts#L1153)
