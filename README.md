# FinTrack

Mobile app for tracking personal finances, built with React Native and Expo.

## Features

- Sign up / sign in, several users on one device, each user has own data
- Passwords are stored as SHA-256 hash (expo-crypto)
- Income and expense transactions with categories, notes, dates and receipt photos
- Transaction history with search, filters by type and category, sorting
- Statistics for week / month / year:
  - donut chart by categories
  - income vs expenses bar chart
  - balance trend line chart
  - comparison with previous period, daily average, savings rate
- Monthly budgets for categories with progress bars
- Saving goals with deposits and withdrawals
- Local notifications: daily reminder, budget alerts (80% / 100%), goal reached
- Profile with avatar from camera or gallery, change name / email / password
- Light, dark and system theme
- Multiple currencies
- Demo data generator

## Tech stack

- Expo Router (file based navigation, tabs + stack)
- Context API for theme, auth and finance state
- AsyncStorage for local storage
- react-hook-form + zod for forms validation
- react-native-gifted-charts for charts
- expo-image-picker, expo-notifications, expo-linear-gradient, expo-haptics

## Project structure

```
src/
  app/            screens (routes)
    (tabs)/       bottom tabs: home, history, add, statistics, profile
    auth/         sign in / sign up
    transaction/  details and edit screens
  components/     ui components grouped by feature
  constant/       colors, categories, currencies
  context/        providers (theme, auth, finance)
  hooks/          contexts and hooks to use them
  layout/         root stack layout
  notification/   notifications setup and reminders
  services/       storage and auth logic
  types/          typescript types
  utils/          date, format and statistics helpers
```

## Run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go app.
