import { CommonModule }                                     from '@angular/common';
import { Component, Inject }                                from '@angular/core';
import { MatButtonModule }                                  from '@angular/material/button';
import { MatCardModule }                                    from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA }                    from '@angular/material/dialog';
import { MatIconModule }                                    from '@angular/material/icon';
import { MatTooltipModule }                                 from '@angular/material/tooltip';

@Component({
    selector: 'app-info',
    imports: [
        CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule,
    ],
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})
export class InfoComponent {

  constructor(
      public dialogRef: MatDialogRef<InfoComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

}
