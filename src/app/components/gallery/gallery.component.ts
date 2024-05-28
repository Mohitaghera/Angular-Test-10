import { Component, OnInit, input } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image/image.model';
import { MatDialog } from '@angular/material/dialog';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseModule } from '../../firebase.module';
import { ImageViewComponent } from '../image-view/image-view.component';
import { TagDialogComponent } from '../tag-dialog/tag-dialog.component';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone:true,
  imports:[CommonModule,FormsModule,FirebaseModule ],
})
export class GalleryComponent implements OnInit {
  images: Image[] = [];
  displayedImages: Image[] = [];  
  searchText: string = '';
  sortOption: string = 'date';
  loadingImages: boolean = false;
  items: Observable<any[]>;


  constructor(private imageService: ImageService, public dialog: MatDialog, private db: AngularFireDatabase) {
    this.items = new Observable<any[]>();
  }

  ngOnInit(): void {

    this.loadingImages = true;
    this.imageService.getImages().subscribe((images : Image[]) => {

      this.images = Object.values(images);
      this.displayedImages = Object.values(images);
      this.loadingImages = false;
      console.log(new Date(this.displayedImages[0].date).getTime );
      
    });
  }
 async getDocumentId(image:Image): Promise<string | undefined> {
    let id: string | undefined = undefined;
    await new Promise<void>((resolve, reject) => {
    this.db.list('images').snapshotChanges().subscribe(data => {
      data.forEach(doc => { 
        const docId = String(doc.payload.key); 
        const imageData = doc.payload.val() as Image;
         
        if (this.isSameImage(image, imageData)) {
          id = docId;
          resolve(); 
        }
      })
    })
    })
    return id;
  }
  isSameImage(image1:Image, image2:Image) {
    return image1.url === image2.url && image1.name === image2.name;
  }
  searchImages(): void {
   
      if (this.searchText.trim() === '') {
        this.displayedImages = [...this.images];
        return;
      }
    
      this.displayedImages = this.images.filter(image => {
        const searchTextLowerCase = this.searchText.toLowerCase();
        const imageTagsLowerCase = image.tags.map(tag => tag.toLowerCase());
        
        return imageTagsLowerCase.some(tag => tag.includes(searchTextLowerCase));
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
        this.displayedImages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'size':
        this.displayedImages.sort((a, b) => a.size - b.size);
        break;
      default:
        this.displayedImages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }
  }
  
  
   deleteImage(event:MouseEvent,image: Image): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: { image: { name: image.name } }
    });

    dialogRef.afterClosed().subscribe(async result => {
      
      if (result) {
        this.loadingImages = true;
       const id = await this.getDocumentId(image)       
       if (id) {
        this.imageService.deleteImage(id).subscribe(
          () => {            
            this.images = this.images.filter(img => img.id !== image.id);
            this.displayedImages = this.displayedImages.filter(img => img.id !== image.id);
            this.loadingImages = false;
          }
        );
      }
    }
    });
  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {      
      if (result === 'uploaded') {
        this.loadingImages = true;
        this.imageService.getImages().subscribe((response : any[]) => {
          if (response && typeof response === 'object') {
            const imagesArray = Object.values(response);
            this.images = imagesArray;
            this.displayedImages = imagesArray;
          }
          this.loadingImages = false;
        });
      }
    });
  }

  openImageView(image: Image): void {
    this.dialog.open(ImageViewComponent, {
      width: '800px',
      data: { image }
    });
  }

  openTagDialog(event: MouseEvent, image: Image): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(TagDialogComponent, {
      width: '400px',
      data: { image }
    });


    
  }
}