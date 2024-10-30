import { debug as oldDebug } from 'debug';

import {
  $instances,
  debugFactory,
  extendDebugger,
  finalizeDebugger
} from 'multiverse#debug';

import {
  expectExtendedDebugger,
  expectUnextendableDebugger
} from '#debug test/helpers.ts';

const factoryLogFn = jest.fn();
debugFactory.log = factoryLogFn;

afterEach(() => debugFactory.disable());

describe('::debugFactory', () => {
  it('is not enabled when first initialized', async () => {
    expect.hasAssertions();

    expect(debugFactory.enabled('namespace')).toBeFalse();

    debugFactory('namespace');

    expect(debugFactory.enabled('namespace')).toBeFalse();

    debugFactory.enable('namespace');

    expect(debugFactory.enabled('namespace')).toBeTrue();
  });

  it('returns ExtendedDebugger instances', async () => {
    expect.hasAssertions();
    expectExtendedDebugger(debugFactory('namespace'));
  });

  it('always appends a separator character to root namespace arguments that do not include one', () => {
    expect.hasAssertions();

    const log = debugFactory('namespace');
    expect(log.namespace).toBe('namespace:');
  });
});

describe('::extendDebugger', () => {
  it('returns an extended instance with expected properties and methods', async () => {
    expect.hasAssertions();

    const debug = oldDebug('namespace');
    const extended = extendDebugger(debug);

    expectExtendedDebugger(extended);
  });
});

describe('::finalizeDebugger', () => {
  it('returns a finalized instance with expected properties and methods', async () => {
    expect.hasAssertions();

    const debug = oldDebug('namespace');
    const finalized = finalizeDebugger(debug);

    expectUnextendableDebugger(finalized);
  });
});

describe('::ExtendedDebugger', () => {
  describe('::[enable,enabled,selectColor]', () => {
    it('accepts root namespaces without colons and appends one internally', async () => {
      expect.hasAssertions();

      const debug = debugFactory('namespace');

      expect(debug.enabled).toBeFalsy();
      expect(debugFactory.enabled('namespace')).toBeFalse();

      debugFactory.enable('namespace');

      expect(debug.enabled).toBeTrue();
      expect(debugFactory.enabled('namespace')).toBeTrue();

      expect(debugFactory.selectColor('namespace')).toBe(debug.color);
      expect(debug.color).not.toBe(debug.extend('different').color);
    });
  });

  describe('::extend', () => {
    it('returns an instance with expected properties and methods', async () => {
      expect.hasAssertions();

      const debug = debugFactory('namespace');
      const extended = debug.extend('extended');

      expectExtendedDebugger(extended);
    });
  });

  describe('::newline', () => {
    it('calls internal logger function with empty string', async () => {
      expect.hasAssertions();

      const debug = debugFactory('namespace');
      const logFn = (debug.log = jest.fn());

      debug.enabled = true;
      debug.newline();

      expect(logFn.mock.calls).toStrictEqual([['']]);
      expect(factoryLogFn.mock.calls).toStrictEqual([]);
    });

    it('calls debugFactory.log with empty string if debug.log not set', async () => {
      expect.hasAssertions();

      const debug = debugFactory('namespace');

      debug.enabled = true;
      debug.log = undefined;
      debug.newline();

      expect(factoryLogFn.mock.calls).toStrictEqual([['']]);
    });

    it('calls nothing if instance is not enabled', async () => {
      expect.hasAssertions();

      expect(debugFactory.enabled('namespace')).toBeFalse();
      const debug = debugFactory('namespace');
      const logFn = (debug.log = jest.fn());

      expect(debug.enabled).toBeFalse();
      debug.newline();

      expect(logFn.mock.calls).toStrictEqual([]);
      expect(factoryLogFn.mock.calls).toStrictEqual([]);
    });
  });

  describe('::[$instances] (and named convenience methods)', () => {
    it('returns all sub-instances attached to the current instance', async () => {
      expect.hasAssertions();

      const debug = debugFactory('namespace');
      const extended = debug.extend('namespace');
      const { $log: log, message, warn, error, ...rest } = debug[$instances];

      expect(rest).toStrictEqual({});
      expect(log).toBe(debug);

      expectUnextendableDebugger(message);
      expectUnextendableDebugger(warn);
      expectUnextendableDebugger(error);

      expectUnextendableDebugger(extended.message);
      expectUnextendableDebugger(extended.warn);
      expectUnextendableDebugger(extended.error);
    });
  });
});
