# AWS Cert Prep Mobile

Android mobile app for AWS Cloud Practitioner Certification preparation. Built with
React Native 0.73 and a shared Node.js + PostgreSQL backend (the desktop app's
[App repo](https://github.com/prasanth-lab-ui/App)).

This repo is the Android sibling of the desktop web app: same backend, same
question bank (`questions_dump.sql`), mobile-tuned UI/UX.

## Features

- Auth: email/password registration with OTP verification + **Sign in with
  Google** ("Register with Gmail")
- Dashboard with stats, recent sessions and a quick-start CTA
- Practice Setup: pick mode (practice/test), categories, question count
- Question Practice: swipe between questions, instant feedback in practice mode,
  timer-friendly layout in test mode
- Results: score + per-question review with correct answers highlighted
- Analytics: trend line + per-category progress chart
- Community: global + weekly leaderboards
- Premium Plans + coupon redemption

## Tech stack

- React Native 0.73 (bare workflow), TypeScript
- React Navigation (native-stack + bottom-tabs)
- Axios + AsyncStorage for JWT persistence
- `@react-native-google-signin/google-signin` for Google OAuth
- `react-native-pager-view` for swipe-between-questions
- `react-native-chart-kit` for charts
- `react-native-config` for env vars

## Prerequisites

- Node.js >= 18
- JDK 17 (Temurin recommended)
- Android SDK (API 34, build-tools 34.0.0)
- An Android device or emulator (API 23+)
- Gradle 8.3+ (only needed locally to bootstrap the wrapper the first time)

## Setup

```bash
# 1. Install JS dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env: set API_BASE_URL and GOOGLE_WEB_CLIENT_ID

# 3. Bootstrap the Gradle wrapper (one-time, requires `gradle` on PATH)
cd android && gradle wrapper --gradle-version 8.3 && cd ..

# 4. Run Metro
npm start

# 5. Run on Android (in a separate terminal)
npm run android
```

### Google Sign-In setup

1. Create a Google Cloud project and enable the **Google Identity** APIs.
2. Create an **OAuth 2.0 Client ID** of type **Android**, bound to your
   release keystore's SHA-1 fingerprint (`keytool -list -v -keystore
   release.keystore`). Use package `com.awscertprepmobile`.
3. Create a second OAuth 2.0 Client ID of type **Web** — the mobile SDK uses
   this as `webClientId`/`serverClientId` so it gets back an idToken your
   backend can verify. Put its ID into `.env` as `GOOGLE_WEB_CLIENT_ID`.
4. The backend needs `GOOGLE_CLIENT_ID_ANDROID` set to the **Web** Client ID
   (Google issues id tokens with the Web client as the audience when
   `webClientId` is supplied on the mobile side). Optional fallback:
   `GOOGLE_CLIENT_ID_WEB`.

## Release APK — local build

```bash
cd android/app
keytool -genkeypair -v -keystore release.keystore -alias aws-cert-prep \
  -keyalg RSA -keysize 2048 -validity 10000
cd ../..

# Set the four MYAPP_RELEASE_* properties in android/gradle.properties
# (or pass them with -P flags). Do NOT commit them.

npm run build:android
# APK: android/app/build/outputs/apk/release/app-release.apk
```

## Release APK — CI (recommended)

The workflow `.github/workflows/android-release.yml` builds a signed APK on
every `v*` tag push (or via the GitHub **Run workflow** button) and uploads it
to Google Drive.

Required **GitHub Secrets** (Settings → Secrets and variables → Actions):

| Secret | What it is |
| --- | --- |
| `RELEASE_KEYSTORE_BASE64` | `base64 -w0 release.keystore` of your release keystore. |
| `RELEASE_STORE_PASSWORD` | Keystore password. |
| `RELEASE_KEY_ALIAS` | Key alias (e.g. `aws-cert-prep`). |
| `RELEASE_KEY_PASSWORD` | Key password (often same as store password). |
| `GOOGLE_WEB_CLIENT_ID` | Web OAuth client ID. Baked into the APK at build time. |
| `API_BASE_URL` | Production backend URL (optional; defaults to the existing host). |
| `GDRIVE_SERVICE_ACCOUNT_JSON` | Entire JSON key of a service account with Editor access to the target folder. |
| `GDRIVE_FOLDER_ID` | The folder ID you want APKs uploaded into. Share the folder with the service account email. |

The workflow will:

1. Bootstrap the Gradle wrapper.
2. Generate launcher icons (placeholder — swap in a real `ic_launcher.png` later).
3. Decode the keystore + write signing config to `gradle.properties`.
4. `./gradlew assembleRelease`.
5. Upload the APK as a workflow artifact, attach it to the GitHub Release on
   tag pushes, and (if Drive secrets are present) upload it to Google Drive.

Trigger a release:

```bash
git tag v1.0.0 && git push --tags
```

## Backend changes that pair with this app

Google Sign-In requires a new endpoint and a DB migration on the
[App repo](https://github.com/prasanth-lab-ui/App) (branch
`claude/desktop-to-android-conversion-0S8XP`):

- `POST /api/auth/google` — verifies the Google id token and returns a JWT.
- Migration `backend/migrations/001_add_google_id.sql` — adds `users.google_id`
  and makes `users.password_hash` nullable.

Deploy the backend changes **before** distributing the APK or the Google
sign-in path will return 404.

## Project structure

```
src/
  App.tsx                      Root navigator (Auth vs Main)
  context/AuthContext.tsx      JWT in AsyncStorage; login/register/googleSignIn/logout
  services/
    api.ts                     axios instance + interceptors
    auth.ts, questions.ts, sessions.ts, analytics.ts, leaderboard.ts
    google.ts                  GoogleSignin wrapper
  components/                  Button, Card, TextField, OTPInput, OptionButton, ScreenContainer, StatCard, SessionCard
  theme/                       colors, typography, spacing
  screens/
    auth/                      Login, Register, VerifyEmail, ForgotPassword, ResetPassword
    main/                      Dashboard, PracticeSetup, QuestionPractice, Results, Analytics, Community, PremiumPlans
android/                       Gradle project (icons + wrapper jar generated by CI)
.github/workflows/             Release APK build + Drive upload
scripts/upload-to-drive.js     Service-account Drive uploader used by CI
```

## Troubleshooting

- **`Cannot read property 'idToken' of null` on Google Sign-In** — your
  Android OAuth client SHA-1 doesn't match the keystore that signed the APK,
  or `GOOGLE_WEB_CLIENT_ID` is missing.
- **HTTP traffic blocked on Android 9+** — we set
  `android:usesCleartextTraffic="true"` so the dev/staging HTTP backend works.
  Tighten this in production.
- **Wrapper missing locally** — run `gradle wrapper --gradle-version 8.3`
  inside `android/` once. CI regenerates this automatically.
