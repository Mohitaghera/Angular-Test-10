import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ImageService } from '../../../services/image.service';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    NgxDropzoneModule,
    MatButtonModule,
  ],
})
export class UploadDialogComponent {
  imageName: string = '';
  tags: string = '';
  selectedFile!: File;
  selectedImage: string | ArrayBuffer | null = null;
  selectedFileName: string | null = null;
  formValid: boolean | null = false;

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    private imageService: ImageService
  ) {}

  onFileSelected(event: NgxDropzoneChangeEvent) {
    if (event && event.addedFiles && event.addedFiles.length > 0) {
      this.selectedFile = event.addedFiles[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  onUpload(): void {
    if (this.selectedFile && this.imageName) {
      const tagsArray = this.tags ? this.tags.split(',') : [];

      this.imageService
        .uploadImage(this.selectedFile, this.imageName, tagsArray)
        .subscribe(() => {
          this.dialogRef.close('uploaded');
        });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
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
