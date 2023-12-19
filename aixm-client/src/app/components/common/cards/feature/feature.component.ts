import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule }                                   from '@angular/common';
import { MatButtonModule }                                from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule }                                 from '@angular/material/chips';
import { MatIconModule }                                  from '@angular/material/icon';
import { Feature } from '../../../../models/aixm/feature';
import { FeatureList }                            from '../../../../models/aixm/feature-list';
import { PipesModule }      from '../../../../pipes/pipes.module';
import { AixmIconComponent }                              from '../../shared/aixm-icon/aixm-icon.component';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule, MatCardModule, PipesModule, MatButtonModule, MatIconModule, MatChipsModule, AixmIconComponent],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss'
})
export class FeatureComponent implements OnInit {
  @Input() feature?: Feature;
  @Input() featureList?: FeatureList;
  @Output() cardClick: EventEmitter<Feature> = new EventEmitter<Feature>();


  ngOnInit(): void {
    if (this.featureList) {
      this.feature = this.featureList.feature;
    }
  }

  click(): void {
    if (this.feature) {
      this.cardClick.next(this.feature);
    }
  }
}
