import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image/image.model';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UploadDialogComponent } from '../dialogs/upload-dialog/upload-dialog.component';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseModule } from '../../firebase.module';
import { ImageViewComponent } from '../image-view/image-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TagDialogComponent } from '../dialogs/tag-dialog/tag-dialog.component';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DeleteBottomSheetComponent } from '../bottom-sheets/delete-bottom-sheet/delete-bottom-sheet.component';
import { TagDialogBottomSheetComponent } from '../bottom-sheets/tag-bottom-sheet/tag-bottom-sheet.component';
import { UploadDialogBottomSheetComponent } from '../bottom-sheets/upload-bottom-sheet/upload-bottom-sheet.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FirebaseModule, MatBottomSheetModule,MatTooltipModule,MatDialogModule]
})
export class GalleryComponent implements OnInit {
  images: Image[] = [];
  displayedImages: Image[] = [];
  searchText: string = '';
  sortOption: string = 'date';
  loadingImages: boolean = false;
  items: Observable<any[]>;

  constructor(
    private imageService: ImageService,
    public dialog: MatDialog,
    private db: AngularFireDatabase,
    private bottomSheet: MatBottomSheet,
    private breakpointObserver: BreakpointObserver
  ) {
    this.items = new Observable<any[]>();
  }

  ngOnInit(): void {
    this.loadingImages = true;
    this.imageService.getImages().subscribe((images: Image[]) => {
      this.images = Object.values(images);
      this.displayedImages = Object.values(images);
      this.loadingImages = false;
    });
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
  searchImages(): void {
    if (this.searchText.trim() === '') {
      this.displayedImages = [...this.images];
      return;
    }

    this.displayedImages = this.images.filter((image) => {
      const searchTextLowerCase = this.searchText.toLowerCase();
      const imageTagsLowerCase = image.tags.map((tag) => tag.toLowerCase());

      return imageTagsLowerCase.some((tag) =>
        tag.includes(searchTextLowerCase)
      );
    });
  }

  resetSearch(): void {
    this.searchText = '';
    this.searchImages();
  }

  sortImages(): void {
    switch (this.sortOption) {
      case 'name':
        this.displayedImages.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'date':
        this.displayedImages.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case 'size':
        this.displayedImages.sort((a, b) => a.size - b.size);
        break;
      default:
        this.displayedImages.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
    }
  }

  deleteImage(event: MouseEvent, image: Image): void {
    event.stopPropagation();

    const deleteAction = async () => {
      this.loadingImages = true;
      const id = await this.getDocumentId(image);
      if (id) {
        this.imageService.deleteImage(id).subscribe(() => {
          this.images = this.images.filter((img) => img.id !== image.id);
          this.displayedImages = this.displayedImages.filter(
            (img) => img.id !== image.id
          );
          this.loadingImages = false;
        });
      }
    };

    const isMobile = this.breakpointObserver.isMatched('(max-width: 767px)');

    if (isMobile) {
      const bottomSheetRef = this.bottomSheet.open(DeleteBottomSheetComponent, {
        data: { image: { name: image.name } },
      });

      bottomSheetRef.afterDismissed().subscribe(async (result) => {
        if (result) {
          await deleteAction();
        }
      });
    } else {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '500px',
        data: { image: { name: image.name } },
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          await deleteAction();
        }
      });
    }
  }
  openUploadDialog(): void {
    const uploadAction = async () => {
      this.loadingImages = true;
      this.imageService.getImages().subscribe((response: any[]) => {
        if (response && typeof response === 'object') {
          const imagesArray = Object.values(response);
          this.images = imagesArray;
          this.displayedImages = imagesArray;
        }
        this.loadingImages = false;
      });
    };

    const isMobile = this.breakpointObserver.isMatched('(max-width: 767px)');

    if (isMobile) {
      const bottomSheetRef = this.bottomSheet.open(
        UploadDialogBottomSheetComponent
      );

      bottomSheetRef.afterDismissed().subscribe(async (result) => {
        if (result === 'uploaded') {
          await uploadAction();
        }
      });
    } else {
      const dialogRef = this.dialog.open(UploadDialogComponent, {
        width: '400px',
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result === 'uploaded') {
          await uploadAction();
        }
      });
    }
  }

  openImageView(image: Image): void {
    this.dialog.open(ImageViewComponent, {
      width: '800px',
      data: { image },
    });
  }

  openTag(event: MouseEvent, image: Image): void {
    event.stopPropagation();

    const isMobile = this.breakpointObserver.isMatched('(max-width: 767px)');

    if (isMobile) {
      const bottomSheetRef = this.bottomSheet.open(
        TagDialogBottomSheetComponent,
        {
          data: { image },
        }
      );

      bottomSheetRef.afterDismissed().subscribe((result) => {});
    } else {
      const dialogRef = this.dialog.open(TagDialogComponent, {
        width: '400px',
        data: { image },
      });

      dialogRef.afterClosed().subscribe((result) => {
        
      });
    }
  }
}
