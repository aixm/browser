import { CommonModule } from '@angular/common';
import { Component }          from '@angular/core';
import { FormsModule }                  from '@angular/forms';
import { MatButtonModule }              from '@angular/material/button';
import { MatCardModule }           from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule }           from '@angular/material/icon';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { getById, getTitle }            from '../../../../helpers/utils';
import { Role } from '../../../../models/auth/role';
import { User }                         from '../../../../models/auth/user';
import { ApiResponse }                  from '../../../../models/api-response';
import { PipesModule }                  from '../../../../pipes/pipes.module';
import { BackendApiService }            from '../../../../services/backend-api.service';
import { BaseGridComponent }            from '../../../common/base/base-grid.component';
import { ConfirmComponent } from '../../../common/dialogs/confirm/confirm.component';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MtxGridModule, PipesModule, MatCardModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent extends BaseGridComponent {
  url: string = 'users';
  users: User[] = [];
  roles: Role[]  = this.authService.roles;
  override defaultColumns: MtxGridColumn[] = [
    { header: 'Active', field: 'active', type: 'tag',
      tag: {
        true: { text: '✓', color: 'primary' },
        false: { text: '✕', color: 'warn' },
      }, sortable: true },
    { header: 'Email', field: 'email', sortable: true },
    { header: 'Role', field: 'role', sortable: true },
    { header: 'First Name', field: 'firstName', sortable: true },
    { header: 'Last Name', field: 'lastName', sortable: true },
    { header: 'Company', field: 'company', sortable: true },
    { header: 'Position', field: 'position', sortable: true },
    { header: 'Last activity', field: 'activeAt', sortable: true },
    {
      header: 'Operations',
      field: 'operation',
      width: '140px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          text: 'view',
          icon: 'visibility',
          tooltip: 'View',
          click: (record: User): void => {
            this.edit(record, true);
          },
          iif: (record: User): boolean => {
            return !this.allowEdit(record);
          },
        },
        {
          type: 'icon',
          text: 'edit',
          icon: 'edit',
          tooltip: 'Edit',
          click: (record: User): void => {
            this.edit(record);
          },
          iif: (record: User): boolean => {
            return this.allowEdit(record);
          },
        },
        {
          type: 'icon',
          text: 'delete',
          icon: 'delete',
          tooltip: 'Delete',
          color: 'warn',
          click: (record: User): void => {
            this.delete(record);
          },
          iif: (record: User): boolean => {
            return this.allowEdit(record);
          },
        },
      ], sortable: false
    },
  ];

  constructor(
      private backendApiService: BackendApiService,
      private matDialog: MatDialog,
  ) {super()}

  override refresh(): void {
    this.loading = true;
    this.backendApiService.getData(this.url + '?' + this.getPageSearchUrl())
        .subscribe((data: ApiResponse): void => {
          this.storePageState(data);
          if (data.data) {
            this.users = data.data;
          }
          this.loading = false;
        });
  }

  add(): void {
    this.edit(new User());
  }

  edit(user: User, disableForm: boolean = false): void {
    const dialogRef: MatDialogRef<UserEditComponent> = this.matDialog.open(UserEditComponent, {
      autoFocus: true,
      restoreFocus: false,
      disableClose: true,
      data: { user: user, disableForm:  disableForm}
    });
    dialogRef.afterClosed().subscribe((result: any): void => {
      if (result) {
        this.refresh();
      }
    });
  }

  delete(user: User): void {
    let dialogRef: MatDialogRef<ConfirmComponent> = this.matDialog.open(ConfirmComponent, {
      autoFocus: true,
      restoreFocus: false,
      data: { title: getTitle(), message: 'Delete user \''+user.email+'\'?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.backendApiService.deleteItem(this.url, user.id).subscribe((data: ApiResponse): void => {
          this.loading = false;
          this.refresh();
        });
      }
    });
  }

  allowEdit(user: User): boolean {
    return this.authService.User?.role === 'admin';
  }

  getRoleTitle(role: string): string {
    return getById(this.roles, role).name;
  }

  protected readonly getTitle = getTitle;
}
