import { HttpClient }          from '@angular/common/http';
import { Injectable }          from "@angular/core";
import { Observable }          from 'rxjs';
import { ThemeOption }         from '../models/theme-option';
import { SettingsService }     from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  url: string = 'assets/theme-options.json';
  defaultTheme: string = 'light-app-theme';
  themes: string[] = ['dark-app-theme', 'light-app-theme'];

  constructor(
      private httpClient: HttpClient,
      private settingsService: SettingsService,
  ) {}

  getThemeOptions(): Observable<ThemeOption[]> {
    return this.httpClient.get<ThemeOption[]>(this.url);
  }

  getTheme(): string {
    return this.settingsService.getValue('APP_THEME', this.defaultTheme);
  }

  setTheme(themeToSet?: string): void {
    if (!themeToSet) {
      themeToSet = this.getTheme();
    }
    // clear styles
    document.documentElement.classList.remove(... this.themes);
    // set styles
    document.documentElement.classList.add(themeToSet);
    // save settings
    this.settingsService.setValue('APP_THEME', themeToSet);
  }

}
