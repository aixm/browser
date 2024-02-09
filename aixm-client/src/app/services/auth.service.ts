import { HttpClient }                       from '@angular/common/http';
import { Injectable }                       from '@angular/core';
import { MatDialog }                        from '@angular/material/dialog';
import { Router }                           from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { LoginComponent }                   from '../components/common/dialogs/login/login.component';
import { getById, toCamel }                 from '../helpers/utils';
import { ApiResponse }                      from '../models/api-response';
import { Role }                             from '../models/auth/role';
import { User }                             from '../models/auth/user';
import { BackendApiService }                from './backend-api.service';
import { SettingsService }                  from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser!: BehaviorSubject<User | null>;
  roles: Role[] = [
    {id: 'admin', name: 'Administrator'},
    {id: 'user', name: 'User'},
  ];

  constructor(
      private backendApiService: BackendApiService,
      private settingsService: SettingsService,
      private matDialog: MatDialog,
      private httpClient: HttpClient,
      private router: Router
  ) {
    this.currentUser = new BehaviorSubject<User|null>(this.User);
  }

  get User(): User | null {
    let u: string = this.settingsService.getValue('USER', '');
    return u ? JSON.parse(u) : null;
  }
  set User(value: User | null) {
    if (value) {
      this.settingsService.setValue('USER', JSON.stringify(value));
    } else {
      this.settingsService.removeValue('USER');
    }
    this.currentUser.next(value);
  }

  get token(): string {
    return this.settingsService.getValue('TOKEN', '');
  }
  set token(value: string | undefined) {
    if (value) {
      this.settingsService.setValue('TOKEN', value);
    } else {
      this.settingsService.removeValue('TOKEN');
    }
  }

   showLogin(): void {
    let dialogRef = this.matDialog.open(LoginComponent, {
      panelClass: 'no-spacing-dialog-container',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  resetCredentials(): void {
    this.token = undefined;
    this.User = null;
  }

  logout(navigateTo?: string): void {
    this.backendApiService.getData(`auth/logout`).subscribe(result => {
      this.resetCredentials();
      if (navigateTo) {
        this.router.navigateByUrl(navigateTo);
      }
    });
  }

  login(email: string, password: string): Observable<ApiResponse> {
    const url = `${this.backendApiService.backendUrlValue}/auth/login`;
    return this.httpClient.post<ApiResponse>(url, { 'email': email, 'password': password}).pipe(
        map(x => toCamel(x)),
    );
  }

  getUser(): Observable<ApiResponse> {
    return this.backendApiService.getData(`auth/user?with=user.vehicles`);
  }

  getRoleTitle(): string {
    let role: string = 'unknown';
    if (this.User?.role){
      // @ts-ignore
      role = getById(this.roles, this.User.role).name;
    }
    return role;
  }

  getUserTitle(): string {
    let user: string = 'unknown';
    if (this.User){
      if (this.User.firstName) {
        user = this.User.firstName
      }
      if (this.User.lastName) {
        user += ' ' + this.User.lastName
      }
    }
    return user;
  }

}
