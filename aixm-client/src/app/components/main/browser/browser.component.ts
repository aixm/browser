import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule }                             from '@angular/common';
import { MatButtonModule }   from '@angular/material/button';
import { MatButtonToggleModule }   from '@angular/material/button-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule }           from '@angular/material/icon';
import { MatInputModule }                from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule }                     from '@angular/material/progress-bar';
import { MatTabsModule }                 from '@angular/material/tabs';
import { MatToolbarModule }       from '@angular/material/toolbar';
import { MatTooltipModule }                            from '@angular/material/tooltip';
import { Network, DataSet, Data, Edge, Node, Options } from 'vis-network';
import { Dataset }                                     from '../../../models/aixm/dataset';
import { DatasetFeature }    from '../../../models/aixm/dataset-feature';
import { DatasetFeatureProperty } from '../../../models/aixm/dataset-feature-property';
import { Feature }           from '../../../models/aixm/feature';
import { FeatureList } from '../../../models/aixm/feature-list';
import { ApiResponse } from '../../../models/api-response';
import { BackendApiService } from '../../../services/backend-api.service';
import { SettingsService } from '../../../services/settings.service';
import { DatasetFeatureComponent } from '../../common/cards/dataset-feature/dataset-feature.component';
import { DatasetComponent }  from '../../common/cards/dataset/dataset.component';
import { FeatureComponent }  from '../../common/cards/feature/feature.component';
import { DatasetEditComponent } from '../../common/dialogs/dataset-edit/dataset-edit.component';
import { AixmIconComponent } from '../../common/shared/aixm-icon/aixm-icon.component';

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [
    CommonModule, DatasetComponent, MatTabsModule, MatButtonModule, MatIconModule, FeatureComponent, DatasetFeatureComponent,
    AixmIconComponent, MatToolbarModule, MatButtonToggleModule, MatInputModule, MatTooltipModule, MatPaginatorModule, MatProgressBarModule,
  ],
  templateUrl: './browser.component.html',
  styleUrl: './browser.component.scss'
})
export class BrowserComponent implements OnInit {
  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;
  private network: Network | undefined;
  private url: string = 'aixm/datasets';
  loading: boolean = false;
  searchText: string = '';
  datasets: Dataset[] = [];
  dataset: Dataset | undefined;
  feature: Feature | undefined;
  datasetFeatures: DatasetFeature[] = [];
  viewLayout: 'browser' | 'graph' | 'combined' = 'browser';
  pageEvent: PageEvent = new PageEvent();
  pageSizeOptions: number[] = [10, 25, 50, 100];
  nodes: Node[] = [];
  edges: Edge[] = [];


  constructor(
      private backendApiService: BackendApiService,
      private matDialog: MatDialog,
      private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    // @ts-ignore
    this.viewLayout = this.settingsService.getValue('BROWSER_LAYOUT', this.viewLayout);
    this.refreshDatasets();
  }

  refresh() {
    if (this.feature){
      this.refreshDatasetFeatures(this.feature);
    } else {
      if (this.dataset) {
        this.refreshFeaturesList(this.dataset);
      } else {
        this.refreshDatasets();
      }
    }
  }

  refreshDatasets(): void {
    this.loading = true;
    this.backendApiService.getData(`${this.url}?${this.getPagingUrl()}`).subscribe((data: ApiResponse): void => {
      console.log(data);
      this.storePageState(data);
      if (data.data) {
        this.datasets = data.data;
        this.nodes = this.datasets.map((dataset: Dataset): Node => {
          return {id: dataset.id, label: dataset.name};
        });
      }
      this.loading = false;
      this.redrawGraph();
    });
  }

  refreshFeaturesList(dataset: Dataset): void {
    this.loading = true;
    this.backendApiService.getData(`${this.url}/${this.dataset?.id}/features_list?with=datasetfeature.feature&${this.getPagingUrl()
    }`).subscribe((data: ApiResponse): void => {
      console.log(data);
      this.storePageState(data);
      if (data.data) {
        dataset.featureLists = data.data;
        this.nodes = dataset.featureLists.map((featureList: FeatureList): Node => {
          return {id: featureList.feature.id, label: featureList.feature.abbreviation};
        });
      }
      this.loading = false;
      this.redrawGraph();
    });

  }

  refreshDatasetFeatures(feature: Feature): void {
    this.loading = true;
    this.backendApiService.getData(`${this.url}/${this.dataset?.id}/features_list/${feature.id
    }?with=datasetfeature.feature,datasetfeature.dataset_feature_properties,datasetfeatureproperty.property&${this.getPagingUrl()
    }`).subscribe((data: ApiResponse): void => {
      console.log(data);
      this.storePageState(data);
      if (data.data) {
        this.nodes = [];
        this.edges = [];
        this.datasetFeatures = data.data.map((x: DatasetFeature): DatasetFeature => {
          const datasetFeature: DatasetFeature = Object.assign(new DatasetFeature(), x);
          this.nodes.push(...datasetFeature.getNodes());
          this.edges.push(...datasetFeature.edges);
          return datasetFeature;
        });
      }
      this.loading = false;
      this.redrawGraph();
    });

  }

  datasetClick(dataset: Dataset): void {
    this.dataset = dataset;
    this.feature = undefined;
    this.datasetFeatures = [];
    this.pageEvent = new PageEvent();
    this.refreshFeaturesList(dataset);
  }

  featureClick(feature: Feature): void {
    this.feature = feature;
    this.pageEvent = new PageEvent();
    this.refreshDatasetFeatures(feature);
  }

  redrawGraph(): void {
    let data: Data = {
      nodes: this.nodes,
      edges: this.edges,
    };
    var options: Options = {};
    this.network = new Network(this.graphContainer.nativeElement, data, options);
  }

  addDataset(): void {
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

  switchLayout($event: 'browser' | 'graph' | 'combined' ) {
    this.viewLayout=$event;
    this.settingsService.setValue('BROWSER_LAYOUT', this.viewLayout);

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
    return `per_page=${this.pageEvent.pageSize ? this.pageEvent.pageSize : 10}&page=${
      this.pageEvent.pageIndex ? this.pageEvent.pageIndex + 1: 1}`;
  }
}
