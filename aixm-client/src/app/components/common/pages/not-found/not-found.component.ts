import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule }                from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { getTitle }                     from '../../../../helpers/utils';

@Component({
    selector: 'app-not-found',
    imports: [
        MatIconModule,
        MatListModule,
        RouterLink,
        MatButtonModule
    ],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    standalone: true
})
export class NotFoundComponent {

  protected readonly getTitle = getTitle;
}
