import { Component, inject, ChangeDetectionStrategy }     from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dynamic',
    templateUrl: './dynamic.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./dynamic.component.scss'],
})
export class DynamicComponent {  dialogRef = inject<MatDialogRef<DynamicComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);


}
