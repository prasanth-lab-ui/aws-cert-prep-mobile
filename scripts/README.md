# Scripts

Helpers used by the GitHub Actions workflow in `.github/workflows/android-release.yml`.

## upload-to-drive.js

Uploads a file to Google Drive using a service account.

```
GDRIVE_SERVICE_ACCOUNT_JSON='<paste service account JSON>' \
  node scripts/upload-to-drive.js <local-apk-path> <name-in-drive.apk> <folder-id>
```

The service account must have **Editor** access to the target Drive folder (share the
folder with the service account's `client_email`).
