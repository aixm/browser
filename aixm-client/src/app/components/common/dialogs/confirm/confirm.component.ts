
import { Component, inject }                                from '@angular/core';
import { MatButtonModule }                                  from '@angular/material/button';
import { MatCardModule }                                    from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA }                    from '@angular/material/dialog';
import { MatIconModule }                                    from '@angular/material/icon';
import { MatTooltipModule }                                 from '@angular/material/tooltip';

@Component({
    selector: 'app-confirm',
    imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
],
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {  dialogRef = inject<MatDialogRef<ConfirmComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);


}
