#!/usr/bin/env node
/**
 * Upload a local file to a Google Drive folder using a service account.
 *
 * Required env: GDRIVE_SERVICE_ACCOUNT_JSON (entire JSON key as a string).
 * Required args: <local-file-path> <drive-file-name> <drive-folder-id>
 *
 * Prints the file id and webViewLink on success.
 */

const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

async function main() {
  const [, , filePath, fileName, folderId] = process.argv;
  if (!filePath || !fileName || !folderId) {
    console.error('Usage: node scripts/upload-to-drive.js <local-path> <file-name> <folder-id>');
    process.exit(1);
  }

  const raw = process.env.GDRIVE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.error('GDRIVE_SERVICE_ACCOUNT_JSON is not set');
    process.exit(1);
  }

  const credentials = JSON.parse(raw);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({version: 'v3', auth});

  console.log(`Uploading ${path.basename(filePath)} (${fs.statSync(filePath).size} bytes) as ${fileName}...`);

  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
      mimeType: 'application/vnd.android.package-archive',
    },
    media: {
      mimeType: 'application/vnd.android.package-archive',
      body: fs.createReadStream(filePath),
    },
    fields: 'id, name, webViewLink, webContentLink, size',
    supportsAllDrives: true,
  });

  const data = res.data;
  console.log('Uploaded:');
  console.log('  id:           ', data.id);
  console.log('  name:         ', data.name);
  console.log('  size:         ', data.size);
  console.log('  webViewLink:  ', data.webViewLink);
  console.log('  webContentLink:', data.webContentLink);

  // Best-effort: make the file viewable by anyone with the link.
  try {
    await drive.permissions.create({
      fileId: data.id,
      requestBody: {role: 'reader', type: 'anyone'},
      supportsAllDrives: true,
    });
    console.log('Set permissions: anyone-with-link can view.');
  } catch (err) {
    console.warn('Could not set public permission (this is OK for restricted folders):', err.message);
  }
}

main().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});
