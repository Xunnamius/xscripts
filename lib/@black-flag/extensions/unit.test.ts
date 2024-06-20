/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNativeError } from 'node:util/types';

import {
  isCommandNotImplementedError,
  type ExecutionContext
} from '@black-flag/core/util';

import { $executionContext, type Arguments } from '@black-flag/core';
import deepMerge from 'lodash.merge';

import { ErrorMessage } from './error';
import { withBuilderExtensions } from './index';
import { $exists } from './symbols';

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
        customHandler(argv) {
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
        customHandler(argv) {
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

    it('[readme #2] override configured defaults', async () => {
      expect.hasAssertions();

      const runner = makeMockBuilderRunner({
        customHandler(argv) {
          finalArgvX = argv.x;
          finalArgvY = argv.y;
        },
        customBuilder: {
          x: { implies: { y: true } },
          y: { default: false }
        }
      });

      {
        await runner({}, { y: false });

        const { x, y } = getFinalArgv();
        expect(x).toBeUndefined();
        expect(y).toBeFalse();
      }

      {
        await runner({ x: true }, { y: false });

        const { x, y } = getFinalArgv();
        expect(x).toBeTrue();
        expect(y).toBeTrue();
      }
    });

    it('[readme #3] does not cascade transitively', async () => {
      expect.hasAssertions();

      {
        const runner = makeMockBuilderRunner({
          customHandler(argv) {
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
          customHandler(argv) {
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
    it('allows typing the check function as desired', async () => {
      expect.hasAssertions();
    });

    it('re-throws thrown exceptions as-is', async () => {
      expect.hasAssertions();
    });

    it('throws returned exceptions as-is', async () => {
      expect.hasAssertions();
    });

    it('throws CliError(string) if string is returned', async () => {
      expect.hasAssertions();
    });

    it('throws CliError if an otherwise non-truthy (or void) value is returned', async () => {
      expect.hasAssertions();
    });

    it('runs checks in definition order', async () => {
      expect.hasAssertions();
    });

    it('sees defaults', async () => {
      expect.hasAssertions();
    });

    it('sees implications (final arv)', async () => {
      expect.hasAssertions();
    });

    it('[readme #1] example implementation functions as intended', async () => {
      expect.hasAssertions();
    });
  });

  describe('"subOptionOf" configuration', () => {
    it('supports both invocation signatures for updater objects (array and object forms)', async () => {
      expect.hasAssertions();
    });

    it('overwrites previous configuration entirely with updater result', async () => {
      expect.hasAssertions();
    });

    it('facilitates object spread when overwriting previous configuration via updater result', async () => {
      expect.hasAssertions();
    });

    it('ignores subOptionOf updater objects when corresponding super-arg is not given alongside sub-arg', async () => {
      expect.hasAssertions();
    });

    it('ignores nested/returned subOptionOf keys in resolved configurations', async () => {
      expect.hasAssertions();
    });

    it("[readme #1] enables declarative use of Black Flag's dynamic options support", async () => {
      expect.hasAssertions();
    });

    it('[readme #2] rewrite of demo init command functions identically to original', async () => {
      expect.hasAssertions();
    });
  });

  test('options passed to BFE configurations must be exact names and not aliases', async () => {
    expect.hasAssertions();
    // TODO: not alias, not camelCase
  });

  test('configurations coexist peacefully with defaults', async () => {
    expect.hasAssertions();
  });

  test('checks (except "demandThisOption") are run at the end of the second parsing pass', async () => {
    expect.hasAssertions();
  });

  test('checks (except "check") ignore defaults', async () => {
    expect.hasAssertions();
  });

  test('custom builder functions do not see defaulted args', async () => {
    expect.hasAssertions();
  });

  test('custom builder functions disable BF option/options methods via intellisense', async () => {
    expect.hasAssertions();
  });

  test('custom command handlers see final argv', async () => {
    expect.hasAssertions();
  });

  test('mirrored configurations are ignored, redundant groups are discarded, and arg-vals are successively overridden', async () => {
    expect.hasAssertions();
  });

  test('passing undefined to withHandlerExtensions throws CommandNotImplementedError', async () => {
    expect.hasAssertions();
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
    });

    it('can configure common options', async () => {
      expect.hasAssertions();
    });

    it('can be disabled', async () => {
      expect.hasAssertions();
    });
  });
});

describe('::withUsageExtensions', () => {
  it('outputs consistent usage string template when called without parameters', async () => {
    expect.hasAssertions();
  });

  it('appends passed parameter to consistent usage string template', async () => {
    expect.hasAssertions();
  });
});

test('example #1 functions as expected', async () => {
  expect.hasAssertions();
});

test('example #2 functions as expected', async () => {
  expect.hasAssertions();
});

function makeMockBuilderRunner({
  builderExtensionsConfig,
  customBuilder,
  customHandler,
  context = {}
}: {
  customBuilder?: Parameters<typeof withBuilderExtensions>[0];
  builderExtensionsConfig?: Parameters<typeof withBuilderExtensions>[1];
  customHandler?: Parameters<ReturnType<typeof withBuilderExtensions>[1]>[0];
  context?: PartialDeep<ExecutionContext>;
} = {}) {
  const blackFlag_ = {
    group: jest.fn()
  } as unknown as Parameters<ReturnType<typeof withBuilderExtensions>[0]>[0];

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
        [$executionContext]: deepMerge(
          {
            commands: new Map(),
            debug: jest.fn(),
            state: {}
          } as unknown as ExecutionContext,
          context
        )
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

async function trycatch<T extends () => any>(fn: T): Promise<ReturnType<T> | Error> {
  try {
    return await fn();
  } catch (error) {
    return error as Error;
  }
}
