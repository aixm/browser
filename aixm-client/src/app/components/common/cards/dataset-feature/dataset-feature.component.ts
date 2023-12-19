import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule }                                                          from '@angular/common';
import { MatBadgeModule }                                              from '@angular/material/badge';
import {
  MAT_BOTTOM_SHEET_DATA, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheet, MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatButtonModule }                                             from '@angular/material/button';
import { MatCardModule }            from '@angular/material/card';
import { MatChipsModule }          from '@angular/material/chips';
import { MatIconModule }           from '@angular/material/icon';
import { DatasetFeature }                         from '../../../../models/aixm/dataset-feature';
import { Feature }                                from '../../../../models/aixm/feature';
import { PipesModule }              from '../../../../pipes/pipes.module';
import { AixmIconComponent }                      from '../../shared/aixm-icon/aixm-icon.component';

@Component({
  selector: 'app-dataset-feature',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatBottomSheetModule,  MatCardModule, MatChipsModule, MatIconModule, PipesModule, MatBadgeModule, AixmIconComponent],
  templateUrl: './dataset-feature.component.html',
  styleUrl: './dataset-feature.component.scss'
})
export class DatasetFeatureComponent implements OnInit {
  @Input() feature?: Feature;
  @Input() datasetFeature?: DatasetFeature;
  @Output() cardClick: EventEmitter<DatasetFeature> = new EventEmitter<DatasetFeature>();
  @Output() xlinkClick: EventEmitter<DatasetFeature> = new EventEmitter<DatasetFeature>();


  constructor(
      // private bottomSheet: MatBottomSheet,
  ) {}

  ngOnInit(): void {
  }

  click(): void {
    if (this.datasetFeature) {
      this.cardClick.next(this.datasetFeature);
    }
  }

  xlink(): void {
    if (this.datasetFeature) {
      this.xlinkClick.next(this.datasetFeature);
/*      this.bottomSheet.open(DatasetFeatureComponent, {
        data: { feature: this.feature },
      });*/
    }
  }


}
