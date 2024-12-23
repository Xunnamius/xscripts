/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: replace this with the actual rejoinder and vice-versa!

// ! SPLIT OFF LISTR2 FEATURES AS SEPARATE PACKAGE

import assert from 'node:assert';
import { isPromise } from 'node:util/types';

import { Manager } from '@listr2/manager';

import {
  ListrLogger,
  PRESET_TIMER,
  PRESET_TIMESTAMP,
  ProcessOutput,
  type ListrBaseClassOptions,
  type ListrContext,
  type ListrRenderer,
  type ListrTaskWrapper
} from 'listr2';

import {
  $instances,
  debugFactory,
  extendedDebuggerSubInstanceProperties,
  type DebuggerExtension,
  type ExtendedDebugger,
  type InternalDebugger,
  type UnextendableInternalDebugger
} from 'multiverse+debug';

import type { Entry } from 'type-fest';

// eslint-disable-next-line unicorn/prevent-abbreviations
const extendedLoggerFnPropsWeakMap = new WeakMap<Function, Function>();

/**
 * These color codes correspond to a reddish color on the console.
 * https://gist.github.com/JBlond/2fea43a3049b38287e5e9cefc87b2124?permalink_comment_id=4481079#gistcomment-4481079
 */
export const ansiRedColorCodes = [1, 9, 52, 88, 124, 160, 196];
export const ansiOrangeColorCodes = [3, 11, 94, 136, 178, 214, 220];

export { debugFactory as extendedDebugFactory, type ExtendedDebugger };

/**
 * An enum representing the types of loggers classified by output target.
 */
export enum LoggerType {
  All = 'all',
  GenericOutput = 'logger',
  DebugOnly = 'debugger'
}

/**
 * A pre-customized Listr {@link Manager} instance.
 */
export type ListrManager<T = any> = Manager<T, 'default' | 'verbose'>;

/**
 * @internal
 */
export type WithExtendedParameters<
  T extends (...args: any[]) => any,
  Optional = true
> = Optional extends true
  ? [tags?: string[], ...Parameters<T>]
  : [tags: string[], ...Parameters<T>];

/**
 * @internal
 */
export type WithTagSupport<T extends (...args: any[]) => any, Optional = true> = ((
  ...args: WithExtendedParameters<T, Optional>
) => ReturnType<T> | undefined) & {
  [P in keyof T]: T[P];
};

/**
 * @internal
 */
export type ExtendedLoggerParameters = WithExtendedParameters<ExtendedDebugger, false>;

/**
 * An instance of {@link UnextendableInternalDebugger} that that belongs to an
 * {@link ExtendedLogger}.
 */
export interface UnextendableInternalLogger extends UnextendableInternalDebugger {
  /**
   * Send an optionally-formatted message to output.
   */
  (...args: Parameters<ExtendedDebugger>): ReturnType<ExtendedDebugger>;
  /**
   * Send a tagged optionally-formatted message to output.
   */
  (...args: ExtendedLoggerParameters): ReturnType<ExtendedDebugger>;
}

/**
 * A wrapper around {@link ExtendedDebugger } representing the extension from
 * mere "debug" logger to general purpose "logger".
 */
export interface ExtendedLogger extends _ExtendedLogger<ExtendedLogger> {
  /**
   * Send an optionally-formatted message to output.
   */
  (...args: Parameters<ExtendedDebugger>): ReturnType<ExtendedDebugger>;
  /**
   * Send a tagged optionally-formatted message to output.
   */
  (...args: ExtendedLoggerParameters): ReturnType<ExtendedDebugger>;
  /**
   * Send a blank newline to output.
   *
   * @param outputMethod Determines if the newline will be output via the
   * default output method or the alternate output method. This parameter only
   * has an effect when using certain logger backends and typically corresponds
   * to stdout (`"default"`) and stderr (`"alternate"`).
   */
  newline(
    ...args: [
      ...WithExtendedParameters<ExtendedDebugger['newline'], false>,
      outputMethod?: 'default' | 'alternate'
    ]
  ): ReturnType<ExtendedDebugger['newline']>;
  /**
   * Send a blank newline to output.
   *
   * @param outputMethod Determines if the newline will be output via the
   * default output method or the alternate output method. This parameter only
   * has an effect when using certain logger backends and typically corresponds
   * to stdout (`"default"`) and stderr (`"alternate"`).
   */
  newline(
    ...args: [outputMethod?: 'default' | 'alternate']
  ): ReturnType<ExtendedDebugger['newline']>;
  /**
   * Creates a new instance by appending `namespace` to the current logger's
   * namespace.
   */
  extend(...args: Parameters<ExtendedDebugger['extend']>): ExtendedLogger;
}
type _ExtendedLogger<T> = Omit<
  ExtendedDebugger,
  keyof DebuggerExtension | 'newline' | 'extend'
