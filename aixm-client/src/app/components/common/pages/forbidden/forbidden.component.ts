import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-forbidden',
    imports: [
        MatIconModule,
        MatButtonModule,
        RouterLink,
    ],
    templateUrl: './forbidden.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {

}
