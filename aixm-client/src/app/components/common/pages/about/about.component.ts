import { Component } from '@angular/core';
import { getTitle }  from '../../../../helpers/utils';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  protected readonly getTitle = getTitle;
}
