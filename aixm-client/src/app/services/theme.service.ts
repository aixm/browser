import { HttpClient }          from '@angular/common/http';
import { Injectable }          from "@angular/core";
import { Observable }          from 'rxjs';
import { ThemeOption }         from '../models/theme-option';
import { SettingsService }     from './settings.service';
import { StyleManagerService } from './style-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  url: string = 'assets/css/themes/theme-options.json';
  defaultTheme: string = 'deeppurple-amber';

  constructor(
      private httpClient: HttpClient,
      private styleManager: StyleManagerService,
      private settingsService: SettingsService,
  ) {}

  getThemeOptions(): Observable<ThemeOption[]> {
    return this.httpClient.get<ThemeOption[]>(this.url);
  }

  getTheme(): string {
    return this.settingsService.getValue('THEME', this.defaultTheme);
  }

  setTheme(themeToSet?: string): void {
    if (!themeToSet) {
      themeToSet = this.getTheme();
    }
    this.styleManager.setStyle(
        'theme',
        `assets/css/themes/${themeToSet}.css`
    );
    this.settingsService.setValue('THEME', themeToSet);
  }
}
