// {@xscripts/notExtraneous supports-color}
import { isPromise, isSymbolObject } from 'node:util/types';

import getDebugger, { type Debug as _Debug, type Debugger as _Debugger } from 'debug';

import type { Merge } from 'type-fest';

type _InternalDebuggerNoExtends = Omit<InternalDebugger, 'extend'>;

const debugStringSplitterRegExp = /[\s,]+/;

/**
 * Represents a property on a "root" {@link ExtendedDebugger} instance that
 * returns an array of its {@link UnextendableInternalDebugger} sub-instances
 * (e.g. "error", "warn", etc). The array will also include the root
 * {@link ExtendedDebugger} instance.
 */
export const $instances = Symbol('debug-builtin-sub-instances');

/**
 * A type representing the property names of the sub-instances made available
 * by {@link $instances}.
 *
 * @internal
 */
export type InstanceKey = keyof ExtendedDebugger[typeof $instances];

/**
 * The base `Debug` interface coming from the [debug](https://npm.im/debug)
 * package.
 *
 * @internal
 */
export interface InternalDebug extends _Debug {
  /**
   * Create and return a new {@link InternalDebugger} instance.
   */
  (...args: Parameters<_Debug>): InternalDebugger;
}

/**
 * The base `Debugger` interface coming from the [debug](https://npm.im/debug)
 * package.
 */
export interface InternalDebugger extends __Debugger {
  /**
   * Send an optionally-formatted message to output.
   */
  (...args: Parameters<_Debugger>): void;
}

// ? Fix a bug in the types (::log is currently optional in the upstream source)
type __Debugger = Omit<_Debugger, 'log'> & { log?: _Debugger['log'] };

/**
 * An instance of {@link InternalDebugger} that cannot be extended via
 * `InternalDebugger.extend`.
 */
export interface UnextendableInternalDebugger extends InternalDebugger {
  extend: (...args: Parameters<InternalDebugger['extend']>) => never;
}

/**
 * An {@link InternalDebug} factory interface that returns
 * {@link ExtendedDebugger} instances.
 */
export interface ExtendedDebug extends InternalDebug {
  /**
   * Send an optionally-formatted message to output.
   */
  (...args: Parameters<InternalDebug>): ExtendedDebugger;
}

/**
 * A {@link InternalDebugger} interface extended with convenience methods.
 */
export interface ExtendedDebugger extends _InternalDebuggerNoExtends, DebuggerExtension {
  /**
   * Send an optionally-formatted message to output.
   */
  (...args: Parameters<InternalDebugger>): ReturnType<InternalDebugger>;
  /**
   * Creates a new instance by appending `namespace` to the current logger's
   * namespace.
   */
  extend: (...args: Parameters<InternalDebugger['extend']>) => ExtendedDebugger;
  /**
   * Send a blank newline to output.
   */
  newline: () => void;
}

/**
 * The shape of the new keys that are added to the {@link InternalDebugger}
 * object. {@link InternalDebugger} + {@link DebuggerExtension} =
 * {@link ExtendedDebugger}.
 *
 * @internal
 */
export type DebuggerExtension<
  T = UnextendableInternalDebugger,
  U = ExtendedDebugger
> = DebuggerSubInstanceTypeGuard<
  _DebuggerSubInstances<T> & {
    /**
     * An array of sub-instances (e.g. "error", "warn", etc), including the root
     * instance.
     */
    [$instances]: DebuggerSubInstanceTypeGuard<
      Merge<
        _DebuggerSubInstances<T>,
        {
          /**
           * A cyclical reference to the current logger.
           */
          $log: U;
        }
      >
    >;
  }
>;

/**
 * @see {@link extendedDebuggerSubInstanceProperties}
 */
export type ExtendedDebuggerSubInstanceProperties =
  (typeof extendedDebuggerSubInstanceProperties)[number];

/**
 * The single source of truth for the keys and types of the various convenience
 * sub-instances (e.g. "error", "warn", etc).
 *
 * This array of property strings is guaranteed to be accurate thanks to
 * internal use of the `DebuggerSubInstanceTypeGuard` type (not publicly
 * exported).
 */
export const extendedDebuggerSubInstanceProperties = [
  'message',
  'error',
  'warn'
] as const satisfies (keyof _DebuggerSubInstances)[];

// ? We use this seemingly redundant data structure here because we want
// ? comments for the sub-instance properties. We type check that
// ? extendedDebuggerSubInstanceProperties matches _DebuggerSubInstances
// ? with a combination of satisfies (above) and assigning unknown sub-instance
// ? names to "never"
type _DebuggerSubInstances<T = UnextendableInternalDebugger> = {
  /**
   * A sub-instance for outputting messages to the attention of the reader.
   */
  message: T;
  /**
   * A sub-instance for outputting error messages.
   */
  error: T;
  /**
   * A sub-instance for outputting warning messages.
   */
  warn: T;
};

// ? An internal type ensuring all debugger sub-instances are defined and none
// ? are missing due to developer mistake. If such an mistake were to occur, the
// ? resulting return type of the dubious properties becomes "never," which
// ? should alert the developer (future me!) that this mistake occurred
type DebuggerSubInstanceTypeGuard<RealType extends object> = RealType &
  Merge<
    Record<keyof _DebuggerSubInstances, never>,
    Record<(typeof extendedDebuggerSubInstanceProperties)[number], unknown>
  >;

