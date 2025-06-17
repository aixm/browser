
import { Component, OnInit }                                               from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule }                                         from '@angular/material/button';
import { MatCardModule }    from '@angular/material/card';
import { MatDialogRef }     from '@angular/material/dialog';
import { MatIconModule }    from '@angular/material/icon';
import { MatInputModule }   from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../../services/auth.service';
import { BackendApiService } from '../../../../services/backend-api.service';

@Component({
    selector: 'app-login',
    imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule
],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  loginForm!: FormGroup;
  showPassword: boolean = false;

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  constructor(
      public dialogRef: MatDialogRef<LoginComponent>,
      private backendApiService: BackendApiService,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }

  login(): void {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) {
      return;
    }
    this.loading = true;

    this.backendApiService.postItem(`auth/login`,
            { 'email': this.email?.value, 'password': this.password?.value },
            undefined, this.loginForm
        )
        .subscribe(result => {
          if (!result.error) {
            this.authService.token = result.data.accessToken;
            this.authService.getUser()
                .subscribe(result => {
                  if (result.data) {
                    this.authService.User = result.data;
                  }
                  this.dialogRef.close(true);
                });
          }
        })
        .add((): void => {this.loading = false;});
  }

}
