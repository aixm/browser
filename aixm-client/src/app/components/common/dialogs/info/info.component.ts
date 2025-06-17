
import { Component, inject }                                from '@angular/core';
import { MatButtonModule }                                  from '@angular/material/button';
import { MatCardModule }                                    from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA }                    from '@angular/material/dialog';
import { MatIconModule }                                    from '@angular/material/icon';
import { MatTooltipModule }                                 from '@angular/material/tooltip';

@Component({
    selector: 'app-info',
    imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
],
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})
export class InfoComponent {  dialogRef = inject<MatDialogRef<InfoComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);


}