> &
  DebuggerExtension<UnextendableInternalLogger, T>;

/**
 * Represents a generic Listr2 Task object.
 *
 * @internal
 */
export type GenericListrTask = ListrTaskWrapper<
  ListrContext,
  typeof ListrRenderer,
  typeof ListrRenderer
>;

/**
 * Keeps track of our various "logger" (i.e. debug) instances and their
 * associated metadata. Also keeps track of those tags for which we disable
 * output.
 */
const metadata = {
  logger: [] as (ExtendedLogger | UnextendableInternalLogger)[],
  debugger: [] as (ExtendedDebugger | UnextendableInternalDebugger)[],
  denylist: new Set<string>()
};

/**
 * A string representing a single space (one space-ish character). Note that
 * space-ish characters will not be `trim()`'d.
 */
// ! SINGLE_SPACE is a UNICODE CHARACTER and not a normal space character!
export const SINGLE_SPACE = '⠀';

/**
 * A string of spaces representing a short CLI "tab" (two space-ish characters).
 * Note that space-ish characters will not be `trim()`'d.
 */
export const SHORT_TAB = SINGLE_SPACE.repeat(2);

/**
 * A string of spaces representing a CLI "tab" (four space-ish characters). Note
 * that space-ish characters will not be `trim()`'d.
 */
export const TAB = SINGLE_SPACE.repeat(4);

const consoleLog = (...args: unknown[]) => {
  // eslint-disable-next-line no-console
  console.log(...args);
};

const consoleError = (...args: unknown[]) => {
  // eslint-disable-next-line no-console
  console.error(...args);
};

/**
 * Create and return new set of logger instances.
 */
export function createGenericLogger({
  namespace
}: {
  /**
   * The namespace of the logger. The namespace must be a valid [`debug`
   * namespace](https://npm.im/debug#namespace-colors).
   *
   * @see https://npm.im/debug#namespace-colors
   */
  namespace: string;
}) {
  return withMetadataTracking(
    LoggerType.GenericOutput,
    makeExtendedLogger(
      debugFactory(namespace),
      LoggerType.GenericOutput,
      consoleLog,
      consoleError
    )
  );
}

/**
 * Create and return a new set of logger instances configured to output via a
 * Listr2 task.
 */
export function createListrTaskLogger({
  namespace,
  task
}: {
  /**
   * The namespace of the logger. The namespace must be a valid [`debug`
   * namespace](https://npm.im/debug#namespace-colors).
   *
   * @see https://npm.im/debug#namespace-colors
   */
  namespace: string;
  /**
   * The task to which logging output will be sent.
   */
  task: GenericListrTask;
}) {
  return withMetadataTracking(
    LoggerType.GenericOutput,
    makeExtendedLogger(
      debugFactory(namespace),
      LoggerType.GenericOutput,
      function (...args: unknown[]) {
        task.output = args.join(' ').trim();
      }
    )
  );
}

/**
 * Create a new debug logger instance.
 */
export function createDebugLogger({
  namespace
}: {
  /**
   * The namespace of the logger. The namespace must be a valid [`debug`
   * namespace](https://npm.im/debug#namespace-colors).
   *
   * @see https://npm.im/debug#namespace-colors
   */
  namespace: string;
}) {
  const debug = withMetadataTracking(
    LoggerType.DebugOnly,
    withPatchedExtend(debugFactory(namespace))
  );

  debug.log = consoleError;
  return debug;
}

/**
 * Create and return a new Listr2 {@link Manager} instance pre-configured to
 * work in harmony with rejoinder.
 *
 * Specifically, this instance:
 *
 *   - Has good consistent defaults.
 *
 *   - Switches to the verbose renderer when the DEBUG environment variable is
 *     present or any of the debug logger namespaces are enabled.
 */
