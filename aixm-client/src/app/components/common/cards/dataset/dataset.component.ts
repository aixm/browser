import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';
import { MatButtonModule }                        from '@angular/material/button';
import { MatCardModule }    from '@angular/material/card';
import { MatCheckboxModule }                      from '@angular/material/checkbox';
import { MatChipsModule }                         from '@angular/material/chips';
import { MatIconModule }                from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getTooltip }                             from '../../../../helpers/utils';
import { Dataset }                      from '../../../../models/aixm/dataset';
import { LimitToPipe }                            from '../../../../pipes/limit-to.pipe';

@Component({
  selector: 'app-dataset',
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatCheckboxModule, FormsModule,
    MatTooltipModule, LimitToPipe
  ],
  templateUrl: './dataset.component.html',
  styleUrl: './dataset.component.scss',
  standalone: true
})
export class DatasetComponent {
  @Input() dataset: Dataset = new Dataset();
  @Input() showCheckBox: boolean = false;
  @Output() cardClick: EventEmitter<Dataset> = new EventEmitter<Dataset>();

  click(): void {
    if (this.dataset) {
      this.cardClick.next(this.dataset);
    }
  }

  protected readonly getTooltip = getTooltip;
}

