import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';

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
  ],
})
export class UploadDialogComponent {
  imageName: string = '';
  tags: string = '';
  selectedFile!: File;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    private imageService: ImageService
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result;
    };
    reader.readAsDataURL(file);
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpload(): void {
    
    if (this.selectedFile && this.imageName) {
      const tagsArray = this.tags ? this.tags.split(',') : [];

      this.imageService
        .uploadImage(this.selectedFile, this.imageName, tagsArray)
        .subscribe(
          () => {
            this.dialogRef.close('uploaded');
          }
        );
    }
  }
}