export function createListrManager<T = any>(options?: {
  /**
   * Properties provided here will override the defaults passed to the
   * {@link Manager} constructor.
   */
  overrides?: ListrBaseClassOptions;
}) {
  const processOutput = new ProcessOutput();
  // ? Since we use the fallback logger whenever we're in debug mode, let's
  // ? allow debug traffic to hit stderr live.
  processOutput.hijack = processOutput.release = () => undefined /* noop */;

  const manager = new Manager<T, 'default', 'verbose' | 'simple'>({
    concurrent: false,
    collectErrors: 'minimal',
    exitOnError: true,
    registerSignalListeners: true,
    renderer: 'default',
    fallbackRenderer: 'verbose',
    fallbackRendererCondition: () =>
      !!process.env.DEBUG || metadata.debugger.some((logger) => logger.enabled),
    rendererOptions: {
      collapseSubtasks: false,
      collapseSkips: false,
      timer: PRESET_TIMER
    },
    fallbackRendererOptions: {
      timestamp: PRESET_TIMESTAMP,
      timer: PRESET_TIMER,
      logger: new ListrLogger({ processOutput })
    },
    ...options?.overrides
  });

  return manager;
}

/**
 * Return an array of all known loggers of a specific type: either `stdout`,
 * `debug`, or both (`all`). Pre-extended loggers (e.g. `::message`,
 * `::warn`, and `::error`) are excluded unless `includeInternal` is `true`.
 */
export function getLoggersByType({
  type,
  includeInternal = true
}: {
  /**
   * The type of loggers to return. Valid values are one of:
   *
   * - `stdout` returns loggers created via `createGenericLogger`
   *
   * - `debug` returns loggers created via `createDebugLogger`
   *
   * - `all` returns all loggers
   */
  type: LoggerType;
  /**
   * Whether to include unextendable/internal/pre-extended loggers like
   * `::message` and `::warn` in output.
   *
   * @default true
   */
  includeInternal?: boolean;
}) {
  const instances = [];

  if (type === LoggerType.All || type === LoggerType.GenericOutput) {
    instances.push(...metadata.logger);
  }

  if (type === LoggerType.All || type === LoggerType.DebugOnly) {
    instances.push(...metadata.debugger);
  }

  return includeInternal
    ? instances
    : instances.filter((instance) => 'newline' in instance);
}

/**
 * Disable all logger instances (coarse-grain).
 */
export function disableLoggers({
  type,
  filter
}: {
  /**
   * The type of logging to disable. Valid values are one of:
   *
   * - `stdout` disables loggers created via `createGenericLogger`
   *
   * - `debug` disables loggers created via `createDebugLogger`
   *
   * - `all` disables all loggers
   */
  type: LoggerType;

  /**
   * Optionally filter the loggers to be disabled. If `filter` is a string, only
   * loggers with namespaces equal to `filter` will be disabled. If `filter` is
   * a regular expression, only loggers with namespaces matching the expression
   * will be disabled.
   */
  filter?: string | RegExp;
}) {
  for (const instance of getLoggersByType({ type })) {
    if (
      !filter ||
      (typeof filter === 'string' && instance.namespace === filter) ||
      !!instance.namespace.match(filter)
    ) {
      instance.enabled = false;
    }
  }
}

/**
 * Enable all logger instances (coarse-grain).
 */
export function enableLoggers({
  type,
  filter
}: {
  /**
   * The type of logging to enable. Valid values are one of:
   *
   * - `stdout` enables loggers created via `createGenericLogger`
   *
   * - `debug` enables loggers created via `createDebugLogger`
   *
   * - `all` enables all loggers
   */
  type: LoggerType;

  /**
   * Optionally filter the loggers to be enabled. If `filter` is a string, only
   * loggers with namespaces equal to `filter` will be enabled. If `filter` is a
   * regular expression, only loggers with namespaces matching the expression
   * will be enabled.
   */
  filter?: string | RegExp;
}) {
  for (const instance of getLoggersByType({ type })) {
    if (
      !filter ||
      (typeof filter === 'string' && instance.namespace === filter) ||
      !!instance.namespace.match(filter)
    ) {
      instance.enabled = true;
    }
  }
}

/**
 * Prevents logs with the specified tags from being sent to output.
 */
export function disableLoggingByTag({
  tags
}: {
  /**
   * The tags of messages that will no longer be sent to output. If `tags` is
   * empty`, calling this function is effectively a noop.
   */
  tags: string[];
}) {
  tags.forEach((tag) => metadata.denylist.add(tag));
}

/**
 * Allows logs with the specified tags to resume being sent to output. Only relevant as the inverse function of {@link disableLoggingByTag}.
 */
