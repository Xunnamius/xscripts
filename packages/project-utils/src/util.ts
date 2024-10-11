import type { SetReturnType } from 'type-fest';

/**
 * Return a function's parameters array with the first element omitted.
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParametersNoFirst<T extends (...args: any) => any> =
  Parameters<T> extends [infer _X, ...infer Parameters_] ? Parameters_ : [];

/**
 * Return the synchronous version of a function's call signature.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SyncVersionOf<T extends (...args: any) => any> = SetReturnType<
  T,
  Awaited<ReturnType<T>>
>;
