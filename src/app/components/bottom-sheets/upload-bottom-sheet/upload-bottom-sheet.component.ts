import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'app-upload-dialog-bottom-sheet',
  templateUrl: './upload-bottom-sheet.component.html',
  styleUrls: ['./upload-bottom-sheet.component.scss'],standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    DragDropModule,
    NgxDropzoneModule,
    MatButtonModule,
  ],
})
export class UploadDialogBottomSheetComponent {

  imageName: string = '';
  tags: string = '';
  selectedFile!: File;
  selectedImage: string | ArrayBuffer | null = null;
  selectedFileName: string | null = null;
  formValid: boolean | null = false;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<UploadDialogBottomSheetComponent>,
    private imageService: ImageService

  ) { }

  onFileSelected(event: NgxDropzoneChangeEvent) {
    if (event && event.addedFiles && event.addedFiles.length > 0) {
      this.selectedFile = event.addedFiles[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  onUpload(): void {
    if (this.selectedFile && this.imageName) {
      const tagsArray = this.tags ? this.tags.split(',') : [];

      this.imageService
        .uploadImage(this.selectedFile, this.imageName, tagsArray)
        .subscribe(() => {
          this.bottomSheetRef.dismiss('uploaded');
        });
    }
  }

  @HostListener('document:dragover', ['$event'])
  onDocumentDragOver(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
  }

  @HostListener('document:drop', ['$event'])
  onDocumentDrop(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
  }

  onDragOver(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
  }

  onDragEnter(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();
  }

  updateFormValidity(form: NgForm) {
    this.formValid = form.valid && !!this.selectedFile;
  }

}
