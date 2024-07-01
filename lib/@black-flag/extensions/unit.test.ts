/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNativeError } from 'node:util/types';

import {
  isCommandNotImplementedError,
  type ExecutionContext
} from '@black-flag/core/util';

import { $executionContext, isCliError, type Arguments } from '@black-flag/core';
import isEqual from 'lodash.isequal';
import deepMerge from 'lodash.merge';

import { ErrorMessage } from './error';
import { $exists } from './symbols';

import {
  getInvocableExtendedHandler,
  withBuilderExtensions,
  withUsageExtensions,
  type AsStrictExecutionContext
} from './index';

import type { PartialDeep } from 'type-fest';

describe('::withBuilderExtensions', () => {
  describe('"requires" configuration', () => {
    it('[readme #1] ensures all args given conditioned on existence of other arg', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { requires: 'y' },
          y: {}
        }
      });

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.RequiresViolation('x', [['y', $exists]])
        });
      }
    });

    it('[readme #2] ensures all args/arg-vals given conditioned on existence of other arg', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { requires: [{ y: 'one' }, 'z'] },
          y: {},
          z: { requires: 'y' }
        }
      });

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: 'string' });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: 'string', z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: 'one', z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: 'one', z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.RequiresViolation('x', [
            ['y', 'one'],
            ['z', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.RequiresViolation('z', [['y', $exists]])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: 'string' });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.RequiresViolation('x', [
            ['y', 'one'],
            ['z', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: 'one' });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.RequiresViolation('x', [['z', $exists]])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, z: true, y: 'string' });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.RequiresViolation('x', [['y', 'one']])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.RequiresViolation('x', [['y', 'one']])
        });
      }
    });
  });

  describe('"conflicts" configuration', () => {
    it('[readme #1] ensures all args not given conditioned on existence of other arg', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { conflicts: 'y' },
          y: {}
        }
      });

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.ConflictsViolation('x', [['y', $exists]])
        });
      }
    });

    it('[readme #2] ensures all args/arg-vals not given conditioned on existence of other arg', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { conflicts: [{ y: 'one' }, 'z'] },
          y: {},
          z: { conflicts: 'y' }
        }
      });

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: 'string' });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true, z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.ConflictsViolation('z', [['y', $exists]])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: 'one' });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.ConflictsViolation('x', [['y', 'one']])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, z: true, y: 'one' });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.ConflictsViolation('x', [
            ['y', 'one'],
            ['z', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.ConflictsViolation('x', [['z', $exists]])
        });
      }
    });
  });

  describe('"implies" configuration', () => {
    let finalArgvX: unknown = null;
    let finalArgvY: unknown = null;
    let finalArgvZ: unknown = null;

    const getFinalArgv = () => {
      const argv = { x: finalArgvX, y: finalArgvY, z: finalArgvZ };

      finalArgvX = null;
      finalArgvY = null;
      finalArgvZ = null;

      return argv;
    };

    it('[readme #1] updates argv conditioned on existence of some arg (other args not given)', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customHandler(argv: Arguments) {
          finalArgvX = argv.x;
          finalArgvY = argv.y;
        },
        customBuilder: {
          x: { implies: { y: true } },
          y: {}
        }
      });

      {
        await runner({});

        const { x, y } = getFinalArgv();
        expect(x).toBeUndefined();
        expect(y).toBeUndefined();
      }

      {
        await runner({ y: true });

        const { x, y } = getFinalArgv();
        expect(x).toBeUndefined();
        expect(y).toBeTrue();
      }

      {
        await runner({ y: false });

        const { x, y } = getFinalArgv();
        expect(x).toBeUndefined();
        expect(y).toBeFalse();
      }

      {
        await runner({ x: true });

        const { x, y } = getFinalArgv();
        expect(x).toBeTrue();
        expect(y).toBeTrue();
      }

      {
        await runner({ x: true, y: true });

        const { x, y } = getFinalArgv();
        expect(x).toBeTrue();
        expect(y).toBeTrue();
      }
    });

    it('[readme #1] throws if one or more arg-vals given that conflict with implication', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customHandler(argv: Arguments) {
          finalArgvX = argv.x;
          finalArgvY = argv.y;
        },
        customBuilder: {
          x: { implies: { y: true } },
          y: {}
        }
      });

      {
        const { handlerResult } = await runner({ x: true, y: false });

        expect(handlerResult).toMatchObject({
          message: ErrorMessage.ImpliesViolation('x', [['y', false]])
        });
      }
    });

    it(`does not throw when an arg's value conflicts with an implication but "looseImplications" is enabled`, async () => {
      expect.hasAssertions();

      {
        const runner = makeMockBuilderRunner({
          customHandler(argv: Arguments) {
            finalArgvX = argv.x;
            finalArgvY = argv.y;
          },
          customBuilder: {
            x: { implies: { y: true } },
            y: {}
          }
        });

        const { handlerResult } = await runner({ x: true, y: false });

        expect(handlerResult).toMatchObject({
          message: ErrorMessage.ImpliesViolation('x', [['y', false]])
        });
      }

      {
        const runner = makeMockBuilderRunner({
          customHandler(argv: Arguments) {
            finalArgvX = argv.x;
            finalArgvY = argv.y;
          },
          customBuilder: {
            x: { implies: { y: true }, looseImplications: true },
            y: {}
          }
        });

        await runner({ x: true, y: false });

        const { x, y } = getFinalArgv();
        expect(x).toBeTrue();
        expect(y).toBeFalse();
      }
    });

    it('[readme #2] override configured defaults', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customHandler(argv: Arguments) {
          finalArgvX = argv.x;
          finalArgvY = argv.y;
        },
        customBuilder: {
          x: { implies: { y: true } },
          y: { default: false }
        }
      });

      {
        const { firstPassResult, secondPassResult } = await runner({}, { y: false });

        expect(firstPassResult).toStrictEqual({
          x: {},
          y: { default: false }
        });

        expect(firstPassResult).toStrictEqual(secondPassResult);

        const { x, y } = getFinalArgv();
        expect(x).toBeUndefined();
        expect(y).toBeFalse();
      }

      {
        const { firstPassResult, secondPassResult } = await runner(
          { x: true },
          { y: false }
        );

        expect(firstPassResult).toStrictEqual({
          x: {},
          y: { default: false }
        });

        expect(firstPassResult).toStrictEqual(secondPassResult);

        const { x, y } = getFinalArgv();
        expect(x).toBeTrue();
        expect(y).toBeTrue();
      }
    });

    it('[readme #3] does not cascade transitively', async () => {
      expect.hasAssertions();

      {
        const runner = makeMockBuilderRunner({
          customHandler(argv: Arguments) {
            finalArgvX = argv.x;
            finalArgvY = argv.y;
            finalArgvZ = argv.z;
          },
          customBuilder: {
            x: { implies: { y: true } },
            y: { implies: { z: true } },
            z: {}
          }
        });

        await runner({ x: true });

        const { x, y, z } = getFinalArgv();
        expect(x).toBeTrue();
        expect(y).toBeTrue();
        expect(z).toBeUndefined();
      }

      {
        const runner = makeMockBuilderRunner({
          customHandler(argv: Arguments) {
            finalArgvX = argv.x;
            finalArgvY = argv.y;
            finalArgvZ = argv.z;
          },
          customBuilder: {
            x: { implies: { y: true, z: true } },
            y: { implies: { z: true } },
            z: {}
          }
        });

        await runner({ x: true });

        const { x, y, z } = getFinalArgv();
        expect(x).toBeTrue();
        expect(y).toBeTrue();
        expect(z).toBeTrue();
      }
    });
  });

  describe('"demandThisOptionIf" configuration', () => {
    it('[readme #1] ensures arg is given conditioned on existence of one or more args', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {},
          y: { demandThisOptionIf: 'x' },
          z: { demandThisOptionIf: 'x' }
        }
      });

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true, z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: true, z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandIfViolation('y', ['x', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandIfViolation('z', ['x', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandIfViolation('y', ['x', $exists])
        });
      }
    });

    it('[readme #2] ensures arg is given conditioned on existence of one or more arg-vals', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { demandThisOptionIf: [{ y: 'one' }, 'z'] },
          y: {},
          z: {}
        }
      });

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: 'string' });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: 'string' });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: true, z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandIfViolation('x', ['z', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ y: 'one' });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandIfViolation('x', ['y', 'one'])
        });
      }

      {
        const { handlerResult } = await runner({ y: true, z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandIfViolation('x', ['z', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ y: 'one', z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandIfViolation('x', ['y', 'one'])
        });
      }
    });
  });

  describe('"demandThisOption" configuration', () => {
    it('[readme #1] ensures arg is given', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { demandThisOption: true },
          y: { demandThisOption: false }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner({});

      expect(firstPassResult).toStrictEqual({
        x: { demandOption: true },
        y: { demandOption: false }
      });

      expect(secondPassResult).toStrictEqual({
        x: { demandOption: true },
        y: { demandOption: false }
      });

      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
    });
  });

  describe('"demandThisOptionOr" configuration', () => {
    it('[readme #1] ensures at least one of the provided args is given', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { demandThisOptionOr: ['y', 'z'] },
          y: { demandThisOptionOr: ['x', 'z'] },
          z: { demandThisOptionOr: ['x', 'y'] }
        }
      });

      {
        const { handlerResult } = await runner({ x: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true, z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: true, z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandOrViolation([
            ['y', $exists],
            ['z', $exists],
            ['x', $exists]
          ])
        });
      }
    });

    it('[readme #2] ensures at least one of the provided arg-vals is given', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { demandThisOptionOr: [{ y: 'one' }, 'z'] },
          y: {},
          z: {}
        }
      });

      {
        const { handlerResult } = await runner({ x: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: 'one' });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: 'string' });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true, z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: 'string', z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandOrViolation([
            ['y', 'one'],
            ['z', $exists],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandOrViolation([
            ['y', 'one'],
            ['z', $exists],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: 'string' });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandOrViolation([
            ['y', 'one'],
            ['z', $exists],
            ['x', $exists]
          ])
        });
      }
    });
  });

  describe('"demandThisOptionXor" configuration', () => {
    it('[readme #1] ensures exactly one of the provided args is given', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { demandThisOptionXor: ['y'] },
          y: { demandThisOptionXor: ['x'] },
          z: { demandThisOptionXor: ['w'] },
          w: { demandThisOptionXor: ['z'] }
        }
      });

      {
        const { handlerResult } = await runner({ x: true, z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, w: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true, z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true, w: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandGenericXorViolation([
            ['y', $exists],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ x: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandGenericXorViolation([
            ['w', $exists],
            ['z', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandGenericXorViolation([
            ['w', $exists],
            ['z', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandGenericXorViolation([
            ['y', $exists],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ w: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandGenericXorViolation([
            ['y', $exists],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandSpecificXorViolation(['y', $exists], ['x', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ z: true, w: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandGenericXorViolation([
            ['y', $exists],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: true, z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandSpecificXorViolation(['y', $exists], ['x', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: true, z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandSpecificXorViolation(['y', $exists], ['x', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: true, w: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandSpecificXorViolation(['y', $exists], ['x', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, z: true, w: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandSpecificXorViolation(['w', $exists], ['z', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ y: true, z: true, w: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandSpecificXorViolation(['w', $exists], ['z', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: true, z: true, w: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandSpecificXorViolation(['y', $exists], ['x', $exists])
        });
      }
    });

    it('[readme #2] ensures exactly one of the provided arg-vals is given', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: { demandThisOptionXor: [{ y: 'one' }, 'z'] },
          y: {},
          z: {}
        }
      });

      {
        const { handlerResult } = await runner({ x: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: 'one' });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: true, y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: 'string', z: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({});
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandGenericXorViolation([
            ['y', 'one'],
            ['z', $exists],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandGenericXorViolation([
            ['y', 'one'],
            ['z', $exists],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ y: 'string' });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandGenericXorViolation([
            ['y', 'one'],
            ['z', $exists],
            ['x', $exists]
          ])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, y: 'one' });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandSpecificXorViolation(['y', 'one'], ['x', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandSpecificXorViolation(['z', $exists], ['x', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ y: 'one', z: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandSpecificXorViolation(['y', 'one'], ['z', $exists])
        });
      }

      {
        const { handlerResult } = await runner({ x: true, z: true, y: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.DemandSpecificXorViolation(['z', $exists], ['x', $exists])
        });
      }
    });
  });

  describe('"check" configuration', () => {
    it('re-throws thrown exceptions as-is', async () => {
      expect.hasAssertions();

      const error = new Error(`"x" must be between 0 and 10 (inclusive), saw: -1`);

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            check: function (currentXArgValue: number) {
              if (currentXArgValue < 0 || currentXArgValue > 10) {
                throw error;
              }

              return true;
            }
          }
        }
      });

      {
        const { handlerResult } = await runner({ x: 5 });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: -1 });
        expect(handlerResult).toBe(error);
      }
    });

    it('throws returned exceptions as-is', async () => {
      expect.hasAssertions();

      const error = new Error(`"x" must be between 0 and 10 (inclusive), saw: -1`);

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            check: function (currentXArgValue: number) {
              if (currentXArgValue < 0 || currentXArgValue > 10) {
                return error;
              }

              return true;
            }
          }
        }
      });

      {
        const { handlerResult } = await runner({ x: 5 });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: -1 });
        expect(handlerResult).toSatisfy(isCliError);
        expect(handlerResult).toMatchObject({
          message: `"x" must be between 0 and 10 (inclusive), saw: -1`
        });
      }
    });

    it('throws CliError(string) if string is returned', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            check: function (currentXArgValue: number) {
              if (currentXArgValue < 0 || currentXArgValue > 10) {
                return `"x" must be between 0 and 10 (inclusive), saw: -1`;
              }

              return true;
            }
          }
        }
      });

      {
        const { handlerResult } = await runner({ x: 5 });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: -1 });
        expect(handlerResult).toSatisfy(isCliError);
        expect(handlerResult).toMatchObject({
          message: `"x" must be between 0 and 10 (inclusive), saw: -1`
        });
      }
    });

    it('throws CliError if an otherwise non-truthy (or void) value is returned', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            check: function (currentXArgValue: number) {
              if (currentXArgValue < 0 || currentXArgValue > 10) {
                return;
              }

              return true;
            }
          }
        }
      });

      {
        const { handlerResult } = await runner({ x: 5 });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: -1 });
        expect(handlerResult).toSatisfy(isCliError);
        expect(handlerResult).not.toSatisfy(isCommandNotImplementedError);
      }
    });

    it('runs checks in definition order', async () => {
      expect.hasAssertions();

      const runOrder: number[] = [];

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            check: function () {
              runOrder.push(1);
              return true;
            }
          },
          y: {
            check: function () {
              runOrder.push(2);
              return true;
            }
          },
          z: {
            check: function () {
              runOrder.push(3);
              return true;
            }
          }
        }
      });

      {
        await runner({ x: true, y: true, z: true });
        expect(runOrder).toStrictEqual([1, 2, 3]);
      }
    });

    it('skips checks for arguments that are not given', async () => {
      expect.hasAssertions();

      const runOrder: number[] = [];

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            check: function () {
              runOrder.push(1);
              return true;
            }
          },
          y: {
            check: function () {
              runOrder.push(2);
              return true;
            }
          },
          z: {
            check: function () {
              runOrder.push(3);
              return true;
            }
          }
        }
      });

      {
        await runner({ y: true });
        expect(runOrder).toStrictEqual([2]);
      }
    });

    it('sees defaults', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            default: 1
          },
          y: {
            check: (_, argv) => argv.x === 1
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        {
          y: true
        },
        { x: 1 }
      );

      expect(firstPassResult).toStrictEqual({
        x: { default: 1 },
        y: {}
      });

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
    });

    it('supports async checks', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            default: 1
          },
          y: {
            check: async (_, argv) => argv.x !== 1
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        {
          y: true
        },
        { x: 1 }
      );

      expect(firstPassResult).toStrictEqual({
        x: { default: 1 },
        y: {}
      });

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toSatisfy(isCliError);
      expect(handlerResult).not.toSatisfy(isCommandNotImplementedError);
    });

    it('sees implications (final arv)', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            default: 1
          },
          y: {
            implies: { x: 'one' },
            check: (_, argv) => argv.x === 'one'
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        {
          y: true
        },
        { x: 1 }
      );

      expect(firstPassResult).toStrictEqual({
        x: { default: 1 },
        y: {}
      });

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
    });

    it('[readme #1] example implementation functions as intended', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            number: true,
            check: function (currentXArgValue /*, fullArgv*/) {
              if (currentXArgValue < 0 || currentXArgValue > 10) {
                throw new Error(
                  `"x" must be between 0 and 10 (inclusive), saw: ${currentXArgValue}`
                );
              }

              return true;
            }
          },
          y: {
            boolean: true,
            default: false,
            requires: 'x',
            check: function (currentYArgValue, fullArgv) {
              if (currentYArgValue && (fullArgv.x as number) <= 5) {
                throw new Error(
                  `"x" must be greater than 5 to use 'y', saw: ${fullArgv.x}`
                );
              }

              return true;
            }
          }
        }
      });

      {
        const { firstPassResult, secondPassResult, handlerResult } = await runner(
          {
            x: 1
          },
          { y: false }
        );

        expect(firstPassResult).toStrictEqual({
          x: {
            number: true
          },
          y: {
            boolean: true,
            default: false
          }
        });

        expect(firstPassResult).toStrictEqual(secondPassResult);
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ y: true });
        expect(handlerResult).toMatchObject({
          message: ErrorMessage.RequiresViolation('y', [['x', $exists]])
        });
      }

      {
        const { handlerResult } = await runner({ x: 2, y: false });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: 6, y: true });
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { handlerResult } = await runner({ x: 3, y: true });
        expect(handlerResult).toMatchObject({
          message: `"x" must be greater than 5 to use 'y', saw: 3`
        });
      }

      {
        const { handlerResult } = await runner({ x: -1 }, { y: false });
        expect(handlerResult).toMatchObject({
          message: `"x" must be between 0 and 10 (inclusive), saw: -1`
        });
      }
    });
  });

  describe('"subOptionOf" configuration', () => {
    it('supports both invocation signatures for updater objects (array and object forms)', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number',
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue === 'a',
                update: {
                  description: 'This is a switch specifically for the "a" choice'
                }
              }
            }
          },
          z: {
            boolean: true,
            description: 'A useful context-sensitive flag',
            subOptionOf: {
              x: [
                {
                  when: (currentXArgValue) => currentXArgValue === 'a',
                  update: (oldXArgumentConfig) => {
                    return {
                      ...oldXArgumentConfig,
                      description: 'This is a switch specifically for the "a" choice'
                    };
                  }
                },
                {
                  when: (currentXArgValue) => currentXArgValue === 'a',
                  update: (oldXArgumentConfig) => ({
                    ...oldXArgumentConfig,
                    string: true
                  })
                }
              ]
            }
          }
        }
      });

      {
        const { firstPassResult, secondPassResult } = await runner({ x: 'b' });

        expect(firstPassResult).toStrictEqual({
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number'
          },
          z: {
            boolean: true,
            description: 'A useful context-sensitive flag'
          }
        });

        expect(firstPassResult).toStrictEqual(secondPassResult);
      }

      {
        const { firstPassResult, secondPassResult } = await runner({ x: 'a' });

        expect(firstPassResult).toStrictEqual({
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number'
          },
          z: {
            boolean: true,
            description: 'A useful context-sensitive flag'
          }
        });

        expect(secondPassResult).toStrictEqual({
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            description: 'This is a switch specifically for the "a" choice'
          },
          z: {
            boolean: true,
            description: 'This is a switch specifically for the "a" choice',
            string: true
          }
        });
      }
    });

    it('overwrites previous configuration entirely with updater result', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number',
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue === 'a',
                update: {
                  description: 'This is a switch specifically for the "a" choice'
                }
              }
            }
          }
        }
      });

      const { firstPassResult, secondPassResult } = await runner({ x: 'a' });

      expect(firstPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'A number'
        }
      });

      expect(secondPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          description: 'This is a switch specifically for the "a" choice'
        }
      });
    });

    it('facilitates object spread when overwriting previous configuration via updater result', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number',
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue === 'a',
                update: (oldConfig) => ({
                  ...oldConfig,
                  description: 'This is a switch specifically for the "a" choice'
                })
              }
            }
          }
        }
      });

      const { firstPassResult, secondPassResult } = await runner({ x: 'a' });

      expect(firstPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'A number'
        }
      });

      expect(secondPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'This is a switch specifically for the "a" choice'
        }
      });
    });

    it('ignores subOptionOf updater objects when corresponding super-arg is not given alongside sub-arg', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number',
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue === 'a',
                update: (oldConfig) => ({
                  ...oldConfig,
                  description: 'This is a switch specifically for the "a" choice'
                })
              }
            }
          }
        }
      });

      const { firstPassResult, secondPassResult } = await runner({ y: 4 });

      expect(firstPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'A number'
        }
      });

      expect(secondPassResult).toStrictEqual(firstPassResult);
    });

    it('ignores nested/returned subOptionOf keys in resolved configurations', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c']
          },
          y: {
            number: true,
            description: 'A number',
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue === 'a',
                update: (oldConfig) => ({
                  ...oldConfig,
                  description: 'This is a switch specifically for the "a" choice',
                  subOptionOf: {
                    x: { bad: true }
                  }
                })
              }
            }
          }
        }
      });

      const { firstPassResult, secondPassResult } = await runner({ x: 'a' });

      expect(firstPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'A number'
        }
      });

      expect(secondPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        },
        y: {
          number: true,
          description: 'This is a switch specifically for the "a" choice'
        }
      });
    });

    it('allows options to be a sub-option of itself', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c'],
            subOptionOf: {
              x: {
                when: (currentXArgValue) => currentXArgValue !== 'a',
                update: () => ({
                  description: 'This is a switch specifically for the "a" choice',
                  string: true
                })
              }
            }
          }
        }
      });

      const { firstPassResult, secondPassResult } = await runner({ x: 'c' });

      expect(firstPassResult).toStrictEqual({
        x: {
          choices: ['a', 'b', 'c']
        }
      });

      expect(secondPassResult).toStrictEqual({
        x: {
          description: 'This is a switch specifically for the "a" choice',
          string: true
        }
      });
    });

    it("[readme #1] enables declarative use of Black Flag's dynamic options support", async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: {
          x: {
            choices: ['a', 'b', 'c'],
            demandThisOption: true,
            description: 'A choice'
          },
          y: {
            number: true,
            description: 'A number'
          },
          z: {
            boolean: true,
            description: 'A useful context-sensitive flag',
            subOptionOf: {
              x: [
                {
                  when: (currentXArgValue) => currentXArgValue === 'a',
                  update: (oldXArgumentConfig) => {
                    return {
                      ...oldXArgumentConfig,
                      description: 'This is a switch specifically for the "a" choice'
                    };
                  }
                },
                {
                  when: (currentXArgValue) => currentXArgValue !== 'a',
                  update: {
                    string: true,
                    description: 'This former-flag now accepts a string instead'
                  }
                }
              ],
              y: {
                when: (currentYArgValue, fullArgv) =>
                  fullArgv.x === 'a' && currentYArgValue > 5,
                update: {
                  array: true,
                  demandThisOption: true,
                  description:
                    'This former-flag now accepts an array of two or more strings',
                  check: function (currentZArgValue) {
                    return (
                      currentZArgValue.length >= 2 ||
                      `"z" must be an array of two or more strings, only saw: ${currentZArgValue.length ?? 0}`
                    );
                  }
                }
              },
              'does-not-exist': []
            }
          }
        }
      });

      const expectedXY = {
        x: {
          choices: ['a', 'b', 'c'],
          demandOption: true,
          description: 'A choice'
        },
        y: {
          number: true,
          description: 'A number'
        }
      };

      const expectedXYZFirstPass = {
        ...expectedXY,
        z: {
          boolean: true,
          description: 'A useful context-sensitive flag'
        }
      };

      {
        const { firstPassResult, secondPassResult } = await runner({
          x: 'a'
        });

        expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
        expect(secondPassResult).toStrictEqual({
          ...expectedXY,
          z: {
            boolean: true,
            description: 'This is a switch specifically for the "a" choice'
          }
        });
      }

      {
        const { firstPassResult, secondPassResult } = await runner({
          x: 'b'
        });

        expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
        expect(secondPassResult).toStrictEqual({
          ...expectedXY,
          z: {
            string: true,
            description: 'This former-flag now accepts a string instead'
          }
        });
      }

      {
        const { firstPassResult, secondPassResult } = await runner({
          y: 1
        });

        expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
        expect(secondPassResult).toStrictEqual(expectedXYZFirstPass);
      }

      {
        const { firstPassResult, secondPassResult } = await runner({
          z: true
        });

        expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
        expect(secondPassResult).toStrictEqual(expectedXYZFirstPass);
      }

      {
        const { firstPassResult, secondPassResult } = await runner({
          x: 'a',
          y: 5
        });

        expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
        expect(secondPassResult).toStrictEqual({
          ...expectedXY,
          z: {
            boolean: true,
            description: 'This is a switch specifically for the "a" choice'
          }
        });
      }

      {
        const { firstPassResult, secondPassResult, handlerResult } = await runner({
          x: 'a',
          y: 10
        });

        expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
        expect(secondPassResult).toStrictEqual({
          ...expectedXY,
          z: {
            array: true,
            demandOption: true,
            description: 'This former-flag now accepts an array of two or more strings'
          }
        });

        // ? Since z isn't given, z's checks are skipped (otherwise they'd fail)
        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }

      {
        const { firstPassResult, secondPassResult, handlerResult } = await runner({
          x: 'a',
          y: 10,
          z: true
        });

        expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
        expect(secondPassResult).toStrictEqual({
          ...expectedXY,
          z: {
            array: true,
            demandOption: true,
            description: 'This former-flag now accepts an array of two or more strings'
          }
        });

        expect(handlerResult).toMatchObject({
          message: '"z" must be an array of two or more strings, only saw: 0'
        });
      }

      {
        const { firstPassResult, secondPassResult, handlerResult } = await runner({
          x: 'a',
          y: 10,
          z: ['str1']
        });

        expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
        expect(secondPassResult).toStrictEqual({
          ...expectedXY,
          z: {
            array: true,
            demandOption: true,
            description: 'This former-flag now accepts an array of two or more strings'
          }
        });

        expect(handlerResult).toMatchObject({
          message: '"z" must be an array of two or more strings, only saw: 1'
        });
      }

      {
        const { firstPassResult, secondPassResult, handlerResult } = await runner({
          x: 'a',
          y: 10,
          z: ['str1', 'str2']
        });

        expect(firstPassResult).toStrictEqual(expectedXYZFirstPass);
        expect(secondPassResult).toStrictEqual({
          ...expectedXY,
          z: {
            array: true,
            demandOption: true,
            description: 'This former-flag now accepts an array of two or more strings'
          }
        });

        expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      }
    });

    it('[readme #2] rewrite of demo init command builds identically to original', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customBuilder: () => {
          return {
            lang: {
              choices: ['node', 'python'],
              demandThisOption: true,
              default: 'python',
              subOptionOf: {
                lang: [
                  {
                    when: (lang) => lang === 'node',
                    update: {
                      choices: ['node'],
                      demandThisOption: true
                    }
                  },
                  {
                    when: (lang) => lang !== 'node',
                    update: {
                      choices: ['python'],
                      demandThisOption: true
                    }
                  }
                ]
              }
            },
            version: {
              string: true,
              default: 'latest',
              subOptionOf: {
                lang: [
                  {
                    when: (lang) => lang === 'node',
                    update: {
                      choices: ['19.8', '20.9', '21.1'],
                      default: '21.1'
                    }
                  },
                  {
                    when: (lang) => lang !== 'node',
                    update: {
                      choices: ['3.10', '3.11', '3.12'],
                      default: '3.12'
                    }
                  }
                ]
              }
            }
          };
        }
      });

      const expectedFirstPass = {
        lang: {
          choices: ['node', 'python'],
          demandOption: true,
          default: 'python'
        },
        version: {
          string: true,
          default: 'latest'
        }
      };

      {
        const { firstPassResult, secondPassResult } = await runner(
          {},
          { version: 'latest' }
        );

        expect(firstPassResult).toStrictEqual(expectedFirstPass);
        expect(secondPassResult).toStrictEqual(expectedFirstPass);
      }

      {
        const { firstPassResult, secondPassResult } = await runner(
          { lang: 'node' },
          { version: '21.1' }
        );

        expect(firstPassResult).toStrictEqual(expectedFirstPass);
        expect(secondPassResult).toStrictEqual({
          lang: {
            choices: ['node'],
            demandOption: true
          },
          version: {
            choices: ['19.8', '20.9', '21.1'],
            default: '21.1'
          }
        });
      }

      {
        const { firstPassResult, secondPassResult } = await runner(
          { lang: 'python' },
          { version: '3.12' }
        );

        expect(firstPassResult).toStrictEqual(expectedFirstPass);
        expect(secondPassResult).toStrictEqual({
          lang: {
            choices: ['python'],
            demandOption: true
          },
          version: {
            choices: ['3.10', '3.11', '3.12'],
            default: '3.12'
          }
        });
      }
    });
  });

  // ? yargs needs to see the default key to generate proper help text, but
  // ? we need to make sure defaults play nice with requires/implies/conflicts
  test('yargs/BF sees "default" key but custom builder functions do not see defaulted args', async () => {
    expect.assertions(5);

    const runner = makeMockBuilderRunner({
      customBuilder: (_bf, _, argv) => {
        expect(argv).toSatisfy((x) => {
          return (
            x === undefined ||
            // ? Doing Object.fromEntries(Object.entries(x)) lets us skip symbols
            isEqual(Object.fromEntries(Object.entries(x)), { _: [], $0: 'fake' })
          );
        });

        return {
          x: { default: 1 }
        };
      }
    });

    {
      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        {},
        { x: 1 }
      );

      expect(firstPassResult).toStrictEqual({ x: { default: 1 } });
      expect(secondPassResult).toStrictEqual({ x: { default: 1 } });
      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
    }
  });

  test('checks (except "check") ignore (coexist peacefully with) defaults coming in from yargs-parser', async () => {
    expect.hasAssertions();

    {
      const runner = makeMockBuilderRunner({
        customBuilder: {
          a: { requires: 'b', default: 1 },
          b: { conflicts: 'c', default: 2 },
          c: { implies: { d: -1 }, default: 3 },
          d: { demandThisOptionIf: 'b', default: 4 },
          e: { demandThisOption: true, default: 5 },
          f: { demandThisOptionOr: 'd', default: 6 },
          g: { demandThisOptionXor: 'h', default: 7 },
          h: {
            check: (_h, _argv) => true,
            default: 8
          },
          i: {
            default: 9,
            subOptionOf: { d: { when: (d) => d === -1, update: { default: 10 } } }
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        {},
        { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9 }
      );

      expect(firstPassResult).toStrictEqual({
        a: { default: 1 },
        b: { default: 2 },
        c: { default: 3 },
        d: { default: 4 },
        e: { default: 5, demandOption: true },
        f: { default: 6 },
        g: { default: 7 },
        h: { default: 8 },
        i: { default: 9 }
      });

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toMatchObject({
        message: ErrorMessage.DemandOrViolation([
          ['d', $exists],
          ['f', $exists]
        ])
      });
    }

    {
      const runner = makeMockBuilderRunner({
        customBuilder: {
          a: { requires: 'b', default: 1 },
          b: { conflicts: 'c', default: 2 },
          c: { implies: { d: -1 }, default: 3 },
          d: { demandThisOptionIf: 'b', default: 4 },
          e: { demandThisOption: true, default: 5 },
          f: { demandThisOptionOr: 'd', default: 6 },
          g: { demandThisOptionXor: 'h', default: 7 },
          h: {
            check: (_h, _argv) => true,
            default: 8
          },
          i: {
            default: 9,
            subOptionOf: { d: { when: (d) => d === -1, update: { default: 10 } } }
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        { f: -6 },
        { a: 1, b: 2, c: 3, d: 4, e: 5, g: 7, h: 8, i: 9 }
      );

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toMatchObject({
        message: ErrorMessage.DemandGenericXorViolation([
          ['h', $exists],
          ['g', $exists]
        ])
      });
    }

    {
      const runner = makeMockBuilderRunner({
        customHandler(argv) {
          expect(argv).toStrictEqual({
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: -6,
            g: -7,
            h: 8,
            i: 9,
            _: expect.anything(),
            $0: expect.anything(),
            [$executionContext]: expect.anything()
          });
        },
        customBuilder: {
          a: { requires: 'b', default: 1 },
          b: { conflicts: 'c', default: 2 },
          c: { implies: { d: -1 }, default: 3 },
          d: { demandThisOptionIf: 'b', default: 4 },
          e: { demandThisOption: true, default: 5 },
          f: { demandThisOptionOr: 'd', default: 6 },
          g: { demandThisOptionXor: 'h', default: 7 },
          h: {
            check: (_h, _argv) => true,
            default: 8
          },
          i: {
            default: 9,
            subOptionOf: { d: { when: (d) => d === -1, update: { default: 10 } } }
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        { f: -6, g: -7 },
        { a: 1, b: 2, c: 3, d: 4, e: 5, h: 8, i: 9 }
      );

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toBeUndefined();
    }

    {
      const runner = makeMockBuilderRunner({
        customBuilder: {
          a: { requires: 'b', default: 1 },
          b: { conflicts: 'c', default: 2 },
          c: { implies: { d: -1 }, default: 3 },
          d: { demandThisOptionIf: 'b', default: 4 },
          e: { demandThisOption: true, default: 5 },
          f: { demandThisOptionOr: 'd', default: 6 },
          g: { demandThisOptionXor: 'h', default: 7 },
          h: {
            default: 8,
            check: (_h, argv) => {
              expect(argv).toStrictEqual({
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5,
                f: -6,
                g: 7,
                h: -8,
                i: 9,
                _: expect.anything(),
                $0: expect.anything(),
                [$executionContext]: expect.anything()
              });

              return true;
            }
          },
          i: {
            default: 9,
            subOptionOf: { d: { when: (d) => d === -1, update: { default: 10 } } }
          }
        }
      });

      const { firstPassResult, secondPassResult, handlerResult } = await runner(
        { f: -6, h: -8 },
        { a: 1, b: 2, c: 3, d: 4, e: 5, g: 7, i: 9 }
      );

      expect(firstPassResult).toStrictEqual(secondPassResult);
      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
    }
  });

  test('defaults do not override implications/argv', async () => {
    expect.assertions(2);

    const runner = makeMockBuilderRunner({
      customHandler(argv) {
        expect(argv).toStrictEqual({
          x: true,
          y: 1,
          z: 4,
          w: 10,
          _: expect.anything(),
          $0: expect.anything(),
          [$executionContext]: expect.anything()
        });
      },
      customBuilder: {
        x: { implies: { y: 1, z: 4, w: 10 } },
        y: { default: 2 },
        z: { default: 3 },
        w: { default: 5 }
      }
    });

    {
      const { handlerResult } = await runner({ x: true, w: 10 }, { y: 2, z: 3 });
      expect(handlerResult).toBeUndefined();
    }
  });

  test('custom command handlers see final argv (including defaults)', async () => {
    expect.assertions(2);

    const runner = makeMockBuilderRunner({
      customHandler(argv) {
        expect(argv).toStrictEqual({
          x: true,
          y: 1,
          z: 1,
          a: 1,
          _: expect.anything(),
          $0: expect.anything(),
          [$executionContext]: expect.anything()
        });
      },
      customBuilder: {
        x: { subOptionOf: { x: { when: () => true, update: { implies: { a: 1 } } } } },
        y: { subOptionOf: { x: { when: () => true, update: { default: 1 } } } },
        z: { default: 1 },
        w: { implies: { b: 1 } },
        a: {},
        b: {}
      }
    });

    {
      const { handlerResult } = await runner({ x: true }, { y: 1, z: 1 });
      expect(handlerResult).toBeUndefined();
    }
  });

  test('arg-vals are successively overridden', async () => {
    expect.hasAssertions();

    const runner = makeMockBuilderRunner({
      customBuilder: {
        a: { requires: [{ b: 1 }, { b: 2 }, { b: 3 }] },
        b: { conflicts: [{ c: 1 }, { c: 2 }, { c: 3 }] },
        c: { implies: [{ d: 1 }, { d: 2 }, { d: 3 }] },
        d: { demandThisOptionIf: [{ e: 1 }, { e: 2 }, { e: 3 }] },
        e: { demandThisOptionOr: [{ f: 1 }, { f: 2 }, { f: 3 }] },
        f: { demandThisOptionXor: [{ g: 1 }, { g: 2 }, { g: 3 }] }
      }
    });

    {
      const { handlerResult } = await runner({});

      expect(handlerResult).toMatchObject({
        message: ErrorMessage.DemandOrViolation([
          ['f', 3],
          ['e', $exists]
        ])
      });
    }

    {
      const { handlerResult } = await runner({ f: 3, a: true });

      expect(handlerResult).toMatchObject({
        message: ErrorMessage.RequiresViolation('a', [['b', 3]])
      });
    }

    {
      const { handlerResult } = await runner({ f: 3, a: true, b: 3, c: 3 });

      expect(handlerResult).toMatchObject({
        message: ErrorMessage.ConflictsViolation('b', [['c', 3]])
      });
    }

    {
      const { handlerResult } = await runner({ f: 3, a: true, b: 3, c: true, d: true });

      expect(handlerResult).toMatchObject({
        message: ErrorMessage.ImpliesViolation('c', [['d', true]])
      });
    }

    {
      const { handlerResult } = await runner({ f: 3, a: true, b: 3, c: true, e: 3 });

      expect(handlerResult).toMatchObject({
        message: ErrorMessage.DemandIfViolation('d', ['e', 3])
      });
    }

    {
      const { handlerResult } = await runner({
        a: true,
        b: 3,
        c: true,
        d: 3,
        e: 3
      });

      expect(handlerResult).toMatchObject({
        message: ErrorMessage.DemandGenericXorViolation([
          ['g', 3],
          ['f', $exists]
        ])
      });
    }

    {
      const { handlerResult } = await runner({
        a: true,
        b: 3,
        c: true,
        d: 3,
        e: 3,
        g: 3
      });

      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
    }
  });

  test('multi arg-vals are supported', async () => {
    expect.hasAssertions();

    const runner = makeMockBuilderRunner({
      customBuilder: {
        a: { requires: { b: 1, c: 2, d: 3 } },
        b: { conflicts: { e: 1, f: 2, g: 3 } }
      }
    });

    {
      const { handlerResult } = await runner({});
      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
    }

    {
      const { handlerResult } = await runner({ a: true });

      expect(handlerResult).toMatchObject({
        message: ErrorMessage.RequiresViolation('a', [
          ['b', 1],
          ['c', 2],
          ['d', 3]
        ])
      });
    }

    {
      const { handlerResult } = await runner({ b: true, e: 1, f: 2, g: 3 });

      expect(handlerResult).toMatchObject({
        message: ErrorMessage.ConflictsViolation('b', [
          ['e', 1],
          ['f', 2],
          ['g', 3]
        ])
      });
    }
  });

  test('passing undefined to withHandlerExtensions throws CommandNotImplementedError', async () => {
    expect.hasAssertions();

    const runner = makeMockBuilderRunner();
    const { handlerResult } = await runner({});
    expect(handlerResult).toSatisfy(isCommandNotImplementedError);
  });

  it('throws framework error if withHandlerExtensions is invoked before metadata is available', async () => {
    expect.hasAssertions();

    const [, withHandlerExtensions] = withBuilderExtensions();

    await expect(withHandlerExtensions()({} as any)).rejects.toMatchObject({
      message: expect.stringContaining(ErrorMessage.IllegalHandlerInvocation())
    });
  });

  it('throws framework error if BF instance is missing parsed.defaulted sub-property', async () => {
    expect.hasAssertions();

    const [builder, withHandlerExtensions] = withBuilderExtensions();
    builder({ group: jest.fn() } as any, false, undefined);
    builder({ group: jest.fn() } as any, false, {} as any);

    await expect(withHandlerExtensions()({} as any)).rejects.toMatchObject({
      message: expect.stringContaining(ErrorMessage.UnexpectedlyFalsyDetailedArguments())
    });
  });

  describe('automatic grouping of related options', () => {
    it('creates five automatic groupings with default common options', async () => {
      expect.hasAssertions();

      const mockGroupMethod = jest.fn();

      const runner = makeMockBuilderRunner({
        group: mockGroupMethod,
        customBuilder: {
          a: { requires: 'b' },
          b: { conflicts: 'c' },
          c: { implies: { d: -1 } },
          d: { demandThisOptionIf: 'b' },
          e: { demandThisOption: true },
          f: { demandThisOptionOr: 'd' },
          g: { demandThisOptionXor: 'h' },
          h: { check: (_h, _argv) => true },
          i: {
            subOptionOf: { q: { when: () => true, update: { requires: 'b' } } }
          },
          j: {
            subOptionOf: { q: { when: () => true, update: { conflicts: 'c' } } }
          },
          k: {
            subOptionOf: { q: { when: () => true, update: { implies: { d: -1 } } } }
          },
          l: {
            subOptionOf: { q: { when: () => true, update: { demandThisOptionIf: 'b' } } }
          },
          m: {
            subOptionOf: { q: { when: () => true, update: { demandThisOption: true } } }
          },
          n: {
            subOptionOf: { q: { when: () => true, update: { demandThisOptionOr: 'd' } } }
          },
          o: {
            subOptionOf: {
              q: { when: () => true, update: { demandThisOptionXor: 'h' } }
            }
          },
          p: {
            subOptionOf: {
              q: { when: () => true, update: { check: (_h, _argv) => true } }
            }
          },
          q: {}
        }
      });

      const { handlerResult } = await runner({ q: false });

      expect(handlerResult).toSatisfy(isCliError);
      expect(mockGroupMethod.mock.calls).toStrictEqual([
        // * First pass
        [['e'], 'Required Options:'],
        [['d', 'f'], 'Required Options (at least one):'],
        [['h', 'g'], 'Required Options (mutually exclusive):'],
        [
          ['a', 'b', 'c', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q'],
          'Optional Options:'
        ],
        [['help'], 'Common Options:'],
        // * Second pass
        [['e', 'm'], 'Required Options:'],
        [['d', 'f'], 'Required Options 1 (at least one):'],
        [['d', 'n'], 'Required Options 2 (at least one):'],
        [['h', 'g'], 'Required Options 1 (mutually exclusive):'],
        [['h', 'o'], 'Required Options 2 (mutually exclusive):'],
        [['a', 'b', 'c', 'i', 'j', 'k', 'l', 'p', 'q'], 'Optional Options:'],
        [['help'], 'Common Options:']
      ]);
    });

    it('can configure common options (cannot be in both optional and common options)', async () => {
      expect.hasAssertions();

      const mockGroupMethod = jest.fn();

      const runner = makeMockBuilderRunner({
        group: mockGroupMethod,
        customBuilder: {
          a: { requires: 'b' },
          b: {}
        },
        builderExtensionsConfig: { commonOptions: ['help', 'version', 'a'] }
      });

      const { handlerResult } = await runner({});

      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      expect(mockGroupMethod.mock.calls).toStrictEqual([
        // * First pass
        [['b'], 'Optional Options:'],
        [['help', 'version', 'a'], 'Common Options:'],
        // * Second pass
        [['b'], 'Optional Options:'],
        [['help', 'version', 'a'], 'Common Options:']
      ]);
    });

    it('can be disabled', async () => {
      expect.hasAssertions();

      const mockGroupMethod = jest.fn();

      const runner = makeMockBuilderRunner({
        group: mockGroupMethod,
        customBuilder: {
          a: { requires: 'b' },
          b: {}
        },
        builderExtensionsConfig: {
          commonOptions: ['help', 'version', 'a'],
          disableAutomaticGrouping: true
        }
      });

      const { handlerResult } = await runner({});

      expect(handlerResult).toSatisfy(isCommandNotImplementedError);
      expect(mockGroupMethod.mock.calls).toStrictEqual([]);
    });
  });
});

describe('::withUsageExtensions', () => {
  it('outputs consistent usage string template when called without parameters', async () => {
    expect.hasAssertions();
    expect(withUsageExtensions()).toBe('Usage: $000\n\n$1.');
  });

  it('appends passed parameter to consistent usage string template', async () => {
    expect.hasAssertions();
    expect(withUsageExtensions('new description')).toBe(
      'Usage: $000\n\nnew description.'
    );
  });

  test('[readme #1] example functions as expected', async () => {
    expect.hasAssertions();

    const str =
      "$1.\n\nAdditional description text that only appears in this command's help text.";

    expect(withUsageExtensions(str)).toBe(`Usage: $000\n\n${str}`);
  });
});

describe('::getInvocableExtendedHandler', () => {
  it('works with normal and strictly typed custom execution contexts', async () => {
    expect.hasAssertions();

    let result = 0;

    const normalCommand = (_: ExecutionContext) => {
      const [builder, withHandlerExtensions] = withBuilderExtensions<
        { x: number },
        ExecutionContext
      >();

      return {
        builder,
        handler: withHandlerExtensions((argv) => void (result = argv.x))
      };
    };

    const strictCommand = (_: AsStrictExecutionContext<ExecutionContext>) => {
      const [builder, withHandlerExtensions] = withBuilderExtensions<
        { x: number },
        ExecutionContext
      >();

      return {
        builder,
        handler: withHandlerExtensions((argv) => void (result = argv.x))
      };
    };

    const normalHandler = await getInvocableExtendedHandler(
      normalCommand,
      generateFakeExecutionContext()
    );

    const strictHandler = await getInvocableExtendedHandler(
      strictCommand,
      generateFakeExecutionContext()
    );

    expect(result).toBe(0);

    await normalHandler({ x: 1 } as Parameters<typeof normalHandler>[0]);

    expect(result).toBe(1);

    await strictHandler({ x: 2 } as Parameters<typeof normalHandler>[0]);

    expect(result).toBe(2);
  });

  it('works with all promisable ImportConfigurationModule types including CJS-ESM interop', async () => {
    expect.hasAssertions();

    const mockCustomHandler = jest.fn();
    const mockArgv = {} as Arguments;

    const literalFunction = (_: ExecutionContext) => {
      const [builder, withHandlerExtensions] = withBuilderExtensions();

      return {
        builder,
        handler: withHandlerExtensions(mockCustomHandler)
      };
    };

    const literalObject = literalFunction({} as ExecutionContext);
    const promisedLiteralFunction = Promise.resolve().then(() => literalFunction);

    const promisedLiteralObject = Promise.resolve().then(() =>
      literalFunction({} as ExecutionContext)
    );

    const interopLiteralFunction = Promise.resolve().then(() => ({
      default: literalFunction
    }));

    const interopLiteralObject = Promise.resolve().then(() => ({
      default: literalFunction({} as ExecutionContext)
    }));

    const interop2LiteralFunction = Promise.resolve().then(() => ({
      default: { default: literalFunction }
    }));

    const interop2LiteralObject = Promise.resolve().then(() => ({
      default: { default: literalFunction({} as ExecutionContext) }
    }));

    {
      const handler = await getInvocableExtendedHandler(
        literalFunction,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        literalObject,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        promisedLiteralFunction,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        promisedLiteralObject,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        interopLiteralFunction,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        interopLiteralObject,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        interop2LiteralFunction,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    {
      const handler = await getInvocableExtendedHandler(
        interop2LiteralObject,
        generateFakeExecutionContext()
      );

      await handler(mockArgv);
    }

    expect(mockCustomHandler.mock.calls).toStrictEqual([
      [mockArgv],
      [mockArgv],
      [mockArgv],
      [mockArgv],
      [mockArgv],
      [mockArgv],
      [mockArgv],
      [mockArgv]
    ]);
  });

  it('works when resolved command builder is not a function', async () => {
    expect.hasAssertions();

    const mockCustomHandler = jest.fn();
    const mockArgv = {} as Arguments;

    const handler = await getInvocableExtendedHandler(
      { handler: mockCustomHandler },
      generateFakeExecutionContext()
    );

    await handler(mockArgv);

    expect(mockCustomHandler.mock.calls).toStrictEqual([[mockArgv]]);
  });

  it('throws if resolved command is falsy', async () => {
    expect.hasAssertions();

    await expect(
      // @ts-expect-error: bad parameter
      getInvocableExtendedHandler(undefined, generateFakeExecutionContext())
    ).rejects.toMatchObject({
      message: expect.stringContaining(ErrorMessage.AssertionFailureFalsyCommand())
    });

    await expect(
      // @ts-expect-error: bad parameter
      getInvocableExtendedHandler(Promise.resolve(), generateFakeExecutionContext())
    ).rejects.toMatchObject({
      message: expect.stringContaining(ErrorMessage.AssertionFailureFalsyCommand())
    });

    await expect(
      getInvocableExtendedHandler(
        // @ts-expect-error: bad parameter
        Promise.resolve().then(() => ({ default: false })),
        generateFakeExecutionContext()
      )
    ).rejects.toMatchObject({
      message: expect.stringContaining(ErrorMessage.AssertionFailureFalsyCommand())
    });

    await expect(
      getInvocableExtendedHandler(
        // @ts-expect-error: bad parameter
        Promise.resolve().then(() => ({ default: { default: false } })),
        generateFakeExecutionContext()
      )
    ).rejects.toMatchObject({
      message: expect.stringContaining(ErrorMessage.AssertionFailureFalsyCommand())
    });
  });

  it('throws if resolved command handler is falsy', async () => {
    expect.hasAssertions();

    await expect(
      getInvocableExtendedHandler({}, generateFakeExecutionContext())
    ).rejects.toMatchObject({
      message: expect.stringContaining(
        ErrorMessage.AssertionFailureCommandHandlerNotAFunction()
      )
    });

    await expect(
      // @ts-expect-error: bad parameter
      getInvocableExtendedHandler({ command: false }, generateFakeExecutionContext())
    ).rejects.toMatchObject({
      message: expect.stringContaining(
        ErrorMessage.AssertionFailureCommandHandlerNotAFunction()
      )
    });

    await expect(
      // @ts-expect-error: bad parameter
      getInvocableExtendedHandler({ command: {} }, generateFakeExecutionContext())
    ).rejects.toMatchObject({
      message: expect.stringContaining(
        ErrorMessage.AssertionFailureCommandHandlerNotAFunction()
      )
    });
  });

  it('throws if command import rejects', async () => {
    expect.hasAssertions();

    await expect(
      getInvocableExtendedHandler(
        Promise.reject({ handler: jest.fn() }),
        generateFakeExecutionContext()
      )
    ).rejects.toMatchObject({
      message: expect.stringContaining(ErrorMessage.AssertionFailureFalsyCommand())
    });
  });
});

test('example #1 functions as expected', async () => {
  expect.hasAssertions();

  let finalArgv: unknown = undefined;

  const runner = makeMockBuilderRunner({
    customHandler(argv) {
      finalArgv = Object.fromEntries(
        Object.entries(argv).filter(([key]) => !['$0', '_'].includes(key))
      );
    },
    customBuilder: () => {
      finalArgv = undefined;
      return {
        target: {
          demandThisOption: true,
          choices: deployTargets,
          description: 'Select deployment target and strategy'
        },
        'only-production': {
          alias: ['production', 'prod'],
          boolean: true,
          implies: { 'only-preview': false },
          requires: { target: DeployTarget.Vercel },
          default: false,
          description: 'Only deploy to the remote production environment'
        },
        'only-preview': {
          alias: ['preview'],
          boolean: true,
          implies: { 'only-production': false },
          requires: { target: DeployTarget.Vercel },
          default: true,
          description: 'Only deploy to the remote preview environment'
        },
        host: {
          string: true,
          requires: { target: DeployTarget.Ssh },
          demandThisOptionIf: { target: DeployTarget.Ssh },
          description: 'The host to use'
        },
        'to-path': {
          string: true,
          requires: { target: DeployTarget.Ssh },
          demandThisOptionIf: { target: DeployTarget.Ssh },
          description: 'The deploy destination path to use'
        }
      };
    }
  });

  {
    const { handlerResult } = await runner({ target: DeployTarget.Vercel });

    expect(handlerResult).toBeUndefined();
    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Vercel,
      'only-preview': true,
      'only-production': false
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      'only-preview': true
    });

    expect(handlerResult).toBeUndefined();
    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Vercel,
      'only-preview': true,
      'only-production': false
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      'only-production': true
    });

    expect(handlerResult).toBeUndefined();
    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Vercel,
      'only-preview': false,
      'only-production': true
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      'only-preview': false
    });

    expect(handlerResult).toBeUndefined();
    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Vercel,
      'only-preview': false,
      'only-production': false
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      'only-production': false
    });

    expect(handlerResult).toBeUndefined();
    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Vercel,
      'only-preview': false,
      'only-production': false
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      'only-preview': false,
      'only-production': false
    });

    expect(handlerResult).toBeUndefined();
    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Vercel,
      'only-preview': false,
      'only-production': false
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Ssh,
      host: 'prime',
      'to-path': '/path/'
    });

    expect(handlerResult).toBeUndefined();
    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Ssh,
      host: 'prime',
      'to-path': '/path/',
      'only-preview': true,
      'only-production': false
    });
  }

  // * Nonsense

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      'only-preview': true,
      'only-production': true
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.ImpliesViolation('only-production', [['only-preview', true]])
    });
  }

  {
    const { handlerResult } = await runner({ target: DeployTarget.Ssh });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.DemandIfViolation('host', ['target', DeployTarget.Ssh])
    });
  }

  {
    const { handlerResult } = await runner({ target: DeployTarget.Ssh, host: 'prime' });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.DemandIfViolation('to-path', ['target', DeployTarget.Ssh])
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Ssh,
      'to-path': '/path/'
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.DemandIfViolation('host', ['target', DeployTarget.Ssh])
    });
  }

  {
    const { firstPassResult, secondPassResult } = await runner({});

    expect((firstPassResult as any).target).toContainEntry(['demandOption', true]);
    expect(firstPassResult).toStrictEqual(secondPassResult);
  }

  {
    const { handlerResult } = await runner({ host: 'prime' });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('host', [['target', DeployTarget.Ssh]])
    });
  }

  {
    const { handlerResult } = await runner({ 'to-path': '/path/' });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('to-path', [['target', DeployTarget.Ssh]])
    });
  }

  {
    const { handlerResult } = await runner({ host: 'prime', 'to-path': '/path/' });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('host', [['target', DeployTarget.Ssh]])
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      host: 'prime',
      'to-path': '/path/'
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('host', [['target', DeployTarget.Ssh]])
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Ssh,
      'only-preview': true
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('only-preview', [
        ['target', DeployTarget.Vercel]
      ])
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Ssh,
      'only-preview': false
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('only-preview', [
        ['target', DeployTarget.Vercel]
      ])
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Ssh,
      'only-preview': true,
      'only-production': true
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('only-production', [
        ['target', DeployTarget.Vercel]
      ])
    });
  }

  {
    const { handlerResult } = await runner({
      'only-preview': true,
      host: 'prime'
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('only-preview', [
        ['target', DeployTarget.Vercel]
      ])
    });
  }
});

