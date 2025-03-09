import { Component, EventEmitter, Input, Output }     from '@angular/core';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule }                           from '@angular/material/tooltip';
import { handleErrorMissingFeatureImage }             from '../../../../helpers/utils';
import { Feature }                                    from '../../../../models/aixm/feature';
import { FeatureService }                             from '../../../../services/feature.service';

@Component({
  selector: 'app-aixm-feature-toggle',
  imports: [
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './aixm-feature-toggle.component.html',
  styleUrl: './aixm-feature-toggle.component.scss',
  standalone: true
})
export class AixmFeatureToggleComponent {
  @Input() feature?: Feature;
  @Input() color: string = 'primary';
  @Output() featureVisibilityChange: EventEmitter<Feature> = new EventEmitter<Feature>();

  constructor(
      public featureService: FeatureService
  ) {}

  toggleChange($event: MatSlideToggleChange): void {
    // console.log($event);
    if ($event.checked) {
      this.featureService.showFeature(this.feature?.id);
    } else {
      this.featureService.hideFeature(this.feature?.id);
    }
    // console.log(this.featureService.hiddenFeatureIds);
    this.featureVisibilityChange.emit();
  }

  protected readonly handleErrorMissingFeatureImage = handleErrorMissingFeatureImage;
}
