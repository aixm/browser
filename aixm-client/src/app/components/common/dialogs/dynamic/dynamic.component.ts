import { Component, Inject }     from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dynamic',
    templateUrl: './dynamic.component.html',
    styleUrls: ['./dynamic.component.scss'],
    standalone: false
})
export class DynamicComponent {

  constructor(
      public dialogRef: MatDialogRef<DynamicComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

}
