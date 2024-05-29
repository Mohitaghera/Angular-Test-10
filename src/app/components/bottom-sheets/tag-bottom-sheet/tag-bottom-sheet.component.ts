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
  ],
})
export class TagDialogBottomSheetComponent {
  tagCtrl = new FormControl('');
  tags: string[] = [];

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<TagDialogBottomSheetComponent>
  ) {
    this.tags = data.image.tags ? [...data.image.tags] : [];
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  save(): void {
    this.bottomSheetRef.dismiss(this.data.tags);
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
}
