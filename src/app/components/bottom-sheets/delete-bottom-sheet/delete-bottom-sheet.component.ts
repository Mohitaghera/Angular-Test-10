import { Component, Inject, Optional } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-bottom-sheet',
  templateUrl: './delete-bottom-sheet.component.html',
  styleUrls: ['./delete-bottom-sheet.component.scss'],
  standalone:true,
  imports:[MatBottomSheetModule,MatButtonModule]
})
export class DeleteBottomSheetComponent {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<DeleteBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<any>
  ) { }

  onNoClick(): void {
    this.bottomSheetRef.dismiss();
  }

  onDeleteClick(): void {
    this.bottomSheetRef.dismiss(true);
  }
}
