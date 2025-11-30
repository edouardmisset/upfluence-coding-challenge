import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import sonarjs from 'eslint-plugin-sonarjs'

export default defineConfig([
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/coverage',
      '**/.astro',
      '**/env.d.ts',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  eslintPluginUnicorn.configs.recommended,
  sonarjs.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      // No shadow variable
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      // No magic numbers
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': [
        'warn',
        {
          ignore: [-1, 0, 1, 1000],
          ignoreArrayIndexes: true,
          ignoreEnums: true,
          ignoreReadonlyClassProperties: true,
        },
      ],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      "unicorn/empty-brace-spaces": "off",
      "unicorn/prefer-add-event-listener": "off",
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  },
])
