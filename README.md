# AWS Cert Prep Mobile 📱

Android mobile app for AWS Cloud Practitioner Certification preparation.
Built with React Native — companion to the desktop web app.

## Features
- 🔐 Auth (Login, Register, OTP Email Verify, Forgot/Reset Password)
- 🏠 Dashboard with stats & performance trend chart
- ⚙️ Practice Setup (category multi-select, question count, mode)
- ❓ Question Practice (Practice mode with instant feedback / Test mode with timer)
- 📊 Results screen with score breakdown
- 📈 Analytics with category-wise performance
- 👥 Community leaderboard
- 💎 Premium Plans

## Tech Stack
- **React Native 0.73** (bare workflow)
- **React Navigation** (native-stack + bottom-tabs)
- **Axios** for API calls
- **AsyncStorage** for JWT token persistence
- **react-native-chart-kit** for charts
- **react-native-vector-icons** for icons

## Getting Started

### Prerequisites
- Node.js >= 18
- JDK 17
- Android Studio + Android SDK
- An Android device or emulator (API 21+)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/prasanth-lab-ui/aws-cert-prep-mobile.git
cd aws-cert-prep-mobile

# 2. Install dependencies
npm install

# 3. Configure API URL
cp .env.example .env
# Edit .env with your backend URL

# 4. Link vector icons (Android)
npx react-native-asset

# 5. Start Metro bundler
npm start

# 6. Run on Android (in a new terminal)
npm run android
```

### Build APK (Release)

```bash
# Generate a signing key (first time only)
cd android/app
keytool -genkey -v -keystore aws-cert-prep.keystore -alias aws-cert-prep -keyalg RSA -keysize 2048 -validity 10000

# Build
cd ../..
npm run build:android

# APK Location:
# android/app/build/outputs/apk/release/app-release.apk
```

## Project Structure

```
src/
├── App.tsx                  # Root navigator
├── services/
│   └── api.ts               # Axios instance + interceptors
├── context/
│   └── AuthContext.tsx      # Auth state (login/register/logout)
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── VerifyEmailScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   └── ResetPasswordScreen.tsx
│   ├── main/
│   │   ├── DashboardScreen.tsx
│   │   ├── PracticeSetupScreen.tsx
│   │   ├── QuestionPracticeScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   ├── CommunityScreen.tsx
│   │   └── PremiumPlansScreen.tsx
└── components/
    ├── StatCard.tsx
    ├── SessionCard.tsx
    └── OptionButton.tsx
```

## Backend
The same Node.js + PostgreSQL backend from the desktop app powers this mobile app.
See [App repo](https://github.com/prasanth-lab-ui/App) for backend setup.
