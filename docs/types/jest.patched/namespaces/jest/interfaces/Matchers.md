[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / Matchers

# Interface: Matchers\<R, T\>

## Type Parameters

• **R**

• **T** = `object`

## Methods

### fail()

> **fail**(`message`): `never`

Note: Currently unimplemented
Failing assertion

#### Parameters

• **message**: `string`

#### Returns

`never`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:446

***

### ~~lastCalledWith()~~

> **lastCalledWith**\<`E`\>(...`args`): `R`

Ensures the last call to a mock function was provided specific args.

Optionally, you can provide a type for the expected arguments via a generic.
Note that the type must be either an array or a tuple.

#### Type Parameters

• **E** *extends* `any`[]

#### Parameters

• ...**args**: `E`

#### Returns

`R`

#### Deprecated

in favor of `toHaveBeenLastCalledWith`

#### Defined in

node\_modules/@types/jest/index.d.ts:813

***

### ~~lastReturnedWith()~~

> **lastReturnedWith**\<`E`\>(`expected`?): `R`

Ensure that the last call to a mock function has returned a specified value.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **expected?**: `E`

#### Returns

`R`

#### Deprecated

in favor of `toHaveLastReturnedWith`

#### Defined in

node\_modules/@types/jest/index.d.ts:823

***

### ~~nthCalledWith()~~

> **nthCalledWith**\<`E`\>(`nthCall`, ...`params`): `R`

Ensure that a mock function is called with specific arguments on an Nth call.

Optionally, you can provide a type for the expected arguments via a generic.
Note that the type must be either an array or a tuple.

#### Type Parameters

• **E** *extends* `any`[]

#### Parameters

• **nthCall**: `number`

• ...**params**: `E`

#### Returns

`R`

#### Deprecated

in favor of `toHaveBeenNthCalledWith`

#### Defined in

node\_modules/@types/jest/index.d.ts:833

***

### ~~nthReturnedWith()~~

> **nthReturnedWith**\<`E`\>(`n`, `expected`?): `R`

Ensure that the nth call to a mock function has returned a specified value.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **n**: `number`

• **expected?**: `E`

#### Returns

`R`

#### Deprecated

in favor of `toHaveNthReturnedWith`

#### Defined in

node\_modules/@types/jest/index.d.ts:843

***

### pass()

> **pass**(`message`): `R`

Note: Currently unimplemented
Passing assertion

#### Parameters

• **message**: `string`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:438

***

### toBe()

> **toBe**\<`E`\>(`expected`): `R`

Checks that a value is what you expect. It uses `Object.is` to check strict equality.
Don't use `toBe` with floating-point numbers.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **expected**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:852

***

### toBeAfter()

> **toBeAfter**(`date`): `R`

Use `.toBeAfter` when checking if a date occurs after `date`.

#### Parameters

• **date**: `Date`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:485

***

### toBeAfterOrEqualTo()

> **toBeAfterOrEqualTo**(`date`): `R`

Use `.toBeAfterOrEqualTo` when checking if a date equals to or occurs after `date`.

#### Parameters

• **date**: `Date`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:864

***

### toBeArray()

> **toBeArray**(): `R`

Use `.toBeArray` when checking if a value is an `Array`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:473

***

### toBeArrayOfSize()

> **toBeArrayOfSize**(`x`): `R`

Use `.toBeArrayOfSize` when checking if a value is an `Array` of size x.

#### Parameters

• **x**: `number`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:479

***

### toBeBefore()

> **toBeBefore**(`date`): `R`

Use `.toBeBefore` when checking if a date occurs before `date`.

#### Parameters

• **date**: `Date`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:491

***

### toBeBeforeOrEqualTo()

> **toBeBeforeOrEqualTo**(`date`): `R`

Use `.toBeBeforeOrEqualTo` when checking if a date equals to or occurs before `date`.

#### Parameters

• **date**: `Date`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:858

***

### toBeBetween()

> **toBeBetween**(`startDate`, `endDate`): `R`

Use `.toBeBetween` when checking if a date occurs between `startDate` and `endDate`.

#### Parameters

• **startDate**: `Date`

• **endDate**: `Date`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:852

***

### toBeBoolean()

> **toBeBoolean**(): `R`

Use `.toBeBoolean` when checking if a value is a `Boolean`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:538

***

### ~~toBeCalled()~~

> **toBeCalled**(): `R`

Ensures that a mock function is called.

#### Returns

`R`

#### Deprecated

in favor of `toHaveBeenCalled`

#### Defined in

node\_modules/@types/jest/index.d.ts:858

***

### ~~toBeCalledTimes()~~

> **toBeCalledTimes**(`expected`): `R`

Ensures that a mock function is called an exact number of times.

#### Parameters

• **expected**: `number`

#### Returns

`R`

#### Deprecated

in favor of `toHaveBeenCalledTimes`

#### Defined in

node\_modules/@types/jest/index.d.ts:864

***

### ~~toBeCalledWith()~~

> **toBeCalledWith**\<`E`\>(...`args`): `R`

Ensure that a mock function is called with specific arguments.

Optionally, you can provide a type for the expected arguments via a generic.
Note that the type must be either an array or a tuple.

#### Type Parameters

• **E** *extends* `any`[]

#### Parameters

• ...**args**: `E`

#### Returns

`R`

#### Deprecated

in favor of `toHaveBeenCalledWith`

#### Defined in

node\_modules/@types/jest/index.d.ts:874

***

### toBeCloseTo()

> **toBeCloseTo**(`expected`, `numDigits`?): `R`

Using exact equality with floating point numbers is a bad idea.
Rounding means that intuitive things fail.
The default for numDigits is 2.

#### Parameters

• **expected**: `number`

• **numDigits?**: `number`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:880

***

### toBeDate()

> **toBeDate**(): `R`

Use `.toBeDate` when checking if a value is a `Date`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:553

***

### toBeDateString()

> **toBeDateString**(): `R`

Use `.toBeDateString` when checking if a value is a valid date string.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:568

***

### toBeDefined()

> **toBeDefined**(): `R`

Ensure that a variable is not undefined.

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:884

***

### toBeEmpty()

> **toBeEmpty**(): `R`

Use .toBeEmpty when checking if a String '', Array [], Object {} or Iterable (i.e. Map, Set) is empty.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:451

***

### toBeEmptyObject()

> **toBeEmptyObject**(): `R`

Use `.toBeEmptyObject` when checking if a value is an empty `Object`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:840

***

### toBeEven()

> **toBeEven**(): `R`

Use `.toBeEven` when checking if a value is an even `Number`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:633

***

### toBeExtensible()

> **toBeExtensible**(): `R`

Use `.toBeExtensible` when checking if an object is extensible.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:753

***

### toBeFalse()

> **toBeFalse**(): `R`

Use `.toBeFalse` when checking a value is equal (===) to `false`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:548

***

### toBeFalsy()

> **toBeFalsy**(): `R`

When you don't care what a value is, you just want to
ensure a value is false in a boolean context.

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:889

***

### toBeFinite()

> **toBeFinite**(): `R`

Use `.toBeFinite` when checking if a value is a `Number`, not `NaN` or `Infinity`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:618

***

### toBeFrozen()

> **toBeFrozen**(): `R`

Use `.toBeFrozen` when checking if an object is frozen.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:758

***

### toBeFunction()

> **toBeFunction**(): `R`

Use `.toBeFunction` when checking if a value is a `Function`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:563

***

### toBeGreaterThan()

> **toBeGreaterThan**(`expected`): `R`

For comparing floating point or big integer numbers.

#### Parameters

• **expected**: `number` \| `bigint`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:893

***

### toBeGreaterThanOrEqual()

> **toBeGreaterThanOrEqual**(`expected`): `R`

For comparing floating point or big integer numbers.

#### Parameters

• **expected**: `number` \| `bigint`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:897

***

### toBeHexadecimal()

> **toBeHexadecimal**(): `R`

Use `.toBeHexadecimal` when checking if a value is a valid HTML hex color.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:573

***

### toBeInRange()

> **toBeInRange**(`min`, `max`): `R`

Use `.toBeInRange` when checking if an array has elements in range min (inclusive) and max (inclusive).

#### Parameters

• **min**: `number`

• **max**: `number`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:654

***

### toBeInstanceOf()

> **toBeInstanceOf**\<`E`\>(`expected`): `R`

Ensure that an object is an instance of a class.
This matcher uses `instanceof` underneath.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **expected**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:906

***

### toBeInteger()

> **toBeInteger**(): `R`

Use `.toBeInteger` when checking if a value is an integer.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:659

***

### toBeLessThan()

> **toBeLessThan**(`expected`): `R`

For comparing floating point or big integer numbers.

#### Parameters

• **expected**: `number` \| `bigint`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:910

***

### toBeLessThanOrEqual()

> **toBeLessThanOrEqual**(`expected`): `R`

For comparing floating point or big integer numbers.

#### Parameters

• **expected**: `number` \| `bigint`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:914

***

### toBeNaN()

#### toBeNaN()

> **toBeNaN**(): `R`

Use `.toBeNaN` when checking a value is `NaN`.

##### Returns

`R`

##### Defined in

node\_modules/jest-extended/types/index.d.ts:613

#### toBeNaN()

> **toBeNaN**(): `R`

Used to check that a variable is NaN.

##### Returns

`R`

##### Defined in

node\_modules/@types/jest/index.d.ts:933

***

### toBeNegative()

> **toBeNegative**(): `R`

Use `.toBeNegative` when checking if a value is a negative `Number`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:628

***

### toBeNil()

> **toBeNil**(): `R`

Use `.toBeNil` when checking a value is `null` or `undefined`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:462

***

### toBeNull()

> **toBeNull**(): `R`

This is the same as `.toBe(null)` but the error messages are a bit nicer.
So use `.toBeNull()` when you want to check that something is null.

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:919

***

### toBeNumber()

> **toBeNumber**(): `R`

Use `.toBeNumber` when checking if a value is a `Number`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:608

***

### toBeObject()

> **toBeObject**(): `R`

Use `.toBeObject` when checking if a value is an `Object`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:664

***

### toBeOdd()

> **toBeOdd**(): `R`

Use `.toBeOdd` when checking if a value is an odd `Number`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:638

***

### toBeOneOf()

> **toBeOneOf**\<`E`\>(`members`): `R`

Use .toBeOneOf when checking if a value is a member of a given Array.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **members**: readonly `E`[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:457

***

### toBePositive()

> **toBePositive**(): `R`

Use `.toBePositive` when checking if a value is a positive `Number`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:623

***

### toBeSealed()

> **toBeSealed**(): `R`

Use `.toBeSealed` when checking if an object is sealed.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:763

***

### toBeString()

> **toBeString**(): `R`

Use `.toBeString` when checking if a value is a `String`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:778

***

### toBeSymbol()

> **toBeSymbol**(): `R`

Use `.toBeSymbol` when checking if a value is a `Symbol`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:845

***

### toBeTrue()

> **toBeTrue**(): `R`

Use `.toBeTrue` when checking a value is equal (===) to `true`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:543

***

### toBeTruthy()

> **toBeTruthy**(): `R`

Use when you don't care what a value is, you just want to ensure a value
is true in a boolean context. In JavaScript, there are six falsy values:
`false`, `0`, `''`, `null`, `undefined`, and `NaN`. Everything else is truthy.

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:925

***

### toBeUndefined()

> **toBeUndefined**(): `R`

Used to check that a variable is undefined.

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:929

***

### toBeValidDate()

> **toBeValidDate**(): `R`

Use `.toBeValidDate` when checking if a value is a `valid Date`.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:558

***

### toBeWithin()

> **toBeWithin**(`start`, `end`): `R`

Use `.toBeWithin` when checking if a number is in between the given bounds of: start (inclusive) and end (exclusive).

#### Parameters

• **start**: `number`

• **end**: `number`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:646

***

### toContain()

> **toContain**\<`E`\>(`expected`): `R`

Used when you want to check that an item is in a list.
For testing the items in the list, this uses `===`, a strict equality check.
It can also check whether a string is a substring of another string.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **expected**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:943

***

### toContainAllEntries()

> **toContainAllEntries**\<`E`\>(`entries`): `R`

Use `.toContainAllEntries` when checking if an object only contains all of the provided entries.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **entries**: readonly readonly [keyof `E`, `E`\[keyof `E`\]][]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:741

***

### toContainAllKeys()

> **toContainAllKeys**\<`E`\>(`keys`): `R`

Use `.toContainAllKeys` when checking if an object only contains all of the provided keys.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **keys**: readonly (`string` \| keyof `E`)[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:685

***

### toContainAllValues()

> **toContainAllValues**\<`E`\>(`values`): `R`

Use `.toContainAllValues` when checking if an object only contains all of the provided values.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **values**: readonly `E`[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:713

***

### toContainAnyEntries()

> **toContainAnyEntries**\<`E`\>(`entries`): `R`

Use `.toContainAnyEntries` when checking if an object contains at least one of the provided entries.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **entries**: readonly readonly [keyof `E`, `E`\[keyof `E`\]][]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:748

***

### toContainAnyKeys()

> **toContainAnyKeys**\<`E`\>(`keys`): `R`

Use `.toContainAnyKeys` when checking if an object contains at least one of the provided keys.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **keys**: readonly (`string` \| keyof `E`)[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:692

***

### toContainAnyValues()

> **toContainAnyValues**\<`E`\>(`values`): `R`

Use `.toContainAnyValues` when checking if an object contains at least one of the provided values.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **values**: readonly `E`[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:720

***

### toContainEntries()

> **toContainEntries**\<`E`\>(`entries`): `R`

Use `.toContainEntries` when checking if an object contains all of the provided entries.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **entries**: readonly readonly [keyof `E`, `E`\[keyof `E`\]][]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:734

***

### toContainEntry()

> **toContainEntry**\<`E`\>(`entry`): `R`

Use `.toContainEntry` when checking if an object contains the provided entry.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **entry**: readonly [keyof `E`, `E`\[keyof `E`\]]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:727

***

### toContainEqual()

> **toContainEqual**\<`E`\>(`expected`): `R`

Used when you want to check that an item is in a list.
For testing the items in the list, this matcher recursively checks the
equality of all fields, rather than checking for object identity.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **expected**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:953

***

### toContainKey()

> **toContainKey**\<`E`\>(`key`): `R`

Use `.toContainKey` when checking if an object contains the provided key.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **key**: `string` \| keyof `E`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:671

***

### toContainKeys()

> **toContainKeys**\<`E`\>(`keys`): `R`

Use `.toContainKeys` when checking if an object has all of the provided keys.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **keys**: readonly (`string` \| keyof `E`)[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:678

***

### toContainValue()

> **toContainValue**\<`E`\>(`value`): `R`

Use `.toContainValue` when checking if an object contains the provided value.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **value**: `E`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:699

***

### toContainValues()

> **toContainValues**\<`E`\>(`values`): `R`

Use `.toContainValues` when checking if an object contains all of the provided values.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **values**: readonly `E`[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:706

***

### toEndWith()

> **toEndWith**(`suffix`): `R`

Use `.toEndWith` when checking if a `String` ends with a given `String` suffix.

#### Parameters

• **suffix**: `string`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:799

***

### toEqual()

> **toEqual**\<`E`\>(`expected`): `R`

Used when you want to check that two objects have the same value.
This matcher recursively checks the equality of all fields, rather than checking for object identity.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **expected**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:962

***

### toEqualCaseInsensitive()

> **toEqualCaseInsensitive**(`string`): `R`

Use `.toEqualCaseInsensitive` when checking if a string is equal (===) to another ignoring the casing of both strings.

#### Parameters

• **string**: `string`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:785

***

### toEqualIgnoringWhitespace()

> **toEqualIgnoringWhitespace**(`string`): `R`

Use `.toEqualIgnoringWhitespace` when checking if a `String` is equal (===) to given `String` ignoring white-space.

#### Parameters

• **string**: `string`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:871

***

### toHaveBeenCalled()

> **toHaveBeenCalled**(): `R`

Ensures that a mock function is called.

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:966

***

### toHaveBeenCalledAfter()

> **toHaveBeenCalledAfter**(`mock`, `failIfNoFirstInvocation`?): `R`

Use `.toHaveBeenCalledAfter` when checking if a `Mock` was called after another `Mock`.

Note: Required Jest version >=23

#### Parameters

• **mock**: [`MockInstance`](MockInstance.md)\<`any`, `any`[], `any`\>

• **failIfNoFirstInvocation?**: `boolean`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:593

***

### toHaveBeenCalledBefore()

> **toHaveBeenCalledBefore**(`mock`, `failIfNoSecondInvocation`?): `R`

Use `.toHaveBeenCalledBefore` when checking if a `Mock` was called before another `Mock`.

Note: Required Jest version >=23

#### Parameters

• **mock**: [`MockInstance`](MockInstance.md)\<`any`, `any`[], `any`\>

• **failIfNoSecondInvocation?**: `boolean`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:583

***

### toHaveBeenCalledExactlyOnceWith()

> **toHaveBeenCalledExactlyOnceWith**(...`args`): `R`

Use `.toHaveBeenCalledExactlyOnceWith` to check if a `Mock` was called exactly one time with the expected value.

#### Parameters

• ...**args**: `unknown`[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:603

***

### toHaveBeenCalledOnce()

> **toHaveBeenCalledOnce**(): `R`

Use `.toHaveBeenCalledOnce` to check if a `Mock` was called exactly one time.

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:598

***

### toHaveBeenCalledTimes()

> **toHaveBeenCalledTimes**(`expected`): `R`

Ensures that a mock function is called an exact number of times.

#### Parameters

• **expected**: `number`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:970

***

### toHaveBeenCalledWith()

> **toHaveBeenCalledWith**\<`E`\>(...`params`): `R`

Ensure that a mock function is called with specific arguments.

Optionally, you can provide a type for the expected arguments via a generic.
Note that the type must be either an array or a tuple.

#### Type Parameters

• **E** *extends* `any`[]

#### Parameters

• ...**params**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:978

***

### toHaveBeenLastCalledWith()

> **toHaveBeenLastCalledWith**\<`E`\>(...`params`): `R`

If you have a mock function, you can use `.toHaveBeenLastCalledWith`
to test what arguments it was last called with.

Optionally, you can provide a type for the expected arguments via a generic.
Note that the type must be either an array or a tuple.

#### Type Parameters

• **E** *extends* `any`[]

#### Parameters

• ...**params**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:995

***

### toHaveBeenNthCalledWith()

> **toHaveBeenNthCalledWith**\<`E`\>(`nthCall`, ...`params`): `R`

Ensure that a mock function is called with specific arguments on an Nth call.

Optionally, you can provide a type for the expected arguments via a generic.
Note that the type must be either an array or a tuple.

#### Type Parameters

• **E** *extends* `any`[]

#### Parameters

• **nthCall**: `number`

• ...**params**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:986

***

### toHaveLastReturnedWith()

> **toHaveLastReturnedWith**\<`E`\>(`expected`?): `R`

Use to test the specific value that a mock function last returned.
If the last call to the mock function threw an error, then this matcher will fail
no matter what value you provided as the expected return value.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **expected?**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:1005

***

### toHaveLength()

> **toHaveLength**(`expected`): `R`

Used to check that an object has a `.length` property
and it is set to a certain numeric value.

#### Parameters

• **expected**: `number`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:1010

***

### toHaveNthReturnedWith()

> **toHaveNthReturnedWith**\<`E`\>(`nthCall`, `expected`?): `R`

Use to test the specific value that a mock function returned for the nth call.
If the nth call to the mock function threw an error, then this matcher will fail
no matter what value you provided as the expected return value.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **nthCall**: `number`

• **expected?**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:1020

***

### toHaveProperty()

> **toHaveProperty**\<`E`\>(`propertyPath`, `value`?): `R`

Use to check if property at provided reference keyPath exists for an object.
For checking deeply nested properties in an object you may use dot notation or an array containing
the keyPath for deep references.

Optionally, you can provide a value to check if it's equal to the value present at keyPath
on the target object. This matcher uses 'deep equality' (like `toEqual()`) and recursively checks
the equality of all fields.

#### Type Parameters

• **E** = `any`

#### Parameters

• **propertyPath**: `string` \| readonly `any`[]

• **value?**: `E`

#### Returns

`R`

#### Example

```ts
expect(houseForSale).toHaveProperty('kitchen.area', 20);
```

#### Defined in

node\_modules/@types/jest/index.d.ts:1035

***

### toHaveReturned()

> **toHaveReturned**(): `R`

Use to test that the mock function successfully returned (i.e., did not throw an error) at least one time

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:1039

***

### toHaveReturnedTimes()

> **toHaveReturnedTimes**(`expected`): `R`

Use to ensure that a mock function returned successfully (i.e., did not throw an error) an exact number of times.
Any calls to the mock function that throw an error are not counted toward the number of times the function returned.

#### Parameters

• **expected**: `number`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:1044

***

### toHaveReturnedWith()

> **toHaveReturnedWith**\<`E`\>(`expected`?): `R`

Use to ensure that a mock function returned a specific value.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **expected?**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:1052

***

### toInclude()

> **toInclude**(`substring`): `R`

Use `.toInclude` when checking if a `String` includes the given `String` substring.

#### Parameters

• **substring**: `string`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:806

***

### toIncludeAllMembers()

> **toIncludeAllMembers**\<`E`\>(`members`): `R`

Use `.toIncludeAllMembers` when checking if an `Array` contains all of the same members of a given set.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **members**: readonly `E`[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:497

***

### toIncludeAllPartialMembers()

> **toIncludeAllPartialMembers**\<`E`\>(`members`): `R`

Use `.toIncludeAllPartialMembers` when checking if an `Array` contains all of the same partial members of a given set.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **members**: readonly `E`[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:503

***

### toIncludeAnyMembers()

> **toIncludeAnyMembers**\<`E`\>(`members`): `R`

Use `.toIncludeAnyMembers` when checking if an `Array` contains any of the members of a given set.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **members**: readonly `E`[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:509

***

### toIncludeMultiple()

> **toIncludeMultiple**(`substring`): `R`

Use `.toIncludeMultiple` when checking if a `String` includes all of the given substrings.

#### Parameters

• **substring**: readonly `string`[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:821

***

### toIncludeRepeated()

> **toIncludeRepeated**(`substring`, `times`): `R`

Use `.toIncludeRepeated` when checking if a `String` includes the given `String` substring the correct number of times.

#### Parameters

• **substring**: `string`

• **times**: `number`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:814

***

### toIncludeSameMembers()

> **toIncludeSameMembers**\<`E`\>(`members`): `R`

Use `.toIncludeSameMembers` when checking if two arrays contain equal values, in any order.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **members**: readonly `E`[]

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:515

***

### toMatch()

> **toMatch**(`expected`): `R`

Check that a string matches a regular expression.

#### Parameters

• **expected**: `string` \| `RegExp`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:1056

***

### toMatchInlineSnapshot()

#### toMatchInlineSnapshot(propertyMatchers, snapshot)

> **toMatchInlineSnapshot**\<`U`\>(`propertyMatchers`, `snapshot`?): `R`

This ensures that a value matches the most recent snapshot with property matchers.
Instead of writing the snapshot value to a .snap file, it will be written into the source code automatically.
Check out [the Snapshot Testing guide](http://facebook.github.io/jest/docs/snapshot-testing.html) for more information.

##### Type Parameters

• **U** *extends* \{ \[P in string \| number \| symbol\]: any \}

##### Parameters

• **propertyMatchers**: `Partial`\<`U`\>

• **snapshot?**: `string`

##### Returns

`R`

##### Defined in

node\_modules/@types/jest/index.d.ts:1096

#### toMatchInlineSnapshot(snapshot)

> **toMatchInlineSnapshot**(`snapshot`?): `R`

This ensures that a value matches the most recent snapshot with property matchers.
Instead of writing the snapshot value to a .snap file, it will be written into the source code automatically.
Check out [the Snapshot Testing guide](http://facebook.github.io/jest/docs/snapshot-testing.html) for more information.

##### Parameters

• **snapshot?**: `string`

##### Returns

`R`

##### Defined in

node\_modules/@types/jest/index.d.ts:1102

***

### toMatchObject()

> **toMatchObject**\<`E`\>(`expected`): `R`

Used to check that a JavaScript object matches a subset of the properties of an object

Optionally, you can provide an object to use as Generic type for the expected value.
This ensures that the matching object matches the structure of the provided object-like type.

#### Type Parameters

• **E** *extends* `object` \| `any`[]

#### Parameters

• **expected**: `E`

#### Returns

`R`

#### Example

```ts
type House = {
  bath: boolean;
  bedrooms: number;
  kitchen: {
    amenities: string[];
    area: number;
    wallColor: string;
  }
};

expect(desiredHouse).toMatchObject<House>({...standardHouse, kitchen: {area: 20}}) // wherein standardHouse is some base object of type House
```

#### Defined in

node\_modules/@types/jest/index.d.ts:1078

***

### toMatchSnapshot()

#### toMatchSnapshot(propertyMatchers, snapshotName)

> **toMatchSnapshot**\<`U`\>(`propertyMatchers`, `snapshotName`?): `R`

This ensures that a value matches the most recent snapshot with property matchers.
Check out [the Snapshot Testing guide](http://facebook.github.io/jest/docs/snapshot-testing.html) for more information.

##### Type Parameters

• **U** *extends* \{ \[P in string \| number \| symbol\]: any \}

##### Parameters

• **propertyMatchers**: `Partial`\<`U`\>

• **snapshotName?**: `string`

##### Returns

`R`

##### Defined in

node\_modules/@types/jest/index.d.ts:1084

#### toMatchSnapshot(snapshotName)

> **toMatchSnapshot**(`snapshotName`?): `R`

This ensures that a value matches the most recent snapshot.
Check out [the Snapshot Testing guide](http://facebook.github.io/jest/docs/snapshot-testing.html) for more information.

##### Parameters

• **snapshotName?**: `string`

##### Returns

`R`

##### Defined in

node\_modules/@types/jest/index.d.ts:1089

***

### toPartiallyContain()

> **toPartiallyContain**\<`E`\>(`member`): `R`

Use `.toPartiallyContain` when checking if any array value matches the partial member.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **member**: `E`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:521

***

### toReject()

> **toReject**(): `Promise`\<`R`\>

Use `.toReject` when checking if a promise rejects.

#### Returns

`Promise`\<`R`\>

#### Defined in

node\_modules/jest-extended/types/index.d.ts:773

***

### toResolve()

> **toResolve**(): `Promise`\<`R`\>

Use `.toResolve` when checking if a promise resolves.

#### Returns

`Promise`\<`R`\>

#### Defined in

node\_modules/jest-extended/types/index.d.ts:768

***

### ~~toReturn()~~

> **toReturn**(): `R`

Ensure that a mock function has returned (as opposed to thrown) at least once.

#### Returns

`R`

#### Deprecated

in favor of `toHaveReturned`

#### Defined in

node\_modules/@types/jest/index.d.ts:1108

***

### ~~toReturnTimes()~~

> **toReturnTimes**(`count`): `R`

Ensure that a mock function has returned (as opposed to thrown) a specified number of times.

#### Parameters

• **count**: `number`

#### Returns

`R`

#### Deprecated

in favor of `toHaveReturnedTimes`

#### Defined in

node\_modules/@types/jest/index.d.ts:1114

***

### ~~toReturnWith()~~

> **toReturnWith**\<`E`\>(`value`?): `R`

Ensure that a mock function has returned a specified value at least once.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **value?**: `E`

#### Returns

`R`

#### Deprecated

in favor of `toHaveReturnedWith`

#### Defined in

node\_modules/@types/jest/index.d.ts:1124

***

### toSatisfy()

> **toSatisfy**\<`E`\>(`predicate`): `R`

Use `.toSatisfy` when you want to use a custom matcher by supplying a predicate function that returns a `Boolean`.

#### Type Parameters

• **E** = `any`

#### Parameters

• **predicate**

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:468

***

### toSatisfyAll()

> **toSatisfyAll**\<`E`\>(`predicate`): `R`

Use `.toSatisfyAll` when you want to use a custom matcher by supplying a predicate function that returns a `Boolean` for all values in an array.

#### Type Parameters

• **E** = `any`

#### Parameters

• **predicate**

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:527

***

### toSatisfyAny()

> **toSatisfyAny**(`predicate`): `R`

Use `.toSatisfyAny` when you want to use a custom matcher by supplying a predicate function that returns `true` for any matching value in an array.

#### Parameters

• **predicate**

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:533

***

### toStartWith()

> **toStartWith**(`prefix`): `R`

Use `.toStartWith` when checking if a `String` starts with a given `String` prefix.

#### Parameters

• **prefix**: `string`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:792

***

### toStrictEqual()

> **toStrictEqual**\<`E`\>(`expected`): `R`

Use to test that objects have the same types as well as structure.

Optionally, you can provide a type for the expected value via a generic.
This is particularly useful for ensuring expected objects have the right structure.

#### Type Parameters

• **E** = `any`

#### Parameters

• **expected**: `E`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:1132

***

### toThrow()

> **toThrow**(`error`?): `R`

Used to test that a function throws when it is called.

#### Parameters

• **error?**: `string` \| `RegExp` \| `Error` \| [`Constructable`](Constructable.md)

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:1136

***

### ~~toThrowError()~~

> **toThrowError**(`error`?): `R`

If you want to test that a specific error is thrown inside a function.

#### Parameters

• **error?**: `string` \| `RegExp` \| `Error` \| [`Constructable`](Constructable.md)

#### Returns

`R`

#### Deprecated

in favor of `toThrow`

#### Defined in

node\_modules/@types/jest/index.d.ts:1142

***

### toThrowErrorMatchingInlineSnapshot()

> **toThrowErrorMatchingInlineSnapshot**(`snapshot`?): `R`

Used to test that a function throws a error matching the most recent snapshot when it is called.
Instead of writing the snapshot value to a .snap file, it will be written into the source code automatically.

#### Parameters

• **snapshot?**: `string`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:1151

***

### toThrowErrorMatchingSnapshot()

> **toThrowErrorMatchingSnapshot**(`snapshotName`?): `R`

Used to test that a function throws a error matching the most recent snapshot when it is called.

#### Parameters

• **snapshotName?**: `string`

#### Returns

`R`

#### Defined in

node\_modules/@types/jest/index.d.ts:1146

***

### toThrowWithMessage()

> **toThrowWithMessage**(`type`, `message`): `R`

Use `.toThrowWithMessage` when checking if a callback function throws an error of a given type with a given error message.

#### Parameters

• **type**: (...`args`) => `object` \| (...`args`) => `object` \| (...`args`) => `object`

• **message**: `string` \| `RegExp`

#### Returns

`R`

#### Defined in

node\_modules/jest-extended/types/index.d.ts:829
