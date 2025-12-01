# @upfluence/tsconfig

Shared TypeScript configuration for the Upfluence Coding Challenge monorepo.

## Usage

Extend this configuration in your `tsconfig.json`:

```json
{
  "extends": "@upfluence/tsconfig/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```
