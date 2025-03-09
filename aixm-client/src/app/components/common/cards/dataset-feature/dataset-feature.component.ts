import { ClipboardModule }                                from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule }                                   from '@angular/common';
import { MatBadgeModule }                                                        from '@angular/material/badge';
import { MatBottomSheetModule }                                                  from '@angular/material/bottom-sheet';
import { MatButtonModule }                                                       from '@angular/material/button';
import { MatCardModule }                                                         from '@angular/material/card';
import { MatChipsModule }                                                        from '@angular/material/chips';
import { MatIconModule }           from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSlideToggleModule }    from '@angular/material/slide-toggle';
import { MatToolbarModule }                                                      from '@angular/material/toolbar';
import { MatTooltipModule }                           from '@angular/material/tooltip';
import { getFeatureBrokenImagePath } from '../../../../helpers/utils';
import { Dataset }                                                               from '../../../../models/aixm/dataset';
import { DatasetFeature }                             from '../../../../models/aixm/dataset-feature';
import { Feature }                                from '../../../../models/aixm/feature';
import { LimitToPipe }                                                           from '../../../../pipes/limit-to.pipe';
import { AixmFeatureToggleComponent } from '../../shared/aixm-feature-toggle/aixm-feature-toggle.component';
import { AixmIconComponent }                      from '../../shared/aixm-icon/aixm-icon.component';

@Component({
  selector: 'app-dataset-feature',
  imports: [
    CommonModule, MatButtonModule, MatBottomSheetModule, MatCardModule, MatChipsModule, MatIconModule, MatBadgeModule,
    AixmIconComponent, LimitToPipe,
    MatSlideToggleModule, AixmFeatureToggleComponent, ClipboardModule, MatTooltipModule, MatToolbarModule, MatPaginator, MatProgressBar,
  ],
  templateUrl: './dataset-feature.component.html',
  styleUrl: './dataset-feature.component.scss',
  standalone: true
})
export class DatasetFeatureComponent {
  url: string = 'aixm/dataset_features';
  @Input() feature?: Feature;
  @Input() datasetFeature?: DatasetFeature;
  @Output() datasetFeatureChange: EventEmitter<DatasetFeature> = new EventEmitter<DatasetFeature>();
  @Output() cardClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() featureVisibilityChange: EventEmitter<Feature> = new EventEmitter<Feature>();
  @Output() copyToClipboardClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() goToDatasetClick: EventEmitter<Dataset> = new EventEmitter<Dataset>();
  referencedByPageEvent: PageEvent = new PageEvent();
  loading: boolean = false;


  constructor(
  ) {}

  click(): void {
    if (this.datasetFeature) {
      this.cardClick.next({datasetFeature: this.datasetFeature, pageEvent: this.referencedByPageEvent});
    }
  }

  toggleChange(): void {
    this.featureVisibilityChange.emit();
    //console.log(getComputedStyle(document.documentElement).getPropertyValue(`--mat-badge-background-color`));
    //console.log(getComputedStyle(document.documentElement).getPropertyValue(`--mdc-checkbox-selected-icon-color`));
  }

  copyToClipboard(text?: string): void {
    this.copyToClipboardClick.emit(text);
  }

  goToDataset(dataset?: Dataset): void {
    this.goToDatasetClick.emit(dataset);
  }

  handleReferencedByPageEvent(event: PageEvent): void {
    this.referencedByPageEvent = event;
    console.log(this.referencedByPageEvent);
    this.click();
  }

  protected readonly getFeatureBrokenImagePath = getFeatureBrokenImagePath;
}
