# BroCycle - Developer Guide

## Quick Commands

```bash
npm test                    # Run tests
npm run test:coverage       # Run tests with coverage report
npm run lint                # ESLint check
npm run format:check        # Prettier check
npm run format              # Auto-format with Prettier
npm run typecheck           # TypeScript type check (use: node node_modules/typescript/lib/tsc.js --noEmit)
npx expo start              # Start dev server
```

Note: Node.js 25+ requires `NODE_OPTIONS='--localstorage-file=/tmp/jest-ls'` for Jest.
The `npm test` and `npm run test:coverage` scripts already include this.

## Architecture

Three-layer pattern: **Screen -> Service -> Repository -> expo-sqlite**

- `app/` - Expo Router screens (no business logic)
- `src/services/` - Pure functions for cycle math, predictions, notifications
- `src/repositories/` - SQL queries via expo-sqlite
- `src/context/CycleContext.tsx` - App-wide state provider
- `src/components/` - Reusable UI components

## Testing

- Jest + React Native Testing Library
- Mocks for expo-sqlite, expo-notifications, expo-router in `jest.setup.ts`
- 85% coverage threshold enforced
- Run specific test: `NODE_OPTIONS='--localstorage-file=/tmp/jest-ls' npx jest __tests__/path/to/test.ts`

## Pre-commit

Uses `pre-commit` Python framework. Run `pre-commit install` to set up hooks.
Order: pre-commit-hooks -> markdownlint -> gitleaks -> prettier -> eslint -> tsc -> jest

## Security

Never ignore security warnings (e.g. Dependabot alerts, `npm audit` vulnerabilities). Always fix them immediately, even if they are low severity or in transitive/dev dependencies.
