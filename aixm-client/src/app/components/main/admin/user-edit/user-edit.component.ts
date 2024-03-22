import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CommonModule }           from '@angular/common';
import { Component, Inject }                                       from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule }                                         from '@angular/material/button';
import { MatCardModule }                                           from '@angular/material/card';
import { MatCheckboxModule }                                       from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef }                           from '@angular/material/dialog';
import { MatIconModule }                                           from '@angular/material/icon';
import { MatInputModule }                                          from '@angular/material/input';
import { MatProgressBarModule }                                    from '@angular/material/progress-bar';
import { MatTooltipModule }           from '@angular/material/tooltip';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { ApiResponse }                from '../../../../models/api-response';
import { User }                                                    from '../../../../models/auth/user';
import { AuthService }                                             from '../../../../services/auth.service';
import { BackendApiService }                                       from '../../../../services/backend-api.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatInputModule, MatCheckboxModule, MtxSelectModule, CdkDrag, CdkDragHandle,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent {
  url: string = 'users';
  user!: User;
  loading: boolean = false;
  showPassword: boolean = false;

  userForm!: FormGroup;
  get email() { return this.userForm.get('email'); }
  get active() { return this.userForm.get('active'); }
  get password() { return this.userForm.get('password'); }
  get changePassword() { return this.userForm.get('changePassword'); }
  get firstName() { return this.userForm.get('firstName'); }
  get lastName() { return this.userForm.get('lastName'); }
  get company() { return this.userForm.get('company'); }
  get position() { return this.userForm.get('position'); }
  get role() { return this.userForm.get('role'); }

  constructor(
      public dialogRef: MatDialogRef<UserEditComponent>,
      public authService: AuthService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private backendApiService: BackendApiService
  ) { }

  ngOnInit(): void {
    this.user = this.data.user;
    this.user.changePassword = this.user.id ? false: true;
    this.initForm();
  }

  initForm(): void {
    this.userForm = new FormGroup({
      email: new FormControl(this.user?.email, [
        Validators.required,
        Validators.email
      ]),
      active: new FormControl(this.user?.active),
      password: new FormControl({value: '', disabled: !this.user?.changePassword}),
      changePassword: new FormControl(this.user?.changePassword),
      firstName: new FormControl(this.user?.firstName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      lastName: new FormControl(this.user?.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      company: new FormControl(this.user?.company, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255)
      ]),
      position: new FormControl(this.user?.position, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255)
      ]),
      role: new FormControl(this.user?.role, [
        Validators.required
      ]),
    });
    if (this.user.id) {
      // edit user
      this.changePassword?.valueChanges.subscribe((value: boolean): void => {
        if (value) {
          this.password?.enable();
        } else {
          this.password?.disable();
        }
        this.password?.setValidators(value ? [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(10)
        ] : null);
        this.password?.updateValueAndValidity();
      });
    } else {
      // new user
      this.password?.setValidators([Validators.required]);
    }
  }

  save(): void {
    this.userForm.markAllAsTouched();
    if (!this.userForm.valid) {
      return;
    }
    this.user.email = this.email?.value;
    this.user.active = this.active?.value;
    this.user.firstName = this.firstName?.value;
    this.user.lastName = this.lastName?.value;
    this.user.company = this.company?.value;
    this.user.position = this.position?.value;
    if (this.changePassword?.value) {
      this.user.password = this.password?.value;
      this.user.changePassword = true;
    }
    if (!this.data.profile) {
      this.user.role = this.role?.value;
    }
    this.loading = true;
    if (this.user.id === undefined) {
      // new
      this.backendApiService.postItem(this.url, this.user, undefined, this.userForm).subscribe((data: ApiResponse): void => {
        this.loading = false;
        if (!data.error) {
          this.dialogRef.close(true);
        }
      });
    } else {
      // edit
      this.backendApiService.putItem(this.url, this.user, undefined, this.userForm).subscribe((data: ApiResponse): void => {
        this.loading = false;
        if (!data.error) {
          if (this.data.profile) {
            // save new profile data to browser cache
            this.authService.User = this.user;
          }
          this.dialogRef.close(true);
        }
      });
    }
  }

  protected readonly Math: Math = Math;
}
