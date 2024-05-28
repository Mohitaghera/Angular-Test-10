import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatSize',
  standalone:true
})
export class FormatSizePipe implements PipeTransform {
  transform(sizeInBytes: number): string {
    const sizeInKB = sizeInBytes / 1000;
    const roundedSize = Math.round(sizeInKB * 10) / 10; 
    return roundedSize.toFixed(1); 
  }
}
