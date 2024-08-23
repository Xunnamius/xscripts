[**@-xun/scripts**](../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../README.md) / [lib/@black-flag/extensions](../README.md) / getInvocableExtendedHandler

# Function: getInvocableExtendedHandler()

> **getInvocableExtendedHandler**\<`CustomCliArguments`, `CustomExecutionContext`\>(`maybeCommand`, `context`): `Promise`\<(`argv_`) => `Promise`\<`void`\>\>

This function returns a version of `maybeCommand`'s handler function that is
ready to invoke immediately. It can be used with both BFE and normal Black
Flag command exports.

See [the BFE
documentation](https://github.com/Xunnamius/black-flag-extensions?tab=readme-ov-file#getinvocableextendedhandler)
for more details.

## Type Parameters

• **CustomCliArguments** *extends* `Record`\<`string`, `unknown`\>

• **CustomExecutionContext** *extends* `ExecutionContext`

## Parameters

• **maybeCommand**: `Promisable`\<`ImportedConfigurationModule`\<`CustomCliArguments`, `CustomExecutionContext`\> \| `ImportedConfigurationModule`\<`CustomCliArguments`, [`AsStrictExecutionContext`](../type-aliases/AsStrictExecutionContext.md)\<`CustomExecutionContext`\>\>\>

• **context**: `CustomExecutionContext`

## Returns

`Promise`\<(`argv_`) => `Promise`\<`void`\>\>

## Defined in

[lib/@black-flag/extensions/index.ts:1159](https://github.com/Xunnamius/xscripts/blob/ce701f3d57da9f82ee0036320bc62d5c51233011/lib/@black-flag/extensions/index.ts#L1159)
