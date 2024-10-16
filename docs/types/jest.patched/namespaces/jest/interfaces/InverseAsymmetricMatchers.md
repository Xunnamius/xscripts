[**@-xun/scripts**](../../../../../README.md) • **Docs**

***

[@-xun/scripts](../../../../../README.md) / [types/jest.patched](../../../README.md) / [jest](../README.md) / InverseAsymmetricMatchers

# Interface: InverseAsymmetricMatchers()

The `expect` function is used every time you want to test a value.
You will rarely call `expect` by itself.

## Extends

- [`Expect`](Expect.md)

> **InverseAsymmetricMatchers**\<`T`\>(`actual`): [`JestMatchers`](../type-aliases/JestMatchers.md)\<`T`\>

The `expect` function is used every time you want to test a value.
You will rarely call `expect` by itself.

## Type Parameters

• **T** = `any`

## Parameters

• **actual**: `T`

The value to apply matchers against.

## Returns

[`JestMatchers`](../type-aliases/JestMatchers.md)\<`T`\>

## Defined in

node\_modules/jest-extended/types/index.d.ts:880

## Properties

### not

> **not**: [`InverseAsymmetricMatchers`](InverseAsymmetricMatchers.md)

#### Inherited from

[`Expect`](Expect.md).[`not`](Expect.md#not)

#### Defined in

node\_modules/@types/jest/index.d.ts:778

## Methods

### addSnapshotSerializer()

> **addSnapshotSerializer**(`serializer`): `void`

Adds a module to format application-specific data structures for serialization.

#### Parameters

• **serializer**: `Plugin_2`

#### Returns

`void`

#### Inherited from

[`Expect`](Expect.md).[`addSnapshotSerializer`](Expect.md#addsnapshotserializer)

#### Defined in

node\_modules/@types/jest/index.d.ts:759

***

### any()

> **any**(`classType`): `any`

Matches anything that was created with the given constructor.
You can use it inside `toEqual` or `toBeCalledWith` instead of a literal value.

#### Parameters

• **classType**: `any`

#### Returns

`any`

#### Example

```ts
function randocall(fn) {
  return fn(Math.floor(Math.random() * 6 + 1));
}

test('randocall calls its callback with a number', () => {
  const mock = jest.fn();
  randocall(mock);
  expect(mock).toBeCalledWith(expect.any(Number));
});
```

#### Inherited from

[`Expect`](Expect.md).[`any`](Expect.md#any)

#### Defined in

node\_modules/@types/jest/index.d.ts:723

***

### anything()

> **anything**(): `any`

Matches anything but null or undefined. You can use it inside `toEqual` or `toBeCalledWith` instead
of a literal value. For example, if you want to check that a mock function is called with a
non-null argument:

#### Returns

`any`

#### Example

```ts
test('map calls its argument with a non-null argument', () => {
  const mock = jest.fn();
  [1].map(x => mock(x));
  expect(mock).toBeCalledWith(expect.anything());
});
```

#### Inherited from

[`Expect`](Expect.md).[`anything`](Expect.md#anything)

#### Defined in

node\_modules/@types/jest/index.d.ts:706

***

### arrayContaining()

> **arrayContaining**\<`E`\>(`arr`): `any`

`expect.not.arrayContaining(array)` matches a received array which
does not contain all of the elements in the expected array. That is,
the expected array is not a subset of the received array. It is the
inverse of `expect.arrayContaining`.

Optionally, you can provide a type for the elements via a generic.

#### Type Parameters

• **E** = `any`

#### Parameters

• **arr**: readonly `E`[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`arrayContaining`](Expect.md#arraycontaining)

#### Defined in

node\_modules/@types/jest/index.d.ts:654

***

### assertions()

> **assertions**(`num`): `void`

Verifies that a certain number of assertions are called during a test.
This is often useful when testing asynchronous code, in order to
make sure that assertions in a callback actually got called.

#### Parameters

• **num**: `number`

#### Returns

`void`

#### Inherited from

[`Expect`](Expect.md).[`assertions`](Expect.md#assertions)

#### Defined in

node\_modules/@types/jest/index.d.ts:737

***

### closeTo()

> **closeTo**(`num`, `numDigits`?): `any`

Useful when comparing floating point numbers in object properties or array item.
If you need to compare a number, use `.toBeCloseTo` instead.

The optional `numDigits` argument limits the number of digits to check after the decimal point.
For the default value 2, the test criterion is `Math.abs(expected - received) < 0.005` (that is, `10 ** -2 / 2`).

#### Parameters

• **num**: `number`

• **numDigits?**: `number`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`closeTo`](Expect.md#closeto)

#### Defined in

node\_modules/@types/jest/index.d.ts:745

***

### extend()

> **extend**(`obj`): `void`

You can use `expect.extend` to add your own matchers to Jest.

#### Parameters

• **obj**: [`ExpectExtendMap`](ExpectExtendMap.md)

#### Returns

`void`

#### Inherited from

[`Expect`](Expect.md).[`extend`](Expect.md#extend)

#### Defined in

node\_modules/@types/jest/index.d.ts:755

***

### fail()

> **fail**(`message`): `any`

Note: Currently unimplemented
Failing assertion

#### Parameters

• **message**: `string`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`fail`](Expect.md#fail)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:18

***

### getState()

> **getState**(): `MatcherState` & `Record`\<`string`, `any`\>

#### Returns

`MatcherState` & `Record`\<`string`, `any`\>

#### Inherited from

[`Expect`](Expect.md).[`getState`](Expect.md#getstate)

#### Defined in

node\_modules/@types/jest/index.d.ts:781

***

### hasAssertions()

> **hasAssertions**(): `void`

Verifies that at least one assertion is called during a test.
This is often useful when testing asynchronous code, in order to
make sure that assertions in a callback actually got called.

#### Returns

`void`

#### Inherited from

[`Expect`](Expect.md).[`hasAssertions`](Expect.md#hasassertions)

#### Defined in

node\_modules/@types/jest/index.d.ts:751

***

### objectContaining()

> **objectContaining**\<`E`\>(`obj`): `any`

`expect.not.objectContaining(object)` matches any received object
that does not recursively match the expected properties. That is, the
expected object is not a subset of the received object. Therefore,
it matches a received object which contains properties that are not
in the expected object. It is the inverse of `expect.objectContaining`.

Optionally, you can provide a type for the object via a generic.
This ensures that the object contains the desired structure.

#### Type Parameters

• **E** = `object`

#### Parameters

• **obj**: `E`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`objectContaining`](Expect.md#objectcontaining)

#### Defined in

node\_modules/@types/jest/index.d.ts:666

***

### pass()

> **pass**(`message`): `any`

Note: Currently unimplemented
Passing assertion

#### Parameters

• **message**: `string`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`pass`](Expect.md#pass)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:10

***

### setState()

> **setState**(`state`): `void`

#### Parameters

• **state**: `object`

#### Returns

`void`

#### Inherited from

[`Expect`](Expect.md).[`setState`](Expect.md#setstate)

#### Defined in

node\_modules/@types/jest/index.d.ts:780

***

### stringContaining()

> **stringContaining**(`str`): `any`

`expect.not.stringContaining(string)` matches the received string
that does not contain the exact expected string. It is the inverse of
`expect.stringContaining`.

#### Parameters

• **str**: `string`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`stringContaining`](Expect.md#stringcontaining)

#### Defined in

node\_modules/@types/jest/index.d.ts:678

***

### stringMatching()

> **stringMatching**(`str`): `any`

`expect.not.stringMatching(string | regexp)` matches the received
string that does not match the expected regexp. It is the inverse of
`expect.stringMatching`.

#### Parameters

• **str**: `string` \| `RegExp`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`stringMatching`](Expect.md#stringmatching)

#### Defined in

node\_modules/@types/jest/index.d.ts:672

***

### toBeAfter()

> **toBeAfter**(`date`): `any`

Use `.toBeAfter` when checking if a date occurs after `date`.

#### Parameters

• **date**: `Date`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeAfter`](Expect.md#tobeafter)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:57

***

### toBeAfterOrEqualTo()

> **toBeAfterOrEqualTo**(`date`): `any`

Use `.toBeAfterOrEqualTo` when checking if a date equals to or occurs after `date`.

#### Parameters

• **date**: `Date`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeAfterOrEqualTo`](Expect.md#tobeafterorequalto)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:419

***

### toBeArray()

> **toBeArray**(): `any`

Use `.toBeArray` when checking if a value is an `Array`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeArray`](Expect.md#tobearray)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:45

***

### toBeArrayOfSize()

> **toBeArrayOfSize**(`x`): `any`

Use `.toBeArrayOfSize` when checking if a value is an `Array` of size x.

#### Parameters

• **x**: `number`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeArrayOfSize`](Expect.md#tobearrayofsize)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:51

***

### toBeBefore()

> **toBeBefore**(`date`): `any`

Use `.toBeBefore` when checking if a date occurs before `date`.

#### Parameters

• **date**: `Date`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeBefore`](Expect.md#tobebefore)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:63

***

### toBeBeforeOrEqualTo()

> **toBeBeforeOrEqualTo**(`date`): `any`

Use `.toBeBeforeOrEqualTo` when checking if a date equals to or occurs before `date`.

#### Parameters

• **date**: `Date`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeBeforeOrEqualTo`](Expect.md#tobebeforeorequalto)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:413

***

### toBeBetween()

> **toBeBetween**(`startDate`, `endDate`): `any`

Use `.toBeBetween` when checking if a date occurs between `startDate` and `endDate`.

#### Parameters

• **startDate**: `Date`

• **endDate**: `Date`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeBetween`](Expect.md#tobebetween)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:407

***

### toBeBoolean()

> **toBeBoolean**(): `any`

Use `.toBeBoolean` when checking if a value is a `Boolean`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeBoolean`](Expect.md#tobeboolean)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:104

***

### toBeDate()

> **toBeDate**(): `any`

Use `.toBeDate` when checking if a value is a `Date`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeDate`](Expect.md#tobedate)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:119

***

### toBeDateString()

> **toBeDateString**(): `any`

Use `.toBeDateString` when checking if a value is a valid date string.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeDateString`](Expect.md#tobedatestring)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:134

***

### toBeEmpty()

> **toBeEmpty**(): `any`

Use .toBeEmpty when checking if a String '', Array [] or Object {} is empty.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeEmpty`](Expect.md#tobeempty)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:23

***

### toBeEmptyObject()

> **toBeEmptyObject**(): `any`

Use `.toBeEmptyObject` when checking if a value is an empty `Object`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeEmptyObject`](Expect.md#tobeemptyobject)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:395

***

### toBeEven()

> **toBeEven**(): `any`

Use `.toBeEven` when checking if a value is an even `Number`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeEven`](Expect.md#tobeeven)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:199

***

### toBeExtensible()

> **toBeExtensible**(): `any`

Use `.toBeExtensible` when checking if an object is extensible.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeExtensible`](Expect.md#tobeextensible)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:314

***

### toBeFalse()

> **toBeFalse**(): `any`

Use `.toBeFalse` when checking a value is equal (===) to `false`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeFalse`](Expect.md#tobefalse)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:114

***

### toBeFinite()

> **toBeFinite**(): `any`

Use `.toBeFinite` when checking if a value is a `Number`, not `NaN` or `Infinity`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeFinite`](Expect.md#tobefinite)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:184

***

### toBeFrozen()

> **toBeFrozen**(): `any`

Use `.toBeFrozen` when checking if an object is frozen.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeFrozen`](Expect.md#tobefrozen)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:319

***

### toBeFunction()

> **toBeFunction**(): `any`

Use `.toBeFunction` when checking if a value is a `Function`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeFunction`](Expect.md#tobefunction)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:129

***

### toBeHexadecimal()

> **toBeHexadecimal**(): `any`

Use `.toBeHexadecimal` when checking if a value is a valid HTML hex color.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeHexadecimal`](Expect.md#tobehexadecimal)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:139

***

### toBeInRange()

> **toBeInRange**(`min`, `max`): `any`

Use `.toBeInRange` when checking if an array has elements in range min (inclusive) and max (inclusive).

#### Parameters

• **min**: `number`

• **max**: `number`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeInRange`](Expect.md#tobeinrange)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:220

***

### toBeNaN()

> **toBeNaN**(): `any`

Use `.toBeNaN` when checking a value is `NaN`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeNaN`](Expect.md#tobenan)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:179

***

### toBeNegative()

> **toBeNegative**(): `any`

Use `.toBeNegative` when checking if a value is a negative `Number`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeNegative`](Expect.md#tobenegative)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:194

***

### toBeNil()

> **toBeNil**(): `any`

Use `.toBeNil` when checking a value is `null` or `undefined`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeNil`](Expect.md#tobenil)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:34

***

### toBeNumber()

> **toBeNumber**(): `any`

Use `.toBeNumber` when checking if a value is a `Number`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeNumber`](Expect.md#tobenumber)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:174

***

### toBeObject()

> **toBeObject**(): `any`

Use `.toBeObject` when checking if a value is an `Object`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeObject`](Expect.md#tobeobject)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:225

***

### toBeOdd()

> **toBeOdd**(): `any`

Use `.toBeOdd` when checking if a value is an odd `Number`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeOdd`](Expect.md#tobeodd)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:204

***

### toBeOneOf()

> **toBeOneOf**\<`E`\>(`members`): `any`

Use .toBeOneOf when checking if a value is a member of a given Array.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **members**: readonly `E`[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeOneOf`](Expect.md#tobeoneof)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:29

***

### toBePositive()

> **toBePositive**(): `any`

Use `.toBePositive` when checking if a value is a positive `Number`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBePositive`](Expect.md#tobepositive)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:189

***

### toBeSealed()

> **toBeSealed**(): `any`

Use `.toBeSealed` when checking if an object is sealed.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeSealed`](Expect.md#tobesealed)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:324

***

### toBeString()

> **toBeString**(): `any`

Use `.toBeString` when checking if a value is a `String`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeString`](Expect.md#tobestring)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:339

***

### toBeSymbol()

> **toBeSymbol**(): `any`

Use `.toBeSymbol` when checking if a value is a `Symbol`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeSymbol`](Expect.md#tobesymbol)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:400

***

### toBeTrue()

> **toBeTrue**(): `any`

Use `.toBeTrue` when checking a value is equal (===) to `true`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeTrue`](Expect.md#tobetrue)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:109

***

### toBeValidDate()

> **toBeValidDate**(): `any`

Use `.toBeValidDate` when checking if a value is a `valid Date`.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeValidDate`](Expect.md#tobevaliddate)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:124

***

### toBeWithin()

> **toBeWithin**(`start`, `end`): `any`

Use `.toBeWithin` when checking if a number is in between the given bounds of: start (inclusive) and end (exclusive).

#### Parameters

• **start**: `number`

• **end**: `number`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toBeWithin`](Expect.md#tobewithin)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:212

***

### toContainAllEntries()

> **toContainAllEntries**\<`E`\>(`entries`): `any`

Use `.toContainAllEntries` when checking if an object only contains all of the provided entries.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **entries**: readonly readonly [keyof `E`, `E`\[keyof `E`\]][]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainAllEntries`](Expect.md#tocontainallentries)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:302

***

### toContainAllKeys()

> **toContainAllKeys**\<`E`\>(`keys`): `any`

Use `.toContainAllKeys` when checking if an object only contains all of the provided keys.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **keys**: readonly (`string` \| keyof `E`)[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainAllKeys`](Expect.md#tocontainallkeys)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:246

***

### toContainAllValues()

> **toContainAllValues**\<`E`\>(`values`): `any`

Use `.toContainAllValues` when checking if an object only contains all of the provided values.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **values**: readonly `E`[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainAllValues`](Expect.md#tocontainallvalues)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:274

***

### toContainAnyEntries()

> **toContainAnyEntries**\<`E`\>(`entries`): `any`

Use `.toContainAnyEntries` when checking if an object contains at least one of the provided entries.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **entries**: readonly readonly [keyof `E`, `E`\[keyof `E`\]][]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainAnyEntries`](Expect.md#tocontainanyentries)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:309

***

### toContainAnyKeys()

> **toContainAnyKeys**\<`E`\>(`keys`): `any`

Use `.toContainAnyKeys` when checking if an object contains at least one of the provided keys.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **keys**: readonly (`string` \| keyof `E`)[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainAnyKeys`](Expect.md#tocontainanykeys)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:253

***

### toContainAnyValues()

> **toContainAnyValues**\<`E`\>(`values`): `any`

Use `.toContainAnyValues` when checking if an object contains at least one of the provided values.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **values**: readonly `E`[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainAnyValues`](Expect.md#tocontainanyvalues)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:281

***

### toContainEntries()

> **toContainEntries**\<`E`\>(`entries`): `any`

Use `.toContainEntries` when checking if an object contains all of the provided entries.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **entries**: readonly readonly [keyof `E`, `E`\[keyof `E`\]][]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainEntries`](Expect.md#tocontainentries)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:295

***

### toContainEntry()

> **toContainEntry**\<`E`\>(`entry`): `any`

Use `.toContainEntry` when checking if an object contains the provided entry.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **entry**: readonly [keyof `E`, `E`\[keyof `E`\]]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainEntry`](Expect.md#tocontainentry)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:288

***

### toContainKey()

> **toContainKey**(`key`): `any`

Use `.toContainKey` when checking if an object contains the provided key.

#### Parameters

• **key**: `string`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainKey`](Expect.md#tocontainkey)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:232

***

### toContainKeys()

> **toContainKeys**\<`E`\>(`keys`): `any`

Use `.toContainKeys` when checking if an object has all of the provided keys.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **keys**: readonly (`string` \| keyof `E`)[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainKeys`](Expect.md#tocontainkeys)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:239

***

### toContainValue()

> **toContainValue**\<`E`\>(`value`): `any`

Use `.toContainValue` when checking if an object contains the provided value.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **value**: `E`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainValue`](Expect.md#tocontainvalue)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:260

***

### toContainValues()

> **toContainValues**\<`E`\>(`values`): `any`

Use `.toContainValues` when checking if an object contains all of the provided values.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **values**: readonly `E`[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toContainValues`](Expect.md#tocontainvalues)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:267

***

### toEndWith()

> **toEndWith**(`suffix`): `any`

Use `.toEndWith` when checking if a `String` ends with a given `String` suffix.

#### Parameters

• **suffix**: `string`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toEndWith`](Expect.md#toendwith)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:360

***

### toEqualCaseInsensitive()

> **toEqualCaseInsensitive**(`string`): `any`

Use `.toEqualCaseInsensitive` when checking if a string is equal (===) to another ignoring the casing of both strings.

#### Parameters

• **string**: `string`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toEqualCaseInsensitive`](Expect.md#toequalcaseinsensitive)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:346

***

### toEqualIgnoringWhitespace()

> **toEqualIgnoringWhitespace**(`string`): `any`

Use `.toEqualIgnoringWhitespace` when checking if a `String` is equal (===) to given `String` ignoring white-space.

#### Parameters

• **string**: `string`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toEqualIgnoringWhitespace`](Expect.md#toequalignoringwhitespace)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:426

***

### toHaveBeenCalledAfter()

> **toHaveBeenCalledAfter**(`mock`, `failIfNoFirstInvocation`?): `any`

Use `.toHaveBeenCalledAfter` when checking if a `Mock` was called after another `Mock`.

Note: Required Jest version >=23

#### Parameters

• **mock**: [`MockInstance`](MockInstance.md)\<`any`, `any`[], `any`\>

• **failIfNoFirstInvocation?**: `boolean`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toHaveBeenCalledAfter`](Expect.md#tohavebeencalledafter)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:159

***

### toHaveBeenCalledBefore()

> **toHaveBeenCalledBefore**(`mock`, `failIfNoSecondInvocation`?): `any`

Use `.toHaveBeenCalledBefore` when checking if a `Mock` was called before another `Mock`.

Note: Required Jest version >=23

#### Parameters

• **mock**: [`MockInstance`](MockInstance.md)\<`any`, `any`[], `any`\>

• **failIfNoSecondInvocation?**: `boolean`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toHaveBeenCalledBefore`](Expect.md#tohavebeencalledbefore)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:149

***

### toHaveBeenCalledExactlyOnceWith()

> **toHaveBeenCalledExactlyOnceWith**(...`args`): `any`

Use `.toHaveBeenCalledExactlyOnceWith` to check if a `Mock` was called exactly one time with the expected value.

#### Parameters

• ...**args**: `unknown`[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toHaveBeenCalledExactlyOnceWith`](Expect.md#tohavebeencalledexactlyoncewith)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:169

***

### toHaveBeenCalledOnce()

> **toHaveBeenCalledOnce**(): `any`

Use `.toHaveBeenCalledOnce` to check if a `Mock` was called exactly one time.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toHaveBeenCalledOnce`](Expect.md#tohavebeencalledonce)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:164

***

### toInclude()

> **toInclude**(`substring`): `any`

Use `.toInclude` when checking if a `String` includes the given `String` substring.

#### Parameters

• **substring**: `string`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toInclude`](Expect.md#toinclude)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:367

***

### toIncludeAllMembers()

> **toIncludeAllMembers**\<`E`\>(`members`): `any`

Use `.toIncludeAllMembers` when checking if an `Array` contains all of the same members of a given set.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **members**: readonly `E`[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toIncludeAllMembers`](Expect.md#toincludeallmembers)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:69

***

### toIncludeAnyMembers()

> **toIncludeAnyMembers**\<`E`\>(`members`): `any`

Use `.toIncludeAnyMembers` when checking if an `Array` contains any of the members of a given set.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **members**: readonly `E`[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toIncludeAnyMembers`](Expect.md#toincludeanymembers)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:75

***

### toIncludeMultiple()

> **toIncludeMultiple**(`substring`): `any`

Use `.toIncludeMultiple` when checking if a `String` includes all of the given substrings.

#### Parameters

• **substring**: readonly `string`[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toIncludeMultiple`](Expect.md#toincludemultiple)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:382

***

### toIncludeRepeated()

> **toIncludeRepeated**(`substring`, `times`): `any`

Use `.toIncludeRepeated` when checking if a `String` includes the given `String` substring the correct number of times.

#### Parameters

• **substring**: `string`

• **times**: `number`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toIncludeRepeated`](Expect.md#toincluderepeated)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:375

***

### toIncludeSameMembers()

> **toIncludeSameMembers**\<`E`\>(`members`): `any`

Use `.toIncludeSameMembers` when checking if two arrays contain equal values, in any order.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **members**: readonly `E`[]

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toIncludeSameMembers`](Expect.md#toincludesamemembers)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:81

***

### toPartiallyContain()

> **toPartiallyContain**\<`E`\>(`member`): `any`

Use `.toPartiallyContain` when checking if any array value matches the partial member.

#### Type Parameters

• **E** = `unknown`

#### Parameters

• **member**: `E`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toPartiallyContain`](Expect.md#topartiallycontain)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:87

***

### toReject()

> **toReject**(): `any`

Use `.toReject` when checking if a promise rejects.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toReject`](Expect.md#toreject)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:334

***

### toResolve()

> **toResolve**(): `any`

Use `.toResolve` when checking if a promise resolves.

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toResolve`](Expect.md#toresolve)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:329

***

### toSatisfy()

> **toSatisfy**\<`E`\>(`predicate`): `any`

Use `.toSatisfy` when you want to use a custom matcher by supplying a predicate function that returns a `Boolean`.

#### Type Parameters

• **E** = `any`

#### Parameters

• **predicate**

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toSatisfy`](Expect.md#tosatisfy)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:40

***

### toSatisfyAll()

> **toSatisfyAll**\<`E`\>(`predicate`): `any`

Use `.toSatisfyAll` when you want to use a custom matcher by supplying a predicate function that returns a `Boolean` for all values in an array.

#### Type Parameters

• **E** = `any`

#### Parameters

• **predicate**

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toSatisfyAll`](Expect.md#tosatisfyall)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:93

***

### toSatisfyAny()

> **toSatisfyAny**(`predicate`): `any`

Use `.toSatisfyAny` when you want to use a custom matcher by supplying a predicate function that returns `true` for any matching value in an array.

#### Parameters

• **predicate**

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toSatisfyAny`](Expect.md#tosatisfyany)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:99

***

### toStartWith()

> **toStartWith**(`prefix`): `any`

Use `.toStartWith` when checking if a `String` starts with a given `String` prefix.

#### Parameters

• **prefix**: `string`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toStartWith`](Expect.md#tostartwith)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:353

***

### toThrowWithMessage()

> **toThrowWithMessage**(`type`, `message`): `any`

Use `.toThrowWithMessage` when checking if a callback function throws an error of a given type with a given error message.

#### Parameters

• **type**

• **message**: `string` \| `RegExp`

#### Returns

`any`

#### Inherited from

[`Expect`](Expect.md).[`toThrowWithMessage`](Expect.md#tothrowwithmessage)

#### Defined in

node\_modules/jest-extended/types/index.d.ts:390
