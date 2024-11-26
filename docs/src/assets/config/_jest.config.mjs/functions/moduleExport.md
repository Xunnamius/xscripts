[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [src/assets/config/\_jest.config.mjs](../README.md) / moduleExport

# Function: moduleExport()

> **moduleExport**(): `object`

## Returns

`object`

### automock?

> `optional` **automock**: `boolean`

### bail?

> `optional` **bail**: `number` \| `boolean`

### cache?

> `optional` **cache**: `boolean`

### cacheDirectory?

> `optional` **cacheDirectory**: `string`

### changedFilesWithAncestor?

> `optional` **changedFilesWithAncestor**: `boolean`

### changedSince?

> `optional` **changedSince**: `string`

### ci?

> `optional` **ci**: `boolean`

### clearMocks?

> `optional` **clearMocks**: `boolean`

### collectCoverage?

> `optional` **collectCoverage**: `boolean`

### collectCoverageFrom?

> `optional` **collectCoverageFrom**: `string`[]

### coverageDirectory?

> `optional` **coverageDirectory**: `string`

### coveragePathIgnorePatterns?

> `optional` **coveragePathIgnorePatterns**: `string`[]

### coverageProvider?

> `optional` **coverageProvider**: `"babel"` \| `"v8"`

### coverageReporters?

> `optional` **coverageReporters**: (`"json"` \| `"clover"` \| `"cobertura"` \| `"html-spa"` \| `"html"` \| `"json-summary"` \| `"lcov"` \| `"lcovonly"` \| `"none"` \| `"teamcity"` \| `"text"` \| `"text-lcov"` \| `"text-summary"` \| [`"json"` \| `"clover"` \| `"cobertura"` \| `"html-spa"` \| `"html"` \| `"json-summary"` \| `"lcov"` \| `"lcovonly"` \| `"none"` \| `"teamcity"` \| `"text"` \| `"text-lcov"` \| `"text-summary"`, `object`])[]

### coverageThreshold?

> `optional` **coverageThreshold**: `object`

#### Index Signature

 \[`path`: `string`\]: `object`

### coverageThreshold.global

> **global**: `object`

### coverageThreshold.global.branches?

> `optional` **branches**: `number`

### coverageThreshold.global.functions?

> `optional` **functions**: `number`

### coverageThreshold.global.lines?

> `optional` **lines**: `number`

### coverageThreshold.global.statements?

> `optional` **statements**: `number`

### dependencyExtractor?

> `optional` **dependencyExtractor**: `string`

### detectLeaks?

> `optional` **detectLeaks**: `boolean`

### detectOpenHandles?

> `optional` **detectOpenHandles**: `boolean`

### displayName?

> `optional` **displayName**: `string` \| `object`

### errorOnDeprecated?

> `optional` **errorOnDeprecated**: `boolean`

### expand?

> `optional` **expand**: `boolean`

### extensionsToTreatAsEsm?

> `optional` **extensionsToTreatAsEsm**: `string`[]

### fakeTimers?

> `optional` **fakeTimers**: \{ enableGlobally?: boolean \| undefined; \} & (\{ advanceTimers?: number \| boolean \| undefined; doNotFake?: ("Date" \| "hrtime" \| "nextTick" \| "performance" \| "queueMicrotask" \| "requestAnimationFrame" \| ... 8 more ... \| "clearTimeout")\[\] \| undefined; now?: number \| undefined; timerLimit?: number \| undefined; legacyFake...

### filter?

> `optional` **filter**: `string`

### findRelatedTests?

> `optional` **findRelatedTests**: `boolean`

### forceCoverageMatch?

> `optional` **forceCoverageMatch**: `string`[]

### forceExit?

> `optional` **forceExit**: `boolean`

### globals?

> `optional` **globals**: `object`

### globalSetup?

> `optional` **globalSetup**: `null` \| `string`

### globalTeardown?

> `optional` **globalTeardown**: `null` \| `string`

### haste?

> `optional` **haste**: `object`

### haste.computeSha1?

> `optional` **computeSha1**: `boolean`

### haste.defaultPlatform?

> `optional` **defaultPlatform**: `null` \| `string`

### haste.enableSymlinks?

> `optional` **enableSymlinks**: `boolean`

### haste.forceNodeFilesystemAPI?

> `optional` **forceNodeFilesystemAPI**: `boolean`

### haste.hasteImplModulePath?

> `optional` **hasteImplModulePath**: `string`

### haste.hasteMapModulePath?

> `optional` **hasteMapModulePath**: `string`

### haste.platforms?

> `optional` **platforms**: `string`[]

### haste.retainAllFiles?

> `optional` **retainAllFiles**: `boolean`

### haste.throwOnModuleCollision?

> `optional` **throwOnModuleCollision**: `boolean`

### id?

> `optional` **id**: `string`

### injectGlobals?

> `optional` **injectGlobals**: `boolean`

### json?

> `optional` **json**: `boolean`

### lastCommit?

> `optional` **lastCommit**: `boolean`

### listTests?

> `optional` **listTests**: `boolean`

### logHeapUsage?

> `optional` **logHeapUsage**: `boolean`

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

### maxWorkers?

> `optional` **maxWorkers**: `string` \| `number`

### moduleDirectories?

> `optional` **moduleDirectories**: `string`[]

### moduleFileExtensions?

> `optional` **moduleFileExtensions**: `string`[]

### moduleNameMapper?

> `optional` **moduleNameMapper**: `object`

### modulePathIgnorePatterns?

> `optional` **modulePathIgnorePatterns**: `string`[]

### modulePaths?

> `optional` **modulePaths**: `string`[]

### noStackTrace?

> `optional` **noStackTrace**: `boolean`

### notify?

> `optional` **notify**: `boolean`

### notifyMode?

> `optional` **notifyMode**: `string`

### onlyChanged?

> `optional` **onlyChanged**: `boolean`

### onlyFailures?

> `optional` **onlyFailures**: `boolean`

### openHandlesTimeout?

> `optional` **openHandlesTimeout**: `number`

### outputFile?

> `optional` **outputFile**: `string`

### passWithNoTests?

> `optional` **passWithNoTests**: `boolean`

### preset?

> `optional` **preset**: `null` \| `string`

### prettierPath?

> `optional` **prettierPath**: `null` \| `string`

### projects?

> `optional` **projects**: (`string` \| `object`)[]

### randomize?

> `optional` **randomize**: `boolean`

### replname?

> `optional` **replname**: `null` \| `string`

### reporters?

> `optional` **reporters**: (`string` \| [`string`, `object`])[]

### resetMocks?

> `optional` **resetMocks**: `boolean`

### resetModules?

> `optional` **resetModules**: `boolean`

### resolver?

> `optional` **resolver**: `null` \| `string`

### restoreMocks?

> `optional` **restoreMocks**: `boolean`

### rootDir?

> `optional` **rootDir**: `string`

### roots?

> `optional` **roots**: `string`[]

### runner?

> `optional` **runner**: `string`

### runTestsByPath?

> `optional` **runTestsByPath**: `boolean`

### runtime?

> `optional` **runtime**: `string`

### sandboxInjectedGlobals?

> `optional` **sandboxInjectedGlobals**: `string`[]

### setupFiles?

> `optional` **setupFiles**: `string`[]

### setupFilesAfterEnv?

> `optional` **setupFilesAfterEnv**: `string`[]

### showSeed?

> `optional` **showSeed**: `boolean`

### silent?

> `optional` **silent**: `boolean`

### skipFilter?

> `optional` **skipFilter**: `boolean`

### skipNodeResolution?

> `optional` **skipNodeResolution**: `boolean`

### slowTestThreshold?

> `optional` **slowTestThreshold**: `number`

### snapshotFormat?

> `optional` **snapshotFormat**: `object`

### snapshotFormat.callToJSON?

> `optional` **callToJSON**: `boolean`

### snapshotFormat.compareKeys?

> `optional` **compareKeys**: `null`

### snapshotFormat.escapeRegex?

> `optional` **escapeRegex**: `boolean`

### snapshotFormat.escapeString?

> `optional` **escapeString**: `boolean`

### snapshotFormat.highlight?

> `optional` **highlight**: `boolean`

### snapshotFormat.indent?

> `optional` **indent**: `number`

### snapshotFormat.maxDepth?

> `optional` **maxDepth**: `number`

### snapshotFormat.maxWidth?

> `optional` **maxWidth**: `number`

### snapshotFormat.min?

> `optional` **min**: `boolean`

### snapshotFormat.printBasicPrototype?

> `optional` **printBasicPrototype**: `boolean`

### snapshotFormat.printFunctionName?

> `optional` **printFunctionName**: `boolean`

### snapshotFormat.theme?

> `optional` **theme**: `object`

### snapshotFormat.theme.comment?

> `optional` **comment**: `string`

### snapshotFormat.theme.content?

> `optional` **content**: `string`

### snapshotFormat.theme.prop?

> `optional` **prop**: `string`

### snapshotFormat.theme.tag?

> `optional` **tag**: `string`

### snapshotFormat.theme.value?

> `optional` **value**: `string`

### snapshotResolver?

> `optional` **snapshotResolver**: `string`

### snapshotSerializers?

> `optional` **snapshotSerializers**: `string`[]

### testEnvironment?

> `optional` **testEnvironment**: `string`

### testEnvironmentOptions?

> `optional` **testEnvironmentOptions**: `object`

### testFailureExitCode?

> `optional` **testFailureExitCode**: `string` \| `number`

### testLocationInResults?

> `optional` **testLocationInResults**: `boolean`

### testMatch?

> `optional` **testMatch**: `string`[]

### testNamePattern?

> `optional` **testNamePattern**: `string`

### testPathIgnorePatterns?

> `optional` **testPathIgnorePatterns**: `string`[]

### testRegex?

> `optional` **testRegex**: `string` \| `string`[]

### testResultsProcessor?

> `optional` **testResultsProcessor**: `string`

### testRunner?

> `optional` **testRunner**: `string`

### testSequencer?

> `optional` **testSequencer**: `string`

### testTimeout?

> `optional` **testTimeout**: `number`

### transform?

> `optional` **transform**: `object`

### transformIgnorePatterns?

> `optional` **transformIgnorePatterns**: `string`[]

### unmockedModulePathPatterns?

> `optional` **unmockedModulePathPatterns**: `string`[]

### updateSnapshot?

> `optional` **updateSnapshot**: `boolean`

### useStderr?

> `optional` **useStderr**: `boolean`

### verbose?

> `optional` **verbose**: `boolean`

### waitNextEventLoopTurnForUnhandledRejectionEvents?

> `optional` **waitNextEventLoopTurnForUnhandledRejectionEvents**: `boolean`

### watch?

> `optional` **watch**: `boolean`

### watchAll?

> `optional` **watchAll**: `boolean`

### watchman?

> `optional` **watchman**: `boolean`

### watchPathIgnorePatterns?

> `optional` **watchPathIgnorePatterns**: `string`[]

### watchPlugins?

> `optional` **watchPlugins**: (`string` \| [`string`, `unknown`])[]

### workerIdleMemoryLimit?

> `optional` **workerIdleMemoryLimit**: `string` \| `number`

### workerThreads?

> `optional` **workerThreads**: `boolean`

## Defined in

[src/assets/config/\_jest.config.mjs.ts:27](https://github.com/Xunnamius/xscripts/blob/5720c37375b8ffddbde03f8e53002853e0eeabbc/src/assets/config/_jest.config.mjs.ts#L27)
