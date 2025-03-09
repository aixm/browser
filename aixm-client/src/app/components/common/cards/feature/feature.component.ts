import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule }                                   from '@angular/common';
import { MatButtonModule }                                from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule }                                 from '@angular/material/chips';
import { MatIconModule }                                  from '@angular/material/icon';
import { Feature } from '../../../../models/aixm/feature';
import { FeatureList }                            from '../../../../models/aixm/feature-list';
import { LimitToPipe }                                    from '../../../../pipes/limit-to.pipe';
import { AixmIconComponent }                              from '../../shared/aixm-icon/aixm-icon.component';

@Component({
  selector: 'app-feature',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, AixmIconComponent, LimitToPipe],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss',
  standalone: true
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
