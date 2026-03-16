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

## Development Builds

Expo Go does not support push notifications on Android (removed in SDK 53). To test notifications or any native module, use a development build.

### Build for emulator

```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home \
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools \
npx expo run:android
```

Note: Java 25 is not supported by Gradle — use JDK 17 (`temurin-17`).

### Build for physical phone

1. Enable USB debugging on the phone (Settings > Developer options > USB debugging)
2. Connect the phone via USB and verify: `adb devices`
3. Run the same build command — it will install directly on the connected device:

```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home \
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools \
npx expo run:android --device
```

4. Alternatively, build the APK and transfer it manually:

```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home \
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools \
npx expo run:android
```

The APK is at `android/app/build/outputs/apk/debug/app-debug.apk`. Transfer it to your phone (e.g. via `adb install`, AirDrop, email, or file sharing) and install.

### Emulator tools

The Android SDK is installed via Homebrew at `/opt/homebrew/share/android-commandlinetools`. Useful commands:

```bash
ADB=/opt/homebrew/share/android-commandlinetools/platform-tools/adb
$ADB devices                                    # List connected devices
$ADB -s emulator-5554 shell screencap -p /sdcard/screen.png  # Screenshot
$ADB -s emulator-5554 pull /sdcard/screen.png /tmp/screen.png
$ADB -s emulator-5554 shell pm clear <package>  # Clear app data
$ADB -s emulator-5554 shell input tap X Y       # Tap at coordinates
```

## Documentation

Always keep README.md and CLAUDE.md up to date when making changes that affect developer workflows, architecture, commands, or project setup.

## Pre-commit

Uses `pre-commit` Python framework. Run `pre-commit install` to set up hooks.
Order: pre-commit-hooks -> markdownlint -> gitleaks -> prettier -> eslint -> tsc -> jest

## Git

Do not use `git stash`. If you need to check the state before changes, use a worktree or a separate branch instead.

## Security

Never ignore security warnings (e.g. Dependabot alerts, `npm audit` vulnerabilities). Always fix them immediately, even if they are low severity or in transitive/dev dependencies.
