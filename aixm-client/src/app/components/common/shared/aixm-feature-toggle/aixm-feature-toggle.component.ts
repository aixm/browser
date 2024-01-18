import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleModule }                   from '@angular/material/slide-toggle';
import { MatTooltipModule }     from '@angular/material/tooltip';
import { Feature }              from '../../../../models/aixm/feature';
import { AixmIconComponent } from '../aixm-icon/aixm-icon.component';

@Component({
  selector: 'app-aixm-feature-toggle',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    AixmIconComponent,
    MatTooltipModule,
  ],
  templateUrl: './aixm-feature-toggle.component.html',
  styleUrl: './aixm-feature-toggle.component.scss'
})
export class AixmFeatureToggleComponent {
  @Input() feature?: Feature;
  @Input() checked: boolean = false;
  @Output() toggle: EventEmitter<Feature> | undefined;


  featureToggle($event: any): void {
    this.toggle?.emit($event);

  }

}
