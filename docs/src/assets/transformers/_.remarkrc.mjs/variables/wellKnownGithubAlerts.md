[**@-xun/scripts**](../../../../../README.md)

***

[@-xun/scripts](../../../../../README.md) / [src/assets/transformers/\_.remarkrc.mjs](../README.md) / wellKnownGithubAlerts

# Variable: wellKnownGithubAlerts

> `const` **wellKnownGithubAlerts**: readonly [`"[!NOTE]"`, `"[!TIP]"`, `"[!IMPORTANT]"`, `"[!WARNING]"`, `"[!CAUTION]"`]

We track these so that we may prevent mdast-util-markdown from mangling them
with an escape character, which sometimes does not render properly on GitHub
or with GFM-compatible tooling.

## See

https://github.com/orgs/community/discussions/16925

## Defined in

[src/assets/transformers/\_.remarkrc.mjs.ts:40](https://github.com/Xunnamius/xscripts/blob/f7b55e778c8646134a23d934fd2791d564a72b57/src/assets/transformers/_.remarkrc.mjs.ts#L40)
