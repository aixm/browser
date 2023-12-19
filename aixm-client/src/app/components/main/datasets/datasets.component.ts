import { Component, OnInit }            from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { FormsModule }                  from '@angular/forms';
import { MatButtonModule }              from '@angular/material/button';
import { MatCardModule }           from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule }           from '@angular/material/icon';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { getTitle }                     from '../../../helpers/utils';
import { Dataset }                      from '../../../models/aixm/dataset';
import { Feature }                      from '../../../models/aixm/feature';
import { ApiResponse }                  from '../../../models/api-response';
import { PipesModule }                  from '../../../pipes/pipes.module';
import { BackendApiService }            from '../../../services/backend-api.service';
import { ConfirmComponent }             from '../../common/dialogs/confirm/confirm.component';
import { DatasetEditComponent } from '../../common/dialogs/dataset-edit/dataset-edit.component';

@Component({
  selector: 'app-datasets',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MtxGridModule, PipesModule, MatCardModule],
  templateUrl: './datasets.component.html',
  styleUrl: './datasets.component.scss'
})
export class DatasetsComponent implements OnInit {
  private url: string = 'aixm/datasets';
  loading: boolean = false;
  searchText: string = '';
  datasets: Dataset[] = [];
  rowSelected: any;

  defaultColumns: MtxGridColumn[] = [
    { header: 'Name', field: 'name', sortable: true },
    { header: 'File name', field: 'filename', sortable: true },
    { header: 'Description', field: 'description', sortable: true },
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
            return !this.allowEdit();
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
          iif: (record: Feature): boolean => {
            return this.allowEdit();
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
          iif: (record: Feature): boolean => {
            return this.allowEdit();
          },
        },
      ], sortable: false
    },
  ];

  constructor(
      private backendApiService: BackendApiService,
      private matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.backendApiService.getData(this.url).subscribe((data: ApiResponse): void => {
      console.log(data);
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
    let dialogRef: MatDialogRef<DatasetEditComponent> = this.matDialog.open(DatasetEditComponent, {
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
    let dialogRef = this.matDialog.open(ConfirmComponent, {
      autoFocus: true,
      restoreFocus: false,
      data: { title: getTitle(), message: 'Delete dataset \''+dataset.name+'\'?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.backendApiService.deleteItem(this.url, dataset.id).subscribe(data => {
          this.loading = false;
          this.refresh();
        });
      }
    });
  }

  allowEdit(): boolean {
    return true;
  }

  graph(dataset: Dataset): void {
  }

  browse(dataset: Dataset): void {
  }

}
