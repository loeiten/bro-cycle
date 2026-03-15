# BroCycle

A mobile app for partners to track and understand their partner's menstrual cycle.
Helps "bros" (or any partner) be more supportive by showing cycle phases, predicting
mood changes, and providing educational insights.

## Features

- **Cycle tracking** - Log when bleeding starts
- **Phase display** - Visual vertical timeline showing current phase and position
- **Mood logging** - Record daily mood (1-5 scale) with optional notes
- **Adaptive prediction** - Linear regression on cycle lengths with probability distributions
- **Phase warnings** - Local notifications before luteal and PMS phases
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
- Expo Go app on your phone (iOS App Store / Google Play Store)

### Install & Run

```bash
npm install
npx expo start
```

Scan the QR code with your phone camera (iOS) or Expo Go app (Android).

### Development

```bash
npm test                # Run tests
npm run test:coverage   # Tests with coverage
npm run lint            # ESLint
npm run format:check    # Prettier check
npm run typecheck       # TypeScript check
```

## Tech Stack

- React Native + Expo SDK 55
- TypeScript
- expo-router v4 (file-based routing)
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
