import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Image } from '../models/image/image.model';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'https://image-gallery-2e28f-default-rtdb.firebaseio.com/images';

  constructor( private http: HttpClient) {}

  getImages(): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.baseUrl}.json`)
      .pipe(
        catchError(error => {
          console.error('Error getting images:', error);
          throw error;
        }),
        map(images => images || [])
      );
  }


  uploadImage(file: File, name: string, tags: string[]): Observable<any> {

    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Observable(observer => {
      reader.onload = () => {
        
        const imageData = {
          id: this.generateRandomId(),
          name: name,
          size: file.size,  
          date: new Date().toISOString(),
          tags: tags,
          url : reader.result
        };

        this.http.post<any>(`${this.baseUrl}.json`, imageData)
          .pipe(
            catchError(error => {
              console.error('Error uploading image:', error);
              return throwError(error);
            })
          )
          .subscribe(response => {
            observer.next(response);
            observer.complete();
          });
      };

      reader.onerror = error => {
        console.error('Error reading file:', error);
        observer.error(error);
      };
    });
  }

  generateRandomId(): string {
    const min = 1000000000; 
    const max = 9999999999; 
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  deleteImage(imageID: string): Observable<any> {
    const url = `${this.baseUrl}/${imageID}.json`;    
    return this.http.delete<void>(url).pipe(
      catchError(error => {
        console.error('Error deleting image:', error);
        return throwError(error);
      })
    );
  }

  // updateImage(id: string, data: Partial<Image>): Observable<void> {
  //   return new Observable<void>((observer) => {
  //     this.db.object(`${this.baseUrl}/${id}`).update(data).then(() => {
  //       observer.next();
  //       observer.complete();
  //     }).catch((error) => {
  //       observer.error(error);
  //     });
  //   });
  // }

}
