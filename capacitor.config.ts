import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.criflab.dalefutbol',
  appName: 'DaleFutbol+',
  webDir: 'dist/dalefutbol/browser',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId: 'TU_WEB_CLIENT_ID_DE_FIREBASE',
      // offline: true
    }
  }
};

export default config;
