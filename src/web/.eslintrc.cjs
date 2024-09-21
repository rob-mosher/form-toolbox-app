module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'tailwind.config.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest', sourceType: 'module',
  },
  settings: {
    react: { version: '18.2' },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        'react/require-default-props': 'off',
      },
    },
  ],
  plugins: ['react-refresh'],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'import/extensions': 'off',
    'import/order': [
      'warn',
      {
        'groups': [
          'external',
          'builtin',
          'internal',
          'sibling',
          'parent',
          'index',
        ],
        'newlines-between': 'never',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': false,
        },
      },
    ],
    'jsx-a11y/label-has-associated-control': ['warn'],
    'jsx-quotes': ['error', 'prefer-single'],
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    'react/prop-types': ['off'],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'semi': ['warn', 'never'],
  },
};
