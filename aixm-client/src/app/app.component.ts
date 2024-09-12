import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatLabel }          from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule }                           from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { async, Observable }                          from 'rxjs';
import packageInfo                                    from '../../package.json';
import { ThemeSwitcherComponent } from './components/common/shared/theme-switcher/theme-switcher.component';
import { UserEditComponent } from './components/main/admin/user-edit/user-edit.component';
import { getTitle } from './helpers/utils';
import { ThemeOption } from './models/theme-option';
import { AuthService } from './services/auth.service';
import { IconService } from './services/icon.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, MatToolbarModule, MatSidenavModule, MatIconModule, MatButtonModule, RouterLink, RouterLinkActive,
    MatListModule, MatTooltipModule, ThemeSwitcherComponent, MatLabel,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title: string = getTitle();
  version: string = packageInfo.version;
  themeOptions$: Observable<ThemeOption[]> = this.themeService.getThemeOptions();
  show: boolean = false;
  constructor(
      private readonly themeService: ThemeService,
      private matDialog: MatDialog,
      public authService: AuthService,
      private iconService: IconService
  ) {
    //this.iconService.initIcons();
    this.themeService.setTheme();
  }

  ngOnInit(): void {
    setTimeout((): void => {
      this.show=true;
    }, 3000);
  }

  themeChangeHandler(themeToSet: string): void {
    this.themeService.setTheme(themeToSet);
  }

  profile(): void {
    this.matDialog.open(UserEditComponent, {
      autoFocus: true,
      restoreFocus: false,
      disableClose: true,
      data: { user: this.authService.User, disableForm:  false, profile: true}
    });
  }

  protected readonly async = async;
}
