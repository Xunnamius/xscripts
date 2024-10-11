import { debugFactory } from 'multiverse#debug';

import type {
  Options,
  Result,
  ResultPromise
} from 'execa' with { 'resolution-mode': 'import' };

import type { Merge, Promisable } from 'type-fest';

const debug = debugFactory('@-xun/run:runtime');

export type { Subprocess } from 'execa' with { 'resolution-mode': 'import' };

export type RunOptions = Options & {
  /**
   * Access the {@link RunIntermediateReturnType} object, a thin wrapper around
   * execa's {@link ResultPromise}, via this callback function.
   */
  useIntermediate?: (intermediateResult: RunIntermediateReturnType) => Promisable<void>;
};

export type RunReturnType<OptionsType extends RunOptions = RunOptions> = Merge<
  Result<OptionsType>,
  { stdout: string; stderr: string }
>;

export type RunIntermediateReturnType<OptionsType extends RunOptions = RunOptions> =
  ResultPromise<OptionsType>;

// TODO: merge with the "run" from test/setup.ts that includes debugging by
// TODO: default

/**
 * Runs (executes) `file` with the given `args` with respect to the given
 * `options`.
 *
 * Note that, by default, this function rejects on a non-zero exit code.
 * Set `reject: false` to override this, or use {@link runNoRejectOnBadExit}.
 */
export async function run(
  file: string,
  args?: string[],
  { useIntermediate, ...execaOptions }: RunOptions = {}
): Promise<RunReturnType> {
  debug(`executing command: ${file}${args ? ` ${args.join(' ')}` : ''}`);

  const intermediateResult = (await import('execa')).execa(file, args, execaOptions);
  await useIntermediate?.(intermediateResult);

  const result = await intermediateResult;
  const returnValue = {
    ...result,
    stdout: result.stdout?.toString() ?? '',
    stderr: result.stderr?.toString() ?? ''
  };

  debug('execution result: %O', returnValue);
  return returnValue;
}

/**
 * Runs (executes) `file` with the given `args` with respect to the given
 * `options` (merged with `{ stdout: 'inherit', stderr: 'inherit' }`).
 *
 * Note that, by default, this function rejects on a non-zero exit code.
 * Set `reject: false` to override this, or use {@link runNoRejectOnBadExit}.
 */
export async function runWithInheritedIo(
  ...[file, args, options]: Parameters<typeof run>
) {
  return run(file, args, { ...options, stdout: 'inherit', stderr: 'inherit' }) as Promise<
    RunReturnType & { stdout: never; stderr: never; all: never }
  >;
}

/**
 * Runs (executes) `file` with the given `args` with respect to the given
 * `options`. This function DOES NOT REJECT on a non-zero exit code.
 */
export async function runNoRejectOnBadExit(
  ...[file, args, options]: Parameters<typeof run>
) {
  return run(file, args, { ...options, reject: false });
}

/**
 * Returns a function that, when called, runs (executes) `file` with the given
 * `args` with respect to the given `options`. These parameters can be
 * overridden during individual invocations.
 */
export function runnerFactory(file: string, args?: string[], options?: RunOptions) {
  const factoryArgs = args;
  const factoryOptions = options;

  return (args?: string[], options?: RunOptions) =>
    run(file, args ?? factoryArgs, { ...factoryOptions, ...options });
}
