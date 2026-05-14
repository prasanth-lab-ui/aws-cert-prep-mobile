declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL?: string;
    GOOGLE_WEB_CLIENT_ID?: string;
  }
  const Config: NativeConfig;
  export default Config;
}
