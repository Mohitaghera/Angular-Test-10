import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FirebaseModule } from '../../../firebase.module';
import { Image } from '../../../models/image/image.model';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-tag-dialog-bottom-sheet',
  templateUrl: './tag-bottom-sheet.component.html',
  styleUrls: ['./tag-bottom-sheet.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    MatBottomSheetModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    FirebaseModule
  ],
})
export class TagDialogBottomSheetComponent {
  tagCtrl = new FormControl('');
  tags: string[] = [];

  constructor(
    public db: AngularFireDatabase,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<TagDialogBottomSheetComponent>
  ) {
    this.tags = data.image.tags ? [...data.image.tags] : [];
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  async save(): Promise<void>{    
    const image = this.data.image as Image; 
    const id =await  this.getDocumentId(image)    
    if (id) {
      this.db.object(`images/${id}`).update({ tags: this.tags })
        .then(() => {
          this.bottomSheetRef.dismiss(this.tags);
          this.data.image.tags = this.tags;
        })
        .catch(error => {
          console.error('Error updating image: ', error);
        });
    } else {
      console.error('Document ID not found');
    }
  }

  addTag(): void {
    const value = this.tagCtrl.value?.trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }
    this.tagCtrl.setValue('');
  }
  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
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
