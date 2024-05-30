import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import {  AngularFireDatabaseModule } from '@angular/fire/compat/database';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  exports: [AngularFireModule,AngularFireDatabaseModule],
})
export class FirebaseModule {}
