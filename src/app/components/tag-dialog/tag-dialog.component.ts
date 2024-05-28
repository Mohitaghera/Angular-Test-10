import { Component, Inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

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
  ],
})
export class TagDialogComponent {
  tagCtrl = new FormControl('');
  tags: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<TagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  save(): void {
    this.dialogRef.close(this.tags);
  }
}
