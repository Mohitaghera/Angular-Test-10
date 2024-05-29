import { Component, Inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FirebaseModule } from '../../../firebase.module';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';



@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AngularFirestoreModule
  ],
})
export class TagDialogComponent {
  tagCtrl = new FormControl('');
  tags: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<TagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private fireStore: AngularFirestore
  ) {
    this.tags = data.image.tags ? [...data.image.tags] : [];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTag(): void {
    const value = this.tagCtrl.value?.trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
      console.log('add', this.tags);
    }
    this.tagCtrl.setValue('');
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      console.log('remove', this.tags);
    }
  }

  save(): void {

    }

  // save(): void {
  //   // Query Firebase to find the document ID based on certain criteria
  //   this.fireStore
  //     .collection('images', (ref) =>
  //       ref.where('name', '==', this.data.image.name).limit(1)
  //     )
  //     .snapshotChanges()
  //     .subscribe((images) => {
  //       if (images.length > 0) {
  //         const imageId = images[0].payload.doc.id;
  //         // Update the tags for the image in Firebase
  //         this.fireStore
  //           .doc(`images/${imageId}`)
  //           .update({ tags: this.tags })
  //           .then(() => {
  //             console.log('Tags updated successfully');
  //             this.dialogRef.close(this.tags);
  //           })
  //           .catch((error) => {
  //             console.error('Error updating tags: ', error);
  //           });
  //       } else {
  //         console.error('Image not found.');
  //       }
  //     });
  // }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
