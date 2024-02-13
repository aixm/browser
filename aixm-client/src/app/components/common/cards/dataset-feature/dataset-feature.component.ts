import { ClipboardModule }                                                       from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnInit, Output }                        from '@angular/core';
import { CommonModule }                                                          from '@angular/common';
import { MatBadgeModule }                                                        from '@angular/material/badge';
import { MatBottomSheetModule }                                                  from '@angular/material/bottom-sheet';
import { MatButtonModule }                                                       from '@angular/material/button';
import { MatCardModule }                                                         from '@angular/material/card';
import { MatChipsModule }                                                        from '@angular/material/chips';
import { MatIconModule }                                                         from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule }                                                      from '@angular/material/toolbar';
import { MatTooltipModule }                           from '@angular/material/tooltip';
import { getFeatureBrokenImagePath } from '../../../../helpers/utils';
import { Dataset }                                                               from '../../../../models/aixm/dataset';
import { DatasetFeature }                             from '../../../../models/aixm/dataset-feature';
import { Feature }                                from '../../../../models/aixm/feature';
import { PipesModule }              from '../../../../pipes/pipes.module';
import { AixmFeatureToggleComponent } from '../../shared/aixm-feature-toggle/aixm-feature-toggle.component';
import { AixmIconComponent }                      from '../../shared/aixm-icon/aixm-icon.component';

@Component({
  selector: 'app-dataset-feature',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatBottomSheetModule, MatCardModule, MatChipsModule, MatIconModule, PipesModule, MatBadgeModule,
    AixmIconComponent,
    MatSlideToggleModule, AixmFeatureToggleComponent, ClipboardModule, MatTooltipModule, MatToolbarModule,
  ],
  templateUrl: './dataset-feature.component.html',
  styleUrl: './dataset-feature.component.scss'
})
export class DatasetFeatureComponent implements OnInit {
  @Input() feature?: Feature;
  @Input() datasetFeature?: DatasetFeature;
  @Output() cardClick: EventEmitter<DatasetFeature> = new EventEmitter<DatasetFeature>();
  @Output() featureVisibilityChange: EventEmitter<Feature> = new EventEmitter<Feature>();
  @Output() copyToClipboardClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() goToDatasetClick: EventEmitter<Dataset> = new EventEmitter<Dataset>();


  constructor(
  ) {}

  ngOnInit(): void {
  }

  click(): void {
    if (this.datasetFeature) {
      this.cardClick.next(this.datasetFeature);
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

  protected readonly getFeatureBrokenImagePath = getFeatureBrokenImagePath;
}
