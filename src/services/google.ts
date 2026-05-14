import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import {Config} from '../config';

let configured = false;

export const configureGoogleSignIn = () => {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
    scopes: ['email', 'profile'],
  });
  configured = true;
};

export const getGoogleIdToken = async (): Promise<string> => {
  configureGoogleSignIn();
  if (!Config.GOOGLE_WEB_CLIENT_ID) {
    throw new Error('GOOGLE_WEB_CLIENT_ID is not set. Edit src/config.ts (or set the secret in CI).');
  }
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  const userInfo = await GoogleSignin.signIn();
  // RN GSI v11 returns the idToken inside userInfo.data; older versions placed it at the top level.
  const idToken: string | undefined =
    (userInfo as any)?.data?.idToken || (userInfo as any)?.idToken;
  if (!idToken) {
    throw new Error('Google did not return an idToken. Check GOOGLE_WEB_CLIENT_ID and SHA-1 binding.');
  }
  return idToken;
};

export const signOutGoogle = async () => {
  try {
    if (await GoogleSignin.isSignedIn?.()) {
      await GoogleSignin.signOut();
    }
  } catch {
    // ignore — sign-out is best-effort
  }
};

export {statusCodes as googleStatusCodes};
