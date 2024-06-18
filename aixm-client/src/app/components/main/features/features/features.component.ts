import { CommonModule }                                                           from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule }                    from '@angular/forms';
import { MatButtonModule }                                     from '@angular/material/button';
import { MatCardModule }           from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule }           from '@angular/material/icon';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { getTitle }                                                               from '../../../../helpers/utils';
import { ApiResponse }                           from '../../../../models/api-response';
import { Feature }                              from '../../../../models/aixm/feature';
import { PipesModule }                                         from '../../../../pipes/pipes.module';
import { BackendApiService }                    from '../../../../services/backend-api.service';
import { BaseGridComponent } from '../../../common/base/base-grid.component';
import { ConfirmComponent }                                                       from '../../../common/dialogs/confirm/confirm.component';
import { AixmIconComponent }                                   from '../../../common/shared/aixm-icon/aixm-icon.component';
import { FeatureEditComponent } from '../feature-edit/feature-edit.component';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MtxGridModule, PipesModule, MatCardModule,
    AixmIconComponent],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent extends BaseGridComponent {
  url: string = 'aixm/features';
  features: Feature[] = [];
  override defaultColumns: MtxGridColumn[] = [
    { header: 'Name', field: 'name', sortable: true },
    { header: 'Type', field: 'type', sortable: true },
    { header: 'Abbreviation', field: 'abbreviation', sortable: true },
/*    { header: 'Color', field: 'color', sortable: false },*/
    { header: 'Icon', field: 'icon', sortable: false },
    { header: 'Description', field: 'description', sortable: true },
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
          click: (record: Feature): void => {
            this.edit(record, true);
          },
          iif: (record: Feature): boolean => {
            return !this.allowEdit(record);
          },
        },
        {
          type: 'icon',
          text: 'edit',
          icon: 'edit',
          tooltip: 'Edit',
          click: (record: Feature): void => {
            this.edit(record);
          },
          iif: (record: Feature): boolean => {
            return this.allowEdit(record);
          },
        },
        {
          type: 'icon',
          text: 'delete',
          icon: 'delete',
          tooltip: 'Delete',
          color: 'warn',
          click: (record: Feature): void => {
            this.delete(record);
          },
          iif: (record: Feature): boolean => {
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
        this.features = data.data;
      }
      this.loading = false;
    });
  }

  add(): void {
    this.edit(new Feature());
  }

  edit(feature: Feature, disableForm: boolean = false): void {
    const dialogRef: MatDialogRef<FeatureEditComponent> = this.matDialog.open(FeatureEditComponent, {
      autoFocus: true,
      restoreFocus: false,
      disableClose: true,
      data: { feature: feature, disableForm:  disableForm}
    });
    dialogRef.afterClosed().subscribe((result: any): void => {
      if (result) {
        this.refresh();
      }
    });
  }

  delete(feature: Feature): void {
    const dialogRef: MatDialogRef<ConfirmComponent> = this.matDialog.open(ConfirmComponent, {
      autoFocus: true,
      restoreFocus: false,
      data: { title: getTitle(), message: 'Delete feature \''+feature.name+'\'?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.backendApiService.deleteItem(this.url, feature.id).subscribe((data: ApiResponse): void => {
          this.loading = false;
          if (!data.error) {
            this.refresh();
          }
        });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  allowEdit(feature: Feature): boolean {
    return this.authService.User?.role === 'admin';
  }


}
