import {
  scriptBasename,
  toFirstLowerCase,
  toSentenceCase,
  toSpacedSentenceCase
} from '#cli-utils src/util.ts';

describe('::toSentenceCase', () => {
  it('upper-cases the first letter of the passed string', async () => {
    expect.hasAssertions();
    expect(toSentenceCase('test best rest')).toBe('Test best rest');
  });
});

describe('::toSpacedSentenceCase', () => {
  it('upper-cases the first letter of the passed string', async () => {
    expect.hasAssertions();
    expect(toSpacedSentenceCase('test best rest')).toBe('Test best rest');
  });

  it('replaces all underscores with spaces', async () => {
    expect.hasAssertions();
    expect(toSpacedSentenceCase('test_best_rest')).toBe('Test best rest');
  });
});

describe('::toFirstLowerCase', () => {
  it('lower-cases the first letter of the passed string', async () => {
    expect.hasAssertions();
    expect(toFirstLowerCase('Test Best Rest')).toBe('test Best Rest');
  });
});

describe('::scriptBasename', () => {
  it('gets trailing name component from string', async () => {
    expect.hasAssertions();

    expect(scriptBasename('Test Best Rest')).toBe('Rest');
    expect(scriptBasename('test')).toBe('test');
  });
});
