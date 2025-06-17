import { Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule }    from '@angular/material/icon';
import { handleErrorMissingFeatureImage } from '../../../../helpers/utils';
import { Feature } from '../../../../models/aixm/feature';

@Component({
    selector: 'app-aixm-icon',
    imports: [MatCardModule, MatIconModule],
    templateUrl: './aixm-icon.component.html',
    styleUrl: './aixm-icon.component.scss'
})
export class AixmIconComponent {
  @Input() feature?: Feature;
  @Input() abbreviation?: string;
  @Input() width: number = 24;
  @Input() matCardAvatar: boolean = false;

  protected readonly handleErrorMissingFeatureImage = handleErrorMissingFeatureImage;
}
