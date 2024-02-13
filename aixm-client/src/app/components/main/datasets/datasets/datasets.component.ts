import { HttpHeaders }                             from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule }                            from '@angular/common';
import { FormsModule }                           from '@angular/forms';
import { MatButtonModule }                       from '@angular/material/button';
import { MatCardModule }                         from '@angular/material/card';
import { MatDialog, MatDialogRef }               from '@angular/material/dialog';
import { MatIconModule }                         from '@angular/material/icon';
import { Router }                                from '@angular/router';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { getTitle }                              from '../../../../helpers/utils';
import { Dataset }                      from '../../../../models/aixm/dataset';
import { ApiResponse }                  from '../../../../models/api-response';
import { PipesModule }                  from '../../../../pipes/pipes.module';
import { BackendApiService }            from '../../../../services/backend-api.service';
import { BaseGridComponent }                     from '../../../common/base/base-grid.component';
import { ConfirmComponent }             from '../../../common/dialogs/confirm/confirm.component';
import { DatasetEditComponent } from '../dataset-edit/dataset-edit.component';

@Component({
  selector: 'app-datasets',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MtxGridModule, PipesModule, MatCardModule],
  templateUrl: './datasets.component.html',
  styleUrl: './datasets.component.scss'
})
export class DatasetsComponent extends BaseGridComponent {
  url: string = 'aixm/datasets';
  datasets: Dataset[] = [];

  override defaultColumns: MtxGridColumn[] = [
    { header: 'Name', field: 'name', sortable: true },
    { header: 'File name', field: 'filename', sortable: true },
    { header: 'Description', field: 'description', sortable: true },
    { header: 'User', field: 'user', sortable: true },
    {
      header: 'Operations',
      field: 'operation',
      width: '240px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          text: 'view',
          icon: 'visibility',
          tooltip: 'View',
          click: (record: Dataset): void => {
            this.edit(record, true);
          },
          iif: (record: Dataset): boolean => {
            return !this.allowEdit(record);
          },
        },
        {
          type: 'icon',
          text: 'edit',
          icon: 'edit',
          tooltip: 'Edit',
          click: (record: Dataset): void => {
            this.edit(record);
          },
          iif: (record: Dataset): boolean => {
            return this.allowEdit(record);
          },
        },
        {
          type: 'icon',
          text: 'graph',
          icon: 'spoke',
          tooltip: 'Graph',
          click: (record: Dataset): void => {
            this.graph(record);
          }
        },
        {
          type: 'icon',
          text: 'browse',
          icon: 'web',
          tooltip: 'Browse',
          click: (record: Dataset): void => {
            this.browse(record);
          }
        },
        {
          type: 'icon',
          text: 'delete',
          icon: 'delete',
          tooltip: 'Delete',
          color: 'warn',
          click: (record: Dataset): void => {
            this.delete(record);
          },
          iif: (record: Dataset): boolean => {
            return this.allowEdit(record);
          },
        },
      ], sortable: false
    },
  ];

  constructor(
      private backendApiService: BackendApiService,
      private matDialog: MatDialog,
      private router: Router,
  ) {super()}

  override refresh(): void {
    this.loading = true;
    this.backendApiService.getData(this.url + '?with=dataset.user&' + this.getPageSearchUrl())
        .subscribe((data: ApiResponse): void => {
      console.log(data);
      this.storePageState(data);
      if (data.data) {
        this.datasets = data.data;
      }
      this.loading = false;
    });
  }

  add(): void {
    this.edit(new Dataset());
  }

  edit(dataset: Dataset, disableForm: boolean = false): void {
    const dialogRef: MatDialogRef<DatasetEditComponent> = this.matDialog.open(DatasetEditComponent, {
      autoFocus: true,
      restoreFocus: false,
      disableClose: true,
      data: { dataset: dataset, disableForm:  disableForm}
    });
    dialogRef.afterClosed().subscribe((result: any): void => {
      if (result) {
        this.refresh();
      }
    });
  }

  delete(dataset: Dataset): void {
    const dialogRef: MatDialogRef<ConfirmComponent> = this.matDialog.open(ConfirmComponent, {
      autoFocus: true,
      restoreFocus: false,
      data: { title: getTitle(), message: 'Delete dataset \''+dataset.name+'\'?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.backendApiService.deleteItem(this.url, dataset.id, {
          headers: new HttpHeaders({ timeout: `${1200000}` }) }).subscribe((): void=> {
          this.loading = false;
          this.refresh();
        });
      }
    });
  }

  allowEdit(dataset: Dataset): boolean {
    return this.authService.User?.role === 'admin' ||
        ((dataset.user?.id === this.authService.User?.id) && (dataset.user!==null));
  }

  graph(dataset: Dataset): void {
    this.router.navigate(['browser'], {queryParams: {layout: 'graph', dataset: dataset.id}});
  }

  browse(dataset: Dataset): void {
    this.router.navigate(['browser'], {queryParams: {layout: 'browser', dataset: dataset.id}});
  }

}
