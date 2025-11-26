import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  { ignores: ['**/dist', '**/node_modules', '**/coverage'] },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
