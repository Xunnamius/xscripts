import { $executionContext, type Arguments } from '@black-flag/core';
import { isCommandNotImplementedError } from '@black-flag/core/util';

import {
  withStandardBuilder,
  type StandardCommonCliArguments,
  type StandardExecutionContext
} from '#cli-utils src/extensions.ts';

const expectedStandardCommonCliArguments = {
  hush: {
    boolean: true,
    default: false,
    description: 'Set output to be somewhat less verbose'
  },
  quiet: {
    boolean: true,
    default: false,
    description: 'Set output to be dramatically less verbose (implies --hush)'
  },
  silent: {
    boolean: true,
    default: false,
    description: 'No output will be generated (implies --quiet)'
  }
};

describe('::withStandardBuilder', () => {
  it('throws CommandNotImplementedError if no customHandler given', async () => {
    expect.hasAssertions();

    const [blackFlag, argv] = makeMocks();
    const [builder, withHandlerExtensions] = withStandardBuilder();

    builder(blackFlag, false, undefined);
    builder(blackFlag, false, argv);

    await expect(withHandlerExtensions()(argv)).rejects.toSatisfy(
      isCommandNotImplementedError
    );
  });

  it('accepts custom builder function and object', async () => {
    expect.hasAssertions();

    const [blackFlag, argv] = makeMocks();
    const [builder] = withStandardBuilder({ x: {} });
    const firstPass = builder(blackFlag, false, undefined);
    const secondPass = builder(blackFlag, false, argv);

    expect(firstPass).toStrictEqual({
      ...expectedStandardCommonCliArguments,
      x: {}
    });

    expect(firstPass).toStrictEqual(secondPass);
  });

  it('additionalCommonOptions adds "version" to top of common options group and others at the bottom', async () => {
    expect.hasAssertions();

    const group = jest.fn();
    const [blackFlag, argv] = makeMocks({ group });
    const [builder] = withStandardBuilder(
      {},
      { additionalCommonOptions: ['one', 'version', 'two', 'three'] }
    );

    builder(blackFlag, false, undefined);
    builder(blackFlag, false, argv);

    expect(group.mock.calls).toStrictEqual([
      [
        ['help', 'version', 'hush', 'quiet', 'silent', 'one', 'two', 'three'],
        'Common Options:'
      ],
      [
        ['help', 'version', 'hush', 'quiet', 'silent', 'one', 'two', 'three'],
        'Common Options:'
      ]
    ]);
  });

  it('disableAutomaticGrouping is passed through', async () => {
    expect.hasAssertions();

    const group = jest.fn();
    const [blackFlag, argv] = makeMocks();
    const [builder] = withStandardBuilder({ x: {}, y: {} });

    builder(blackFlag, false, undefined);
    builder(blackFlag, false, argv);

    expect(group.mock.calls).toStrictEqual([]);
  });

  it('silent, quiet, and hush properly imply one-another and update state', async () => {
    expect.hasAssertions();

    {
      const [blackFlag, argv] = makeMocks({
        dummyArgv: { hush: true, quiet: false, silent: false },
        defaultedDummyArgs: ['quiet', 'silent']
      });

      const [builder, withHandlerExtensions] = withStandardBuilder();

      builder(blackFlag, false, undefined);
      builder(blackFlag, false, argv);

      await withHandlerExtensions(({ hush, quiet, silent, [$executionContext]: ctx }) => {
        expect(hush).toBeTrue();
        expect(quiet).toBeFalse();
        expect(silent).toBeFalse();

        expect(ctx.state.isHushed).toBeTrue();
        expect(ctx.state.isQuieted).toBeUndefined();
        expect(ctx.state.isSilenced).toBeUndefined();
      })(argv);
    }

    {
      const [blackFlag, argv] = makeMocks({
        dummyArgv: { quiet: true, hush: false, silent: false },
        defaultedDummyArgs: ['hush', 'silent']
      });

      const [builder, withHandlerExtensions] = withStandardBuilder();

      builder(blackFlag, false, undefined);
      builder(blackFlag, false, argv);

      await withHandlerExtensions(({ hush, quiet, silent, [$executionContext]: ctx }) => {
        expect(hush).toBeTrue();
        expect(quiet).toBeTrue();
        expect(silent).toBeFalse();

        expect(ctx.state.isHushed).toBeTrue();
        expect(ctx.state.isQuieted).toBeTrue();
        expect(ctx.state.isSilenced).toBeUndefined();
      })(argv);
    }

    {
      const [blackFlag, argv] = makeMocks({
        dummyArgv: { silent: true, hush: false, quiet: false },
        defaultedDummyArgs: ['hush', 'quiet']
      });

      const [builder, withHandlerExtensions] = withStandardBuilder();

      builder(blackFlag, false, undefined);
      builder(blackFlag, false, argv);

      await withHandlerExtensions(({ hush, quiet, silent, [$executionContext]: ctx }) => {
        expect(hush).toBeTrue();
        expect(quiet).toBeTrue();
        expect(silent).toBeTrue();

        expect(ctx.state.isHushed).toBeTrue();
        expect(ctx.state.isQuieted).toBeTrue();
        expect(ctx.state.isSilenced).toBeTrue();
      })(argv);
    }
  });
});

function makeMocks(
  options: {
    group?: typeof jest.fn;
    dummyArgv?: Partial<StandardCommonCliArguments> & Record<string, unknown>;
    defaultedDummyArgs?: string[];
  } = {}
) {
  const {
    dummyArgv,
    group = jest.fn(),
    defaultedDummyArgs = dummyArgv === undefined ? ['hush', 'quiet', 'silent'] : []
  } = options;

  return [
    {
      group,
      updateStrings: jest.fn(),
      parserConfiguration: jest.fn(),
      getInternalMethods() {
        return {
          getParserConfiguration() {
            return {};
          }
        };
      },
      parsed: {
        defaulted: Object.fromEntries(defaultedDummyArgs.map((name) => [name, true]))
      }
    } as unknown as Parameters<ReturnType<typeof withStandardBuilder>[0]>[0],
    Object.assign(
      {
        _: [],
        $0: 'fake'
      },
      dummyArgv ?? { hush: false, quiet: false, silent: false },
      {
        [$executionContext]: {
          commands: new Map(),
          debug: jest.fn(),
          state: {}
        } as unknown as StandardExecutionContext
      }
    ) as Arguments<Required<NonNullable<typeof dummyArgv>>, StandardExecutionContext>
  ] as const;
}
