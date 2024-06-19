/* eslint-disable jest/prefer-lowercase-title */
describe('::withBuilderExtensions', () => {
  describe('"requires" configuration', () => {
    it('[readme #1] ensures all args given conditioned on existence of other arg', () => {
      expect.hasAssertions();
    });

    it('[readme #2] ensures all args/arg-vals given conditioned on existence of other arg', () => {
      expect.hasAssertions();
    });
  });

  describe('"conflicts" configuration', () => {
    it('[readme #1] ensures all args not given conditioned on existence of other arg', () => {
      expect.hasAssertions();
    });

    it('[readme #2] ensures all args/arg-vals not given conditioned on existence of other arg', () => {
      expect.hasAssertions();
    });
  });

  describe('"implies" configuration', () => {
    it('[readme #1] updates argv conditioned on existence of some arg (other args not given)', () => {
      expect.hasAssertions();
    });

    it('[readme #1] throws if one or more arg-vals given that conflict with implication', () => {
      expect.hasAssertions();
    });

    it('[readme #2] override configured defaults', () => {
      expect.hasAssertions();
    });

    it('[readme #3] does not cascade transitively', () => {
      expect.hasAssertions();
    });
  });

  describe('"demandThisOptionIf" configuration', () => {
    it('[readme #1] ensures arg is given conditioned on existence of one or more args', () => {
      expect.hasAssertions();
    });

    it('[readme #2] ensures arg is given conditioned on existence of one or more arg-vals', () => {
      expect.hasAssertions();
    });
  });

  describe('"demandThisOption" configuration', () => {
    it('[readme #1] ensures arg is given', () => {
      expect.hasAssertions();
    });
  });

  describe('"demandThisOptionOr" configuration', () => {
    it('[readme #1] ensures at least one of the provided args is given', () => {
      expect.hasAssertions();
    });

    it('[readme #2] ensures at least one of the provided arg-vals is given', () => {
      expect.hasAssertions();
    });
  });

  describe('"demandThisOptionXor" configuration', () => {
    it('[readme #1] ensures exactly one of the provided args is given', () => {
      expect.hasAssertions();
    });

    it('[readme #2] ensures exactly one of the provided arg-vals is given', () => {
      expect.hasAssertions();
    });
  });

  describe('"check" configuration', () => {
    it('allows typing the check function as desired', () => {
      expect.hasAssertions();
    });

    it('re-throws thrown exceptions as-is', () => {
      expect.hasAssertions();
    });

    it('throws returned exceptions as-is', () => {
      expect.hasAssertions();
    });

    it('throws CliError(string) if string is returned', () => {
      expect.hasAssertions();
    });

    it('throws CliError if an otherwise non-truthy (or void) value is returned', () => {
      expect.hasAssertions();
    });

    it('runs checks in definition order', () => {
      expect.hasAssertions();
    });

    it('sees defaults', () => {
      expect.hasAssertions();
    });

    it('sees implications (final arv)', () => {
      expect.hasAssertions();
    });

    it('[readme #1] example implementation functions as intended', () => {
      expect.hasAssertions();
    });
  });

  describe('"subOptionOf" configuration', () => {
    it('supports both invocation signatures for updater objects (array and object forms)', () => {
      expect.hasAssertions();
    });

    it('overwrites previous configuration entirely with updater result', () => {
      expect.hasAssertions();
    });

    it('facilitates object spread when overwriting previous configuration via updater result', () => {
      expect.hasAssertions();
    });

    it('ignores subOptionOf updater objects when corresponding super-arg is not given alongside sub-arg', () => {
      expect.hasAssertions();
    });

    it('ignores nested/returned subOptionOf keys in resolved configurations', () => {
      expect.hasAssertions();
    });

    it("[readme #1] enables declarative use of Black Flag's dynamic options support", () => {
      expect.hasAssertions();
    });

    it('[readme #2] rewrite of demo init command functions identically to original', () => {
      expect.hasAssertions();
    });
  });

  test('options passed to BFE configurations must be exact names and not aliases', () => {
    expect.hasAssertions();
    // TODO: not alias, not camelCase
  });

  test('configurations coexist peacefully with defaults', () => {
    expect.hasAssertions();
  });

  test('checks (except "demandThisOption") are run at the end of the second parsing pass', () => {
    expect.hasAssertions();
  });

  test('checks (except "check") ignore defaults', () => {
    expect.hasAssertions();
  });

  test('custom builder functions do not see defaulted args', () => {
    expect.hasAssertions();
  });

  test('custom builder functions disable BF option/options methods via intellisense', () => {
    expect.hasAssertions();
  });

  test('custom command handlers see final argv', () => {
    expect.hasAssertions();
  });

  test('mirrored configurations are ignored, redundant groups are discarded, and arg-vals are successively overridden', () => {
    expect.hasAssertions();
  });

  describe('automatic grouping of related options', () => {
    it('creates five automatic groupings with default common options', () => {
      expect.hasAssertions();
    });

    it('can configure common options', () => {
      expect.hasAssertions();
    });

    it('can be disabled', () => {
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
