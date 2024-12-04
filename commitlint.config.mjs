export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-case': [1, 'always', 'sentence-case'],
    'body-full-stop': [1, 'always'],
    'header-trim': [1, 'always'],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'feature',
        'fix',
        'perf',
        'revert',
        'build',
        'docs',
        'style',
        'refactor',
        'test',
        'ci',
        'cd',
        'chore'
      ]
    ]
  }
};
