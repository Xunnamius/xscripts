/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Arguments } from '@black-flag/core';
import { type ExecutionContext } from '@black-flag/core/util';
import { ListrErrorTypes } from 'listr2';

import { createDebugLogger, createGenericLogger, TAB } from 'multiverse+rejoinder';
import { withMockedOutput } from 'multiverse+test-utils';

import {
  makeStandardConfigureErrorHandlingEpilogue,
  makeStandardConfigureExecutionContext
} from 'rootverse+cli-utils:src/configure.ts';

import { type StandardExecutionContext } from 'rootverse+cli-utils:src/extensions.ts';

import type { PartialDeep } from 'type-fest';

const namespace = { namespace: 'test' };

describe('::makeStandardConfigureExecutionContext', () => {
  it('returns expected context by default', async () => {
    expect.hasAssertions();
    expect(
      makeStandardConfigureExecutionContext({
        rootDebugLogger: 2 as any,
        rootGenericLogger: 3 as any
      })({ a: 1, state: { b: 1 } } as any)
    ).toStrictEqual({
      a: 1,
      log: 3,
      debug_: 2,
      state: {
        b: 1,
        isSilenced: false,
        isQuieted: false,
        isHushed: false,
        startTime: expect.any(Date)
      }
    });
  });

  it('returns expected context when withListr2Support is enabled', async () => {
    expect.hasAssertions();
    expect(
      makeStandardConfigureExecutionContext({
        rootDebugLogger: 2 as any,
        rootGenericLogger: 3 as any,
        withListr2Support: true
      })({ a: 1, state: { b: 1 } } as any)
    ).toStrictEqual({
      a: 1,
      log: 3,
      debug_: 2,
      taskManager: expect.anything(),
      state: {
        b: 1,
        isSilenced: false,
        isQuieted: false,
        isHushed: false,
        startTime: expect.any(Date)
      }
    });
  });
});

