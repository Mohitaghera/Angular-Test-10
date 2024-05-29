import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  exports: [AngularFirestoreModule, AngularFireModule],
})
export class FirebaseModule {}
