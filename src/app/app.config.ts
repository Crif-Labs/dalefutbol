import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService
} from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { IonicModule } from '@ionic/angular';

// Solo para proteger Analytics en SSR
const isBrowser = typeof window !== 'undefined';

const firebaseConfig = {
  projectId: 'dale-futbol',
  appId: '1:259286345543:web:1e7f1fe628480f6fe14e62',
  databaseURL: 'https://dale-futbol-default-rtdb.firebaseio.com',
  storageBucket: 'dale-futbol.firebasestorage.app',
  apiKey: 'AIzaSyAKPbzFospdPnLWEHmlw4lQg6ZKWghdwEE',
  authDomain: 'dale-futbol.firebaseapp.com',
  messagingSenderId: '259286345543',
  measurementId: 'G-XVDWBT7J3L'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(IonicModule.forRoot()),
    provideClientHydration(withEventReplay()),

    // Firebase App
    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    // Auth (SIN emulador)
    provideAuth(() => getAuth()),

    // Analytics (protegido para SSR)
    provideAnalytics(() => (isBrowser ? getAnalytics() : ({} as any))),
    ScreenTrackingService,
    UserTrackingService,

    // Firestore (SIN emulador)
    provideFirestore(() => getFirestore()),

    // Realtime Database (SIN emulador)
    provideDatabase(() => getDatabase()),

    // Messaging: lo puedes dejar comentado hasta que lo usemos
    // provideMessaging(() => getMessaging()),

    // Storage (SIN emulador)
    provideStorage(() => getStorage()),

    // Functions (SIN emulador)
    provideFunctions(() => getFunctions()),

    provideAnimationsAsync()
  ]
};
