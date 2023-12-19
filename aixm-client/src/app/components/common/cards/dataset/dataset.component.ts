import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { MatButtonModule }                        from '@angular/material/button';
import { MatCardModule }    from '@angular/material/card';
import { MatChipsModule }                         from '@angular/material/chips';
import { MatIconModule }                          from '@angular/material/icon';
import { Dataset }          from '../../../../models/aixm/dataset';
import { Feature }          from '../../../../models/aixm/feature';
import { PipesModule }      from '../../../../pipes/pipes.module';

@Component({
  selector: 'app-dataset',
  standalone: true,
  imports: [CommonModule, MatCardModule, PipesModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './dataset.component.html',
  styleUrl: './dataset.component.scss'
})
export class DatasetComponent {
  @Input() dataset?: Dataset;
  @Output() cardClick: EventEmitter<Dataset> = new EventEmitter<Dataset>();

  click(): void {
    if (this.dataset) {
      this.cardClick.next(this.dataset);
    }
  }
}