export function enableLoggingByTag({
  tags
}: {
  /**
   * The tags of messages that will resume being sent to output. If `tags` is
   * empty`, calling this function is effectively a noop.
   */
  tags: string[];
}) {
  tags.forEach((tag) => metadata.denylist.delete(tag));
}

/**
 * Returns an array of the tags disabled via {@link disableLoggingByTag}.
 */
export function getDisabledTags() {
  return new Set(metadata.denylist);
}

/**
 * A function that resets the internal logger cache. Essentially, calling this
 * function causes rejoinder to forget any disabled tags or loggers created
 * prior.
 */
export function resetInternalState() {
  metadata.debugger.length = 0;
  metadata.logger.length = 0;
  metadata.denylist.clear();
}

/**
 * Transforms an {@link ExtendedDebugger} into an {@link ExtendedLogger}.
 */
function makeExtendedLogger(
  extendedDebugger: ExtendedDebugger,
  type: Exclude<LoggerType, LoggerType.All>,
  /**
   * This function will be called with various arguments of unknown type when
   * default (e.g. stdout) output should be sent to the user, such as when
   * `::newline(...)` is called.
   */
  underlyingDefaultLogFn: NonNullable<InternalDebugger['log']>,
  /**
   * This function will be called with various arguments of unknown type when
   * alternate (e.g. stderr) output should be sent to the user, such as when
   * `::newline(..., 'alternate')` and `::error(...)`, `::warn(...)`,
   * `::message(...)`, etc are called.
   */
  underlyingAlternateLogFn: NonNullable<InternalDebugger['log']> = underlyingDefaultLogFn
): ExtendedLogger {
  const baseLoggerFn = decorateWithTagSupport(extendedDebugger, 2);
  const baseNewlineFn = decorateWithTagSupport(
    (outputMethod: Parameters<ExtendedLogger['newline']>[0]) => {
      if (extendedLogger.enabled) {
        (outputMethod === 'alternate'
          ? underlyingAlternateLogFn
          : underlyingDefaultLogFn)('');
      }
    },
    1
  ) as typeof extendedLogger.newline;

  const extendedLogger = new Proxy(extendedDebugger as ExtendedLogger, {
    apply(
      _target,
      _this: unknown,
      args: Parameters<WithTagSupport<typeof extendedDebugger>>
    ) {
      return baseLoggerFn(...args);
    },
    get(target, property: PropertyKey, proxy: ExtendedLogger) {
      if (property === 'extend') {
        return function (...args: Parameters<ExtendedLogger['extend']>) {
          return withMetadataTracking(
            type,
            makeExtendedLogger(
              extendedDebugger.extend(...args),
              type,
              underlyingDefaultLogFn,
              underlyingAlternateLogFn
            )
          );
        };
      }

      if (property === 'newline') {
        return function (...args: Parameters<ExtendedLogger['newline']>) {
          baseNewlineFn(...args);
        };
      }

      const value: unknown = target[property as keyof typeof target];

      if (typeof value === 'function') {
        // ? We do Proxy inception here because, if value is an internal
        // ? debugger instance, we need to ensure (1) its properties are
        // ? accessible and (2) each property always returns the same instance
        // ? (i.e. "===" strict equality).

        // ? Note that ExtendedDebugger instances already ship with this
        // ? functionality, and our job here is to ensure ExtendedLoggers
        // ? maintain API parity.

        if (!extendedLoggerFnPropsWeakMap.has(value)) {
          extendedLoggerFnPropsWeakMap.set(
            value,
            new Proxy(value, {
              apply(_target, _this: unknown, args: unknown[]) {
                // ? This is "this-recovering" code.
                const returnValue = value.apply(target, args);
                // ? Whenever we'd return a vanilla debug instance, return the
                // ? wrapper Proxy instead.

                /* istanbul ignore next */
                return isPromise(returnValue)
                  ? returnValue.then((realReturnValue) =>
                      maybeReturnProxy(realReturnValue)
                    )
                  : maybeReturnProxy(returnValue);
              }
            })
          );
        }

        // ? Ensure the same respective strictly-equal object is always returned
        return extendedLoggerFnPropsWeakMap.get(value);
      }

      return value;

      /* istanbul ignore next */
      function maybeReturnProxy(returnValue: unknown) {
        return returnValue === target ? proxy : returnValue;
      }
    }
  });

  // ? Decorate the pre-extended instances (error, warn, etc) with tag support.
  for (const [key, instance] of Object.entries(extendedDebugger[$instances]).filter(
    (o): o is LoggerExtensionEntry => o[0] !== '$log'
  )) {
    if (key === 'error') {
      // ? Ensure "error" outputs are always red (color = 1 === red).
      // @ts-expect-error: external types are incongruent
      instance.color = 1;
    } else if (key === 'warn') {
      // ? Ensure "error" outputs are always yellow (color = 3 === dark yellow).
      // @ts-expect-error: external types are incongruent
      instance.color = 3;
    } else {
      ensureInstanceHasNonReservedColor(instance);
    }

    // ? Ensure our sub-loggers are using the correct underlying logging
    // ? function.
    instance.log = underlyingAlternateLogFn;

    // ? Ensure our sub-loggers are enabled (generate output) by default.
    instance.enabled = true;

    // ? Decorate the sub-logger with tag support.
    extendedLogger[$instances][key] = decorateWithTagSupport(instance, 2);
  }

  // ? Ensure the special $log circular reference points back to us instead of
  // ? the original debug logger.
  extendedLogger[$instances].$log = extendedLogger;

  // ? Ensure our extendedLogger is using the correct underlying logging
  // ? function.
  extendedLogger.log = underlyingDefaultLogFn;

  // ? Ensure our extendedLogger is enabled (generates output) by default.
  extendedLogger.enabled = true;

  ensureInstanceHasNonReservedColor(extendedLogger);

  return extendedLogger;

  type LoggerExtensionEntry = Entry<
    Omit<(typeof extendedDebugger)[typeof $instances], '$log'>
  >;

  function ensureInstanceHasNonReservedColor(
    instance: ExtendedLogger | UnextendableInternalDebugger
  ) {
    if (ansiRedColorCodes.includes(instance.color as unknown as number)) {
      // ? Ensure only "error"/"warn" outputs can be red/orange respectively

      const hiddenInternals = debugFactory as typeof debugFactory & { colors: number[] };
      assert(Array.isArray(hiddenInternals.colors));

      const oldAvailableColors = hiddenInternals.colors;
      hiddenInternals.colors = oldAvailableColors.filter(
        (c) => !ansiRedColorCodes.includes(c) && !ansiOrangeColorCodes.includes(c)
      );

      try {
        const selectedColor = hiddenInternals.selectColor(extendedDebugger.namespace);
        assert(typeof selectedColor === 'number' || typeof selectedColor === 'string');

        // @ts-expect-error: external types are incongruent
        instance.color = selectedColor;
      } finally {
        hiddenInternals.colors = oldAvailableColors;
      }
    }
  }
}