/**
 * We append a colon to the end of root namespaces (namespaces without colons)
 * to smooth out a wrinkle in the upstream package's functionality where
 * `DEBUG='my-namespace*'` will activate a debugger with the namespace
 * "my-namespace" but will NOT activate any nested namespaces, like
 * "my-namespace:nested". This means if you have a "root" namespace and also
 * nested namespaces, to see all program output, you have to set `DEBUG` to
 * something inconvenient like `DEBUG='my-namespace*,my-namespace:*'`.
 *
 * However, if we add a colon to "my-namespace" or any other root namespace when
 * given, we get the more intuitive functionality for free:
 * `DEBUG='my-namespace*'` is enough to activate all namespaces both nested and
 * root!
 *
 * This function also splits on space/comma and applies the same transform to
 * each split-off namespace.
 */
function maybeAppendColon(str: string, delimiter: string) {
  return !str
    ? str
    : str
        .split(debugStringSplitterRegExp)
        .map((subStr) => {
          switch (subStr) {
            case '':
            case '*':
            case '-*': {
              return subStr;
            }

            default: {
              return (
                subStr +
                (subStr.includes(delimiter) || subStr.endsWith('*') ? '' : delimiter)
              );
            }
          }
        })
        .join(',');
}

/**
 * An `ExtendedDebug` instance that returns an {@link ExtendedDebugger} instance
 * via {@link extendDebugger}.
 */
export const debugFactory = new Proxy(getDebugger as unknown as ExtendedDebug, {
  apply(_target, _this: unknown, args: Parameters<InternalDebug>) {
    const originalNamespace = args[0];
    const ourNamespace = (args[0] = maybeAppendColon(originalNamespace, ':'));

    // ? Interop necessary to preserve (and expand!) "rootNamespace:*"
    // ? activation behavior
    if (
      process.env.DEBUG &&
      !originalNamespace.includes(':') &&
      !originalNamespace.endsWith('*')
    ) {
      getDebugger.enable(
        process.env.DEBUG.split(debugStringSplitterRegExp)
          .map(function (incomingNamespace_) {
            const incomingNamespaceNegation = incomingNamespace_.startsWith('-')
              ? '-'
              : '';

            const incomingNamespace = incomingNamespaceNegation
              ? incomingNamespace_.slice(1)
              : incomingNamespace_;

            if (incomingNamespace === originalNamespace) {
              return incomingNamespaceNegation + incomingNamespace + ':';
            }

            const outgoingNamespace =
              incomingNamespace !== ourNamespace &&
              incomingNamespace.startsWith(ourNamespace) &&
              !incomingNamespace.startsWith(ourNamespace + ':') &&
              !incomingNamespace.startsWith(ourNamespace + '*')
                ? incomingNamespace.slice(0, ourNamespace.length) +
                  ':' +
                  incomingNamespace.slice(ourNamespace.length)
                : incomingNamespace;

            return incomingNamespaceNegation + outgoingNamespace;
          })
          .join(',')
      );
    }

    return extendDebugger(getDebugger(...args));
  },
  get(target, property: PropertyKey, proxy: ExtendedDebug) {
    const value: unknown = target[property as keyof typeof target];
    const isSymbolOrOwnProperty =
      typeof property === 'string' &&
      (isSymbolObject(property) ||
        Object.hasOwn(getDebugger, property) ||
        Object.hasOwn(Object.getPrototypeOf(getDebugger), property));

    if (isSymbolOrOwnProperty && typeof value === 'function') {
      return function (...args: unknown[]) {
        if (
          typeof args[0] === 'string' &&
          ['enable', 'enabled', 'selectColor'].includes(property)
        ) {
          // TODO: if the delimiter ever becomes available on the debug factory
          // TODO: object, use it here:
          args[0] = maybeAppendColon(args[0], ':');
        }

        // ? This is "this-recovering" code.
        const returnValue = value.apply(target, args);
        // ? Whenever we'd return an InternalDebugger instance, return the proxy
        // ? instead.
        /* istanbul ignore next */
        return isPromise(returnValue)
          ? returnValue.then((realReturnValue) => maybeReturnProxy(realReturnValue))
          : maybeReturnProxy(returnValue);
      };
    }

    return value;

    /* istanbul ignore next */
    function maybeReturnProxy(returnValue: unknown) {
      return returnValue === target ? proxy : returnValue;
    }
  }
});

/**
 * Extends a {@link InternalDebugger} instance with several convenience methods,
 * returning an {@link ExtendedDebugger} instance.
 */
export function extendDebugger(instance: InternalDebugger) {
  const extend = instance.extend.bind(instance);
  const finalInstance = instance as unknown as ExtendedDebugger;

  finalInstance[$instances] = Object.create(null);
  finalInstance[$instances].$log = finalInstance;
  finalInstance[$instances].error = finalizeDebugger(extend('<error>'));
  finalInstance[$instances].message = finalizeDebugger(extend('<message>'));
  finalInstance[$instances].warn = finalizeDebugger(extend('<warn>'));

  Object.defineProperties(finalInstance, {
    error: {
      configurable: true,
      enumerable: true,
      get: () => finalInstance[$instances].error
    },
    message: {
      configurable: true,
      enumerable: true,
      get: () => finalInstance[$instances].message
    },
    warn: {
      configurable: true,
      enumerable: true,
      get: () => finalInstance[$instances].warn
    }
  });

  finalInstance.extend = (...args) => extendDebugger(extend(...args));

  finalInstance.newline = () => {
    if (finalInstance.enabled) {
      if (finalInstance.log) {
        finalInstance.log('');
      } else {
        debugFactory.log('');
      }
    }
  };

  return finalInstance;
}

/**
 * Replace the `extend` method of an {@link InternalDebugger} instance with a
 * function that always throws.
 */
export function finalizeDebugger(
  instance: InternalDebugger
): UnextendableInternalDebugger {
  const unextendable = instance as UnextendableInternalDebugger;

  unextendable.extend = () => {
    throw new Error('instance is not extendable');
  };

  return unextendable;
}
