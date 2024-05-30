import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';

const appConfig = {
  providers: [
    provideRouter(routes),
    BrowserAnimationsModule,
    HttpClientModule,
    provideHttpClient(),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),

  ],
}
bootstrapApplication(AppComponent,appConfig);
