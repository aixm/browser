import { Component }                                                                              from '@angular/core';
import {
  MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { getTitle }                                                                               from '../../../../helpers/utils';

@Component({
    selector: 'app-about',
    imports: [
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelDescription,
        MatExpansionPanelTitle,
    ],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {

  protected readonly getTitle = getTitle;
}
