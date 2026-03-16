# BroCycle

A mobile app for partners to track and understand their partner's menstrual cycle.
Helps "bros" (or any partner) be more supportive by showing cycle phases, predicting
mood changes, and providing educational insights.

## Features

- **Cycle tracking** - Log when bleeding starts
- **Phase display** - Visual vertical timeline showing current phase and position
- **Mood logging** - Record daily mood (1-5 scale) with optional notes
- **Adaptive prediction** - Linear regression on cycle lengths with probability distributions
- **Phase warnings** - Daily push notifications at 07:30 before each phase (Follicular, Luteal, PMS, Period)
- **Educational insights** - Partner-focused tips for each phase
- **Cycle history** - View past cycles with mood overlay

## A Note to All Bros

Being a good partner means showing up — not just with an app, but with attention,
patience, and care. Take the time to understand your significant other. Listen when
they talk about how they feel. Be present. The best thing you can do isn't tracking
a cycle — it's letting your partner know they're supported, every single day.

## Privacy

All data is stored locally on your device using SQLite. Nothing is ever sent to any server.

## Getting Started

### Prerequisites

- Node.js 18+
- JDK 17 (for Android builds): `brew install temurin@17`
- Android SDK (for Android builds): `brew install android-commandlinetools`

### Install & Run (Expo Go)

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone. Note: push notifications do not work in Expo Go (Android) since SDK 53.

### Development Build (recommended for full features)

A development build compiles native code so all features (including push notifications) work:

```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home \
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools \
npx expo run:android
```

To install on a physical phone, connect via USB with USB debugging enabled, then:

```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home \
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools \
npx expo run:android --device
```

Or transfer `android/app/build/outputs/apk/debug/app-debug.apk` to your phone manually.

### Tests & Checks

```bash
npm test                # Run tests
npm run test:coverage   # Tests with coverage
npm run lint            # ESLint
npm run format:check    # Prettier check
npm run typecheck       # TypeScript check
```

## Tech Stack

- React Native + Expo SDK 54
- TypeScript
- expo-router v6 (file-based routing)
- expo-sqlite (local database)
- date-fns (date math)
- Jest + React Native Testing Library

## Project Structure

```
app/              # Screens (expo-router)
src/
  components/     # Reusable UI components
  context/        # React Context (app state)
  services/       # Business logic (pure functions)
  repositories/   # Database access (SQL)
  types/          # TypeScript interfaces
  constants/      # Theme, phase definitions
  utils/          # Date helpers, validators
__tests__/        # Test files (mirrors src/)
```
