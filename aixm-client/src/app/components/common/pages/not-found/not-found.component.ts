import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule }                from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { getTitle }                     from '../../../../helpers/utils';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    MatIconModule,
    MatListModule,
    RouterLinkActive,
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

  protected readonly getTitle = getTitle;
}
