import { CommonModule }                                        from '@angular/common';
import { Component, forwardRef, OnInit, ViewEncapsulation }    from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule }                                     from '@angular/material/button';
import { MatCardModule }                        from '@angular/material/card';
import { MatIconModule }                        from '@angular/material/icon';
import { MtxButtonModule }                      from '@ng-matero/extensions/button';
import { MtxGridColumn, MtxGridModule }         from '@ng-matero/extensions/grid';
import { ApiResponse }                          from '../../../models/api-response';
import { Feature }                              from '../../../models/aixm/feature';
import { PipesModule }                                         from '../../../pipes/pipes.module';
import { BackendApiService }                    from '../../../services/backend-api.service';
import { FeatureComponent }                     from '../../common/cards/feature/feature.component';
import { AixmIconComponent }                                   from '../../common/shared/aixm-icon/aixm-icon.component';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [
    CommonModule, FeatureComponent, FormsModule, MatIconModule, MtxGridModule, MatCardModule, MtxButtonModule, MatButtonModule,
    ReactiveFormsModule,
    PipesModule, AixmIconComponent,
  ],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent implements OnInit {
  private url: string = 'aixm/features';
  loading: boolean = false;
  searchText: string = '';
  features: Feature[] = [];
  rowSelected: any;

  defaultColumns: MtxGridColumn[] = [
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
            return !this.allowEdit();
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
            return this.allowEdit();
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
            return this.allowEdit();
          },
        },
      ], sortable: false
    },
  ];

  constructor(
      private backendApiService: BackendApiService,
  ) {}


  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.backendApiService.getData(this.url).subscribe((data: ApiResponse): void => {
      console.log(data);
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
  }

  delete(feature: Feature): void {
  }

  allowEdit(): boolean {
    return true;
  }

}