test('example #2 functions as expected', async () => {
  expect.hasAssertions();

  let finalArgv: unknown = undefined;

  const runner = makeMockBuilderRunner({
    customHandler(argv) {
      finalArgv = Object.fromEntries(
        Object.entries(argv).filter(([key]) => !['$0', '_'].includes(key))
      );
    },
    customBuilder: () => {
      finalArgv = undefined;
      return {
        target: {
          description: 'Select deployment target and strategy',
          demandThisOption: true,
          choices: deployTargets,
          subOptionOf: {
            target: {
              when: () => true,
              update(oldOptionConfig, { target }) {
                return {
                  ...oldOptionConfig,
                  choices: [target as string]
                };
              }
            }
          }
        },
        production: {
          alias: ['prod'],
          boolean: true,
          description: 'Deploy to the remote production environment',
          requires: { target: DeployTarget.Vercel },
          implies: { preview: false },
          looseImplications: true,
          subOptionOf: {
            target: {
              when: (target: DeployTarget) => target !== DeployTarget.Vercel,
              update(oldOptionConfig) {
                return {
                  ...oldOptionConfig,
                  hidden: true
                };
              }
            }
          }
        },
        preview: {
          boolean: true,
          description: 'Deploy to the remote preview environment',
          requires: { target: DeployTarget.Vercel },
          default: true,
          check: function (preview, argv) {
            return (
              argv.target !== DeployTarget.Vercel ||
              preview ||
              argv.production ||
              'must choose either --preview or --production deployment environment'
            );
          },
          subOptionOf: {
            target: {
              when: (target: DeployTarget) => target !== DeployTarget.Vercel,
              update(oldOptionConfig) {
                return {
                  ...oldOptionConfig,
                  hidden: true
                };
              }
            }
          }
        },
        host: {
          string: true,
          description: 'The ssh deploy host',
          requires: { target: DeployTarget.Ssh },
          demandThisOptionIf: { target: DeployTarget.Ssh },
          subOptionOf: {
            target: {
              when: (target: DeployTarget) => target !== DeployTarget.Ssh,
              update(oldOptionConfig) {
                return {
                  ...oldOptionConfig,
                  hidden: true
                };
              }
            }
          }
        },
        'to-path': {
          string: true,
          description: 'The ssh deploy destination path',
          requires: { target: DeployTarget.Ssh },
          demandThisOptionIf: { target: DeployTarget.Ssh },
          subOptionOf: {
            target: {
              when: (target: DeployTarget) => target !== DeployTarget.Ssh,
              update(oldOptionConfig) {
                return {
                  ...oldOptionConfig,
                  hidden: true
                };
              }
            }
          }
        }
      };
    }
  });

  {
    const { secondPassResult, handlerResult } = await runner({
      target: DeployTarget.Vercel
    });

    expect(secondPassResult).toStrictEqual({
      target: {
        description: 'Select deployment target and strategy',
        demandOption: true,
        choices: [DeployTarget.Vercel]
      },
      production: {
        alias: ['prod'],
        boolean: true,
        description: 'Deploy to the remote production environment'
      },
      preview: {
        boolean: true,
        description: 'Deploy to the remote preview environment',
        default: true
      },
      host: {
        string: true,
        description: 'The ssh deploy host',
        hidden: true
      },
      'to-path': {
        string: true,
        description: 'The ssh deploy destination path',
        hidden: true
      }
    });

    expect(handlerResult).toBeUndefined();

    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Vercel,
      preview: true
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      preview: true
    });

    expect(handlerResult).toBeUndefined();
    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Vercel,
      preview: true
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      production: true
    });

    expect(handlerResult).toBeUndefined();
    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Vercel,
      preview: false,
      production: true
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      preview: true,
      production: true
    });

    expect(handlerResult).toBeUndefined();
    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Vercel,
      preview: true,
      production: true
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Ssh,
      host: 'prime',
      'to-path': '/path/'
    });

    expect(handlerResult).toBeUndefined();
    expect(finalArgv).toStrictEqual({
      target: DeployTarget.Ssh,
      host: 'prime',
      'to-path': '/path/',
      preview: true
    });
  }

  // * Nonsense

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      preview: false
    });

    expect(handlerResult).toMatchObject({
      message: 'must choose either --preview or --production deployment environment'
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      production: false
    });

    expect(handlerResult).toMatchObject({
      message: 'must choose either --preview or --production deployment environment'
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      preview: false,
      production: false
    });

    expect(handlerResult).toMatchObject({
      message: 'must choose either --preview or --production deployment environment'
    });
  }

  {
    const { handlerResult } = await runner({ target: DeployTarget.Ssh });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.DemandIfViolation('host', ['target', DeployTarget.Ssh])
    });
  }

  {
    const { handlerResult } = await runner({ target: DeployTarget.Ssh, host: 'prime' });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.DemandIfViolation('to-path', ['target', DeployTarget.Ssh])
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Ssh,
      'to-path': '/path/'
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.DemandIfViolation('host', ['target', DeployTarget.Ssh])
    });
  }

  {
    const { firstPassResult, secondPassResult } = await runner({});

    expect((firstPassResult as any).target).toContainEntry(['demandOption', true]);
    expect(firstPassResult).toStrictEqual(secondPassResult);
  }

  {
    const { handlerResult } = await runner({ host: 'prime' });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('host', [['target', DeployTarget.Ssh]])
    });
  }

  {
    const { handlerResult } = await runner({ 'to-path': '/path/' });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('to-path', [['target', DeployTarget.Ssh]])
    });
  }

  {
    const { handlerResult } = await runner({ host: 'prime', 'to-path': '/path/' });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('host', [['target', DeployTarget.Ssh]])
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Vercel,
      host: 'prime',
      'to-path': '/path/'
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('host', [['target', DeployTarget.Ssh]])
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Ssh,
      preview: true
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('preview', [
        ['target', DeployTarget.Vercel]
      ])
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Ssh,
      preview: false
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('preview', [
        ['target', DeployTarget.Vercel]
      ])
    });
  }

  {
    const { handlerResult } = await runner({
      target: DeployTarget.Ssh,
      preview: true,
      production: true
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('production', [
        ['target', DeployTarget.Vercel]
      ])
    });
  }

  {
    const { handlerResult } = await runner({
      preview: true,
      host: 'prime'
    });

    expect(handlerResult).toMatchObject({
      message: ErrorMessage.RequiresViolation('preview', [
        ['target', DeployTarget.Vercel]
      ])
    });
  }
});

