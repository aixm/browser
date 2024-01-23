import { HttpHeaders }                           from '@angular/common/http';
import { Component, OnInit, ViewChild }          from '@angular/core';
import { CommonModule }                          from '@angular/common';
import { FormsModule }                           from '@angular/forms';
import { MatButtonModule }                       from '@angular/material/button';
import { MatCardModule }                         from '@angular/material/card';
import { MatDialog, MatDialogRef }               from '@angular/material/dialog';
import { MatIconModule }                         from '@angular/material/icon';
import { PageEvent }                             from '@angular/material/paginator';
import { Router }                                from '@angular/router';
import { MtxGrid, MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { getTitle }                              from '../../../helpers/utils';
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
  @ViewChild('grid') grid!: MtxGrid;
  private url: string = 'aixm/datasets';
  loading: boolean = false;
  searchText: string = '';
  datasets: Dataset[] = [];
  pageEvent: PageEvent = new PageEvent();
  pageSizeOptions: number[] = [10, 25, 50, 100];

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
      private router: Router,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.backendApiService.getData(this.url + this.getPagingUrl() + (this.searchText ? '&search=' + this.searchText : ''))
        .subscribe((data: ApiResponse): void => {
      console.log(data);
      this.storePageState(data);
      if (data.data) {
        this.datasets = data.data;
      }
      this.loading = false;
    });
  }

  closeMenu() {
    this.grid.columnMenu.menuTrigger.closeMenu();
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
        this.backendApiService.deleteItem(this.url, dataset.id, {
          headers: new HttpHeaders({ timeout: `${1200000}` }) }).subscribe(data => {
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
    this.router.navigate(['browser'], {queryParams: {layout: 'graph', dataset: dataset.id}});
  }

  browse(dataset: Dataset): void {
    this.router.navigate(['browser'], {queryParams: {layout: 'browser', dataset: dataset.id}});
  }

  storePageState(data: ApiResponse): void {
    this.pageEvent.pageSize = data.meta.pagination.perPage;
    this.pageEvent.length = data.meta.pagination.total;
  }

  handlePageEvent(event: PageEvent): void {
    this.pageEvent = event;
    console.log(this.pageEvent);
    this.refresh();
  }

  getPagingUrl(): string {
    return `?per_page=${this.pageEvent.pageSize ? this.pageEvent.pageSize : 10}&page=${
        this.pageEvent.pageIndex ? this.pageEvent.pageIndex + 1: 1}`;
  }

}
