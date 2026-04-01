module.exports = {
    root: true,
    extends: ['@callstack'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'simple-import-sort', 'barrel-files'],
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports
            ['^\\u0000'],
            // React, React Native imports
            ['^react$', '^react-native$'],
            // Packages import
            ['^@?\\w'],
            // Anything not matched in another group.
            ['^'],
            // Relative imports.
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'prettier/prettier': 'error',
      'react-native/no-raw-text': 'off',
      'import/no-extraneous-dependencies': 'off',
      'barrel-files/avoid-re-export-all': 'error',
      'react-native-a11y/has-valid-accessibility-ignores-invert-colors': 'off',
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        rules: {
          '@typescript-eslint/no-shadow': ['error'],
          'no-shadow': 'off',
          'no-undef': 'off',
        },
      },
      {
        files: ['jest.setup.js'],
        env: {
          jest: true,
        },
      },
    ],
  };