enum DeployTarget {
  Vercel = 'vercel',
  Ssh = 'ssh'
}

const deployTargets = Object.values(DeployTarget);

function makeMockBuilderRunner({
  builderExtensionsConfig,
  customBuilder,
  customHandler,
  context = {},
  group = jest.fn()
}: {
  customBuilder?: Parameters<typeof withBuilderExtensions>[0];
  builderExtensionsConfig?: Parameters<typeof withBuilderExtensions>[1];
  customHandler?: Parameters<ReturnType<typeof withBuilderExtensions>[1]>[0];
  context?: PartialDeep<ExecutionContext>;
  group?: typeof jest.fn;
} = {}) {
  const blackFlag_ = { group } as unknown as Parameters<
    ReturnType<typeof withBuilderExtensions>[0]
  >[0];

  return async function mockRunner(
    dummyArgv: Record<string, unknown>,
    defaultedDummyArgs: Record<string, unknown> = {}
  ) {
    const blackFlag = { ...blackFlag_, parsed: { defaulted: defaultedDummyArgs } };
    const argv: Arguments<typeof dummyArgv, ExecutionContext> = Object.assign(
      {
        _: [],
        $0: 'fake'
      },
      dummyArgv,
      {
        [$executionContext]: deepMerge(generateFakeExecutionContext(), context)
      }
    );

    const [builder, withHandlerExtensions] = withBuilderExtensions(
      customBuilder,
      builderExtensionsConfig
    );

    const firstPassResult = await trycatch(() => builder(blackFlag, false, undefined));
    const secondPassResult = isNativeError(firstPassResult)
      ? undefined
      : await trycatch(() => builder(blackFlag, false, argv));

    const handlerResult =
      !secondPassResult || isNativeError(secondPassResult)
        ? undefined
        : await trycatch(() => withHandlerExtensions(customHandler)(argv));

    return { firstPassResult, secondPassResult, handlerResult };
  };
}

function generateFakeExecutionContext() {
  return {
    commands: new Map(),
    debug: jest.fn(),
    state: {}
  } as unknown as ExecutionContext;
}

async function trycatch<T extends () => any>(fn: T): Promise<ReturnType<T> | Error> {
  try {
    return await fn();
  } catch (error) {
    return error as Error;
  }
}