describe('::makeStandardConfigureErrorHandlingEpilogue', () => {
  it('outputs main error message, causal stack, and task errors by default', async () => {
    expect.hasAssertions();

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: true });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(meta, argv, context);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)],
          [''],
          [expect.stringContaining('test::<error> ❌ Fatal task errors:')],
          [expect.stringContaining(`test::<error> ${TAB}❗ Dummy task error`)]
        ]);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: false });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(meta, argv, context);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)]
        ]);
      });
    }
  });

  it('outputs additional newline when called after help text has been output', async () => {
    expect.hasAssertions();

    {
      const { meta, argv, context } = await makeMocks({
        withListr2Support: true,
        state: { didOutputHelpOrVersionText: true }
      });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(meta, argv, context);

        expect(errorSpy.mock.calls).toStrictEqual([
          [''],
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)],
          [''],
          [expect.stringContaining('test::<error> ❌ Fatal task errors:')],
          [expect.stringContaining(`test::<error> ${TAB}❗ Dummy task error`)]
        ]);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({
        withListr2Support: false,
        state: { didOutputHelpOrVersionText: true }
      });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(meta, argv, context);

        expect(errorSpy.mock.calls).toStrictEqual([
          [''],
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)]
        ]);
      });
    }
  });

  it('outputs nothing when silenced', async () => {
    expect.hasAssertions();

    const state: Partial<StandardExecutionContext['state']> = {
      isHushed: true,
      isQuieted: true,
      isSilenced: true
    };

    {
      const { meta, argv, context } = await makeMocks({
        withListr2Support: true,
        state
      });

      await withMockedOutput(async () => {
        await makeStandardConfigureErrorHandlingEpilogue()(meta, argv, context);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({
        withListr2Support: false,
        state
      });

      await withMockedOutput(async () => {
        await makeStandardConfigureErrorHandlingEpilogue()(meta, argv, context);
      });
    }
  });

  it('only outputs main error message when quieted', async () => {
    expect.hasAssertions();

    const state: Partial<StandardExecutionContext['state']> = {
      isHushed: true,
      isQuieted: true,
      isSilenced: false
    };

    {
      const { meta, argv, context } = await makeMocks({
        withListr2Support: true,
        state
      });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(meta, argv, context);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')]
        ]);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({
        withListr2Support: false,
        state
      });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(meta, argv, context);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')]
        ]);
      });
    }
  });

  it('only outputs main error message and causal stack when hushed', async () => {
    expect.hasAssertions();

    const state: Partial<StandardExecutionContext['state']> = {
      isHushed: true,
      isQuieted: false,
      isSilenced: false
    };

    {
      const { meta, argv, context } = await makeMocks({
        withListr2Support: true,
        state
      });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(meta, argv, context);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)]
        ]);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({
        withListr2Support: false,
        state
      });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(meta, argv, context);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)]
        ]);
      });
    }
  });

  it('does not output anything when the error message is empty', async () => {
    expect.hasAssertions();

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: true });

      await withMockedOutput(async () => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          { ...meta, message: '' },
          argv,
          context
        );
      });
    }

    {
      const { meta, argv, context } = await makeMocks({ withTaskManagerErrors: false });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          { ...meta, message: '' },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([]);
      });
    }
  });

  it('does not include duplicate messages in causal stack output (including doubly-nested main message)', async () => {
    expect.hasAssertions();

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: true });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          { ...meta, message: '1' },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: 1')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)],
          [''],
          [expect.stringContaining('test::<error> ❌ Fatal task errors:')],
          [expect.stringContaining(`test::<error> ${TAB}❗ Dummy task error`)]
        ]);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: false });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          { ...meta, message: '1' },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: 1')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)]
        ]);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: true });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          {
            ...meta,
            error: new Error('1', {
              cause: new Error('1', {
                cause: new Error('2', {
                  cause: new Error('2', {
                    cause: new Error('1', {
                      cause: new Error('3', {
                        cause: new Error('3', { cause: new Error('final') })
                      })
                    })
                  })
                })
              })
            })
          },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  final`)],
          [''],
          [expect.stringContaining('test::<error> ❌ Fatal task errors:')],
          [expect.stringContaining(`test::<error> ${TAB}❗ Dummy task error`)]
        ]);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: true });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          { ...meta, error: new Error(meta.message, { cause: meta.message }) },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Fatal task errors:')],
          [expect.stringContaining(`test::<error> ${TAB}❗ Dummy task error`)]
        ]);
      });
    }
  });

  it('outputs causal stack properly in the presence of non-Error causes', async () => {
    expect.hasAssertions();

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: true });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          {
            ...meta,
            message: '1',
            error: new Error('1', {
              cause: new Error('2', {
                cause: new Error('3', { cause: 'something awful' })
              })
            })
          },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: 1')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  something awful`)],
          [''],
          [expect.stringContaining('test::<error> ❌ Fatal task errors:')],
          [expect.stringContaining(`test::<error> ${TAB}❗ Dummy task error`)]
        ]);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: false });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          {
            ...meta,
            message: '1',
            error: new Error('1', {
              cause: new Error('2', {
                cause: new Error('3', { cause: 'something awful' })
              })
            })
          },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: 1')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  something awful`)]
        ]);
      });
    }
  });

  it('does not output causal stack in the presence of non-Error main error', async () => {
    expect.hasAssertions();

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: true });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          {
            ...meta,
            message: '1',
            error: '1'
          },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: 1')],
          [''],
          [expect.stringContaining('test::<error> ❌ Fatal task errors:')],
          [expect.stringContaining(`test::<error> ${TAB}❗ Dummy task error`)]
        ]);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: false });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          {
            ...meta,
            message: '1',
            error: '1'
          },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: 1')]
        ]);
      });
    }

    // * These are technically impossible conditions anyway

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: true });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          {
            ...meta,
            error: '1'
          },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Fatal task errors:')],
          [expect.stringContaining(`test::<error> ${TAB}❗ Dummy task error`)]
        ]);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: false });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          {
            ...meta,
            error: '1'
          },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')]
        ]);
      });
    }
  });

  it('includes final cause in causal stack output even if non-Error', async () => {
    expect.hasAssertions();

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: true });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          {
            ...meta,
            error: new Error('1', {
              cause: new Error('1', {
                cause: new Error('2', {
                  cause: new Error('2', {
                    cause: new Error('1', {
                      cause: new Error('3', {
                        cause: new Error('3', { cause: 'final' })
                      })
                    })
                  })
                })
              })
            })
          },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  final`)],
          [''],
          [expect.stringContaining('test::<error> ❌ Fatal task errors:')],
          [expect.stringContaining(`test::<error> ${TAB}❗ Dummy task error`)]
        ]);
      });
    }
  });

  it('clips causal stack output when receiving more than MAX_LOG_ERROR_ENTRIES non-duplicate causes', async () => {
    expect.hasAssertions();

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: true });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          {
            ...meta,
            error: new Error('message', {
              cause: new Error('1', {
                cause: new Error('1', {
                  cause: new Error('2', {
                    cause: new Error('2', {
                      cause: new Error('3', {
                        cause: new Error('3', {
                          cause: new Error('4', {
                            cause: new Error('5', {
                              cause: new Error('6', {
                                cause: new Error('7', {
                                  cause: new Error('8', {
                                    cause: new Error('9', {
                                      cause: new Error('10', { cause: 'hidden' })
                                    })
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  4`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  5`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  6`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  7`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  8`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  9`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  10`)],
          [
            expect.stringContaining('test::<error> (remaining entries have been hidden)')
          ],
          [''],
          [expect.stringContaining('test::<error> ❌ Fatal task errors:')],
          [expect.stringContaining(`test::<error> ${TAB}❗ Dummy task error`)]
        ]);
      });
    }

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: false });

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(
          {
            ...meta,
            error: new Error('message', {
              cause: new Error('1', {
                cause: new Error('1', {
                  cause: new Error('2', {
                    cause: new Error('2', {
                      cause: new Error('3', {
                        cause: new Error('3', {
                          cause: new Error('4', {
                            cause: new Error('5', {
                              cause: new Error('6', {
                                cause: new Error('7', {
                                  cause: new Error('8', {
                                    cause: new Error('9', {
                                      cause: new Error('10', {
                                        cause: new Error('hidden')
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          },
          argv,
          context
        );

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Causal stack:')],
          [expect.stringContaining(`test::<error> ${TAB}⮕  1`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  2`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  3`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  4`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  5`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  6`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  7`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  8`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  9`)],
          [expect.stringContaining(`test::<error> ${TAB}⮕  10`)],
          [expect.stringContaining('test::<error> (remaining entries have been hidden)')]
        ]);
      });
    }
  });

  it('outputs all task errors except those that failed without error', async () => {
    expect.hasAssertions();

    {
      const { meta, argv, context } = await makeMocks({ withListr2Support: true });
      meta.error = new Error('message');
      context.taskManager!.errors = [
        { message: '1' },
        { message: '2' },
        { message: '2' },
        { message: '3', type: ListrErrorTypes.HAS_FAILED_WITHOUT_ERROR }
      ] as NonNullable<typeof context.taskManager>['errors'];

      await withMockedOutput(async ({ errorSpy }) => {
        await makeStandardConfigureErrorHandlingEpilogue()(meta, argv, context);

        expect(errorSpy.mock.calls).toStrictEqual([
          [expect.stringContaining('test::<error> ❌ Execution failed: message')],
          [''],
          [expect.stringContaining('test::<error> ❌ Fatal task errors:')],
          [expect.stringContaining(`test::<error> ${TAB}❗ 1`)],
          [expect.stringContaining(`test::<error> ${TAB}❗ 2`)],
          [expect.stringContaining(`test::<error> ${TAB}❗ 2`)]
        ]);
      });
    }
  });
});

async function makeMocks({
  state = {},
  withListr2Support = false,
  withTaskManagerErrors = withListr2Support
}: {
  state?: PartialDeep<StandardExecutionContext['state']>;
  withListr2Support?: boolean;
  withTaskManagerErrors?: boolean | { message: string }[];
} = {}) {
  const mocks = {
    meta: {
      message: 'message',
      error: new Error('1', { cause: new Error('2', { cause: new Error('3') }) }),
      exitCode: 0
    },
    argv: {} as Arguments,
    context: await makeStandardConfigureExecutionContext({
      rootDebugLogger: createDebugLogger(namespace),
      rootGenericLogger: createGenericLogger(namespace),
      withListr2Support
    })({} as ExecutionContext)
  };

  Object.assign(mocks.context.state, state);

  if (mocks.context.taskManager && withTaskManagerErrors) {
    mocks.context.taskManager.errors = (
      withTaskManagerErrors === true
        ? [{ message: 'dummy task error' }]
        : withTaskManagerErrors
    ) as typeof mocks.context.taskManager.errors;
  }

  return mocks;
}
