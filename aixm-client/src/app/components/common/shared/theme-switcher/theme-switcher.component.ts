import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { MatButtonModule }                        from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule }                         from '@angular/material/radio';
import { MatTooltipModule }                       from '@angular/material/tooltip';
import { ThemeOption } from '../../../../models/theme-option';
import { ThemeService }                           from '../../../../services/theme.service';

@Component({
    selector: 'app-theme-switcher',
    imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule, MatTooltipModule, MatRadioModule],
    templateUrl: './theme-switcher.component.html',
    styleUrl: './theme-switcher.component.scss'
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);

  @Input() themeOptions: ThemeOption[] | null | undefined;
  @Output() themeChange: EventEmitter<string> = new EventEmitter<string>();
  selectedTheme: string = this.themeService.getTheme();

  changeTheme(themeToSet: string): void {
    this.themeChange.emit(themeToSet);
    this.selectedTheme = this.themeService.getTheme();
  }

}
