import { NgIf }                                       from '@angular/common';
import { Component, EventEmitter, Input, Output }     from '@angular/core';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule }                           from '@angular/material/tooltip';
import { handleErrorMissingFeatureImage }             from '../../../../helpers/utils';
import { Feature }                                    from '../../../../models/aixm/feature';
import { FeatureService }                             from '../../../../services/feature.service';
import { AixmIconComponent }                          from '../aixm-icon/aixm-icon.component';

@Component({
    selector: 'app-aixm-feature-toggle',
    imports: [
        MatSlideToggleModule,
        AixmIconComponent,
        MatTooltipModule,
        NgIf,
    ],
    templateUrl: './aixm-feature-toggle.component.html',
    styleUrl: './aixm-feature-toggle.component.scss'
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
