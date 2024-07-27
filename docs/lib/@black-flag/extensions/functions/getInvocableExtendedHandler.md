[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / getInvocableExtendedHandler

# Function: getInvocableExtendedHandler()

> **getInvocableExtendedHandler**\<`CustomCliArguments`, `CustomExecutionContext`\>(`maybeCommand`, `context`): `Promise`\<(`argv_`) => `Promise`\<`void`\>\>

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Parameters

• **maybeCommand**: `Promisable`\<`ImportedConfigurationModule`\<`CustomCliArguments`, `CustomExecutionContext`\> \| `ImportedConfigurationModule`\<`CustomCliArguments`, [`AsStrictExecutionContext`](../type-aliases/AsStrictExecutionContext.md)\<`CustomExecutionContext`\>\>\>

• **context**: `CustomExecutionContext`

## Returns

`Promise`\<(`argv_`) => `Promise`\<`void`\>\>

## Defined in

[lib/@black-flag/extensions/index.ts:1131](https://github.com/Xunnamius/xscripts/blob/57333eb95500d47b37fb5be30901f27ce55d7211/lib/@black-flag/extensions/index.ts#L1131)
