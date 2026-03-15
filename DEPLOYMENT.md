# BroCycle - Deployment Guide

## Development (Expo Go)

The fastest way to run on a physical device:

1. Install **Expo Go** on your phone (App Store / Play Store)
2. Run `npx expo start` on your computer
3. Scan the QR code with your phone camera (iOS) or Expo Go (Android)
4. The app loads over local Wi-Fi; code changes reload instantly

If your phone and computer are not on the same Wi-Fi:

```bash
npx expo start --tunnel
```

## Production Build (EAS)

For app store distribution:

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo
eas login

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

## Pre-commit Setup

```bash
pip install pre-commit
pre-commit install
```

This ensures all code passes formatting, linting, type checking, and tests before commit.