/**
 * Allows logging to be disabled via tags at the fine-grain message level. Set
 * `trapdoorArgLength` to the number of params necessary to trigger denylisting.
 */
function decorateWithTagSupport<T extends (...args: any[]) => any>(
  fn: T,
  trapdoorArgsMinLength: number
): WithTagSupport<T> {
  return new Proxy(fn as WithTagSupport<T>, {
    apply(_target, _this: unknown, args: Parameters<typeof fn>) {
      if (args.length >= trapdoorArgsMinLength && Array.isArray(args[0])) {
        if (args[0].some((tag) => metadata.denylist.has(tag))) {
          return undefined;
        }

        return fn(...args.slice(1));
      }

      return fn(...args);
    }
  });
}

function withMetadataTracking(
  type: Exclude<LoggerType, LoggerType.All>,
  logger: ExtendedDebugger | ExtendedLogger
) {
  metadata[type].push(
    logger,
    ...extendedDebuggerSubInstanceProperties.map((property) => logger[property])
  );

  return logger;
}

/**
 * Recursively patches {@link ExtendedDebugger.extend} so that all debugger
 * instances are properly tracked.
 */
function withPatchedExtend(instance: ExtendedDebugger) {
  const oldExtend = instance.extend.bind(instance);

  // ? We don't use a Proxy here because it's overkill; we don't need access to
  // ? the original extend function's properties. A side effect of not using a
  // ? Proxy is that we need to recursively patch the extend function (below)
  instance.extend = function (...args: Parameters<ExtendedDebugger['extend']>) {
    return withMetadataTracking(
      LoggerType.DebugOnly,
      withPatchedExtend(oldExtend(...args))
    );
  };

  return instance;
}
