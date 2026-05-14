// Build-time configuration. The CI workflow overwrites this file from
// GitHub Secrets before each release build. Edit locally for dev.
//
// Do NOT import `react-native-config` — it's been removed to keep the
// Android build self-contained.

export const Config = {
  /** REST API base URL. Use http://10.0.2.2:5000/api for the Android emulator. */
  API_BASE_URL: 'http://10.0.2.2:5000/api',

  /**
   * Google Sign-In Web OAuth client ID. Required so the mobile SDK returns
   * an idToken the backend can verify. Get it from Google Cloud Console
   * → APIs & Services → Credentials → OAuth 2.0 Client IDs → Web.
   */
  GOOGLE_WEB_CLIENT_ID: '',
};
