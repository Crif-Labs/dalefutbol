import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.criflab.dalefutbol',
  appName: 'DaleFutbol+',
  webDir: 'dist/dalefutbol/browser',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId: '259286345543-kuj233b4dt179jnctpi8s8gsi3kj43l6.apps.googleusercontent.com',
      // offline: true
    }
  }
};

export default config;
