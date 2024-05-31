import { Component, Inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FirebaseModule } from '../../../firebase.module';
import { Image } from '../../../models/image/image.model';
import { MatSnackBar } from '@angular/material/snack-bar';


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
    FirebaseModule,
  ],
})
export class TagDialogComponent {
  tagCtrl = new FormControl('');
  tags: string[] = [];
  loadingImages: boolean = false;

  constructor(
    public db: AngularFireDatabase,
    public dialogRef: MatDialogRef<TagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar 

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
    }
    this.tagCtrl.setValue('');
  }

  remove(tag: string): void {
    if (this.tags.length > 1) {
      const index = this.tags.indexOf(tag);
      if (index >= 0) {
        this.tags.splice(index, 1);
      }
    }else {
      this.snackBar.open('At least one tag must remain', 'Close', {
        duration: 2000 
      });
    }
  }

  async save(): Promise<void> {
    const image = this.data.image as Image;
    const id = await this.getDocumentId(image);
    if (id) {
      this.db
        .object(`images/${id}`)
        .update({ tags: this.tags })
        .then(() => {
          this.dialogRef.close(this.tags);
          this.data.image.tags = this.tags;
        })
        .catch((error) => {
          console.error('Error updating image: ', error);
        });
    } else {
      console.error('Document ID not found');
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  async getDocumentId(image: Image): Promise<string | undefined> {
    let id: string | undefined = undefined;
    await new Promise<void>((resolve, reject) => {
      this.db
        .list('images')
        .snapshotChanges()
        .subscribe((data) => {
          data.forEach((doc) => {
            const docId = String(doc.payload.key);
            const imageData = doc.payload.val() as Image;

            if (this.isSameImage(image, imageData)) {
              id = docId;
              resolve();
            }
          });
        });
    });
    return id;
  }
  isSameImage(image1: Image, image2: Image) {
    return image1.url === image2.url && image1.name === image2.name;
  }
}
