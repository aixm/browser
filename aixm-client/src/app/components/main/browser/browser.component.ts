import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule }                             from '@angular/common';
import { FormsModule }                              from '@angular/forms';
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
import { ActivatedRoute, ActivatedRouteSnapshot }      from '@angular/router';
import { Network, DataSet, Data, Edge, Node, Options } from 'vis-network';
import { getById, getByKey }                           from '../../../helpers/utils';
import { Dataset }                                     from '../../../models/aixm/dataset';
import { DatasetFeature }    from '../../../models/aixm/dataset-feature';
import { DatasetFeatureProperty } from '../../../models/aixm/dataset-feature-property';
import { Feature }           from '../../../models/aixm/feature';
import { FeatureList } from '../../../models/aixm/feature-list';
import { ApiResponse } from '../../../models/api-response';
import { BackendApiService } from '../../../services/backend-api.service';
import { FeatureService }                              from '../../../services/feature.service';
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
    FormsModule,
  ],
  templateUrl: './browser.component.html',
  styleUrl: './browser.component.scss'
})
export class BrowserComponent implements OnInit {
  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;
  private network: Network | undefined;
  private urlDatasets: string = 'aixm/datasets';
  private urlDatasetFeatures: string = 'aixm/dataset_features';
  loading: boolean = false;
  searchText: string = '';
  datasets: Dataset[] = [];
  dataset: Dataset | undefined;
  feature: Feature | undefined;
  datasetFeature: DatasetFeature | undefined;
  datasetFeatures: DatasetFeature[] = [];
  viewLayout: 'browser' | 'graph' | 'combined' = 'browser';
  pageEvent: PageEvent = new PageEvent();
  pageSizeOptions: number[] = [10, 25, 50, 100];
  nodes: Node[] = [];
  edges: Edge[] = [];


  constructor(
      private backendApiService: BackendApiService,
      private matDialog: MatDialog,
      private settingsService: SettingsService,
      private route: ActivatedRoute,
      private featureService: FeatureService
  ) {}

  ngOnInit(): void {
    // layout
    if (this.route.snapshot.queryParamMap.get('layout')) {
      let layout = this.route.snapshot.queryParamMap.get('layout');
      if (layout === 'browser' || layout === 'graph' || layout === 'combined') {
        this.viewLayout = layout;
        this.settingsService.setValue('BROWSER_LAYOUT', this.viewLayout);
      }
    } else {
      // @ts-ignore
      this.viewLayout = this.settingsService.getValue('BROWSER_LAYOUT', this.viewLayout);
    }
      // dataset
    if (this.route.snapshot.queryParamMap.get('dataset')) {
      let dataset: Dataset = new Dataset();
      dataset.id = Number(this.route.snapshot.queryParamMap.get('dataset'));
      this.datasetClick(dataset);
    } else {
      this.refreshDatasets();
    }
  }

  refresh() {
    if (this.datasetFeature){
      this.refreshDatasetFeature(this.datasetFeature);
    } else {
      if (this.feature) {
        this.refreshDatasetFeatures(this.feature);
      } else {
        if (this.dataset) {
          this.refreshFeaturesList(this.dataset);
        } else {
          this.refreshDatasets();
        }
      }
    }
  }

  refreshDatasets(): void {
    this.loading = true;
    this.backendApiService.getData(`${this.urlDatasets}?${this.getPagingUrl()}`+ (this.searchText ? '&search=' + this.searchText : ''))
        .subscribe((data: ApiResponse): void => {
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
    this.backendApiService.getData(`${this.urlDatasets}/${this.dataset?.id}/features_list?with=datasetfeature.feature&${this.getPagingUrl()
    }` + (this.searchText ? '&search=' + this.searchText : '')).subscribe((data: ApiResponse): void => {
      console.log(data);
      this.storePageState(data);
      if (data.data) {
        this.nodes = [];
        this.edges = [];
        dataset.featureLists = data.data.map((x: FeatureList): FeatureList => {
          const featureList: FeatureList = Object.assign(new FeatureList(), x);
          this.nodes.push(featureList.getNode());
          return featureList;
        });
      }
      this.loading = false;
      this.redrawGraph();
    });

  }

  refreshDatasetFeatures(feature: Feature): void {
    this.loading = true;
    this.clearGraph();
    this.backendApiService.getData(`${this.urlDatasets}/${this.dataset?.id}/features_list/${feature.id
    }?with=datasetfeature.feature,datasetfeature.dataset_feature_properties,datasetfeatureproperty.property&${this.getPagingUrl()
    }` + (this.searchText ? '&search=' + this.searchText : '')).subscribe((data: ApiResponse): void => {
      console.log(data);
      this.storePageState(data);
      if (data.data) {
        this.datasetFeatures = data.data.map((x: DatasetFeature): DatasetFeature => Object.assign(new DatasetFeature(this.featureService), x));
        this.processNodesAndEdges();
      }
      this.loading = false;
      this.redrawGraph();
    });
  }

  refreshDatasetFeature(datasetFeature: DatasetFeature): void {
    this.loading = true;
    this.clearGraph();
    this.backendApiService.getData(`${this.urlDatasetFeatures}/${datasetFeature.id
    }?with=datasetfeature.feature,datasetfeature.dataset_feature_properties,datasetfeatureproperty.property`
    ).subscribe((data: ApiResponse): void => {
      console.log(data);
      this.resetPageState();
      if (data.data) {
        const datasetFeature: DatasetFeature = Object.assign(new DatasetFeature(this.featureService), data.data);
        this.datasetFeature = datasetFeature;
        this.datasetFeatures = [ datasetFeature ];
        this.processNodesAndEdges();
      }
      this.loading = false;
      this.redrawGraph();
    });
  }

  datasetClick(dataset: Dataset): void {
    this.dataset = dataset;
    this.feature = undefined;
    this.datasetFeature = undefined;
    this.datasetFeatures = [];
    this.pageEvent = new PageEvent();
    this.refreshFeaturesList(dataset);
  }

  featureClick(feature: Feature): void {
    this.feature = feature;
    this.datasetFeature = undefined;
    this.pageEvent = new PageEvent();
    this.refreshDatasetFeatures(feature);
  }

  datasetFeatureClick(datasetFeature: DatasetFeature): void {
    this.datasetFeature = datasetFeature;
    this.refreshDatasetFeature(datasetFeature);
  }

  featureVisibilityChange(): void {
    // console.log('feature visibility changed');
    this.nodes = [];
    this.edges = [];
    this.processNodesAndEdges(true);
    this.redrawGraph();
  }

  clearGraph(): void {
    this.nodes = [];
    this.edges = [];
    this.redrawGraph();
  }

  redrawGraph(): void {
    let data: Data = {
      nodes: this.nodes,
      edges: this.edges,
    };
    var options: Options = {
      interaction: {
        hover: true,
      },
      nodes: {
        shapeProperties: {
          interpolation: false,
        },
      },
      layout: {
        improvedLayout: false,
      },
      physics: {
        stabilization: false,
      },
    };
    this.network = new Network(this.graphContainer.nativeElement, data, options);

    // events
    this.network.on("hoverNode", (params: any): void => {
      // @ts-ignore
      this.network.canvas.body.container.style.cursor = 'pointer';
    });

    this.network.on("blurNode", (params: any): void => {
      // @ts-ignore
      this.network.canvas.body.container.style.cursor = 'default';
    });
    this.network.on("click", (params: any): void => {
      params.event = "click";
      this.onGraphClick(params);
    });
    this.network.on("doubleClick", (params: any): void => {
      params.event = "doubleClick";
      this.onGraphClick(params);
    });
    this.network.on("oncontext", (params: any): void =>{
      params.event = "oncontext";
      this.onGraphClick(params);
    });

  }

  processNodesAndEdges(clearDatasetFeatureEdges?: boolean): void {
    this.datasetFeatures.forEach((df: DatasetFeature): void => {
      if (clearDatasetFeatureEdges) {
        // need to clear when redraw graph without data updating
        df.clearEdges();
      }
      const nodes: Node[] = df.getNodes();
      nodes.forEach((node: Node): void => {
        if (this.nodes.findIndex((n:Node): boolean => n.id === node.id) === -1) {
          this.nodes.push(node);
        }
      });
      this.edges.push(...df.edges);
    });
  }

  onGraphClick(params: any): void {
    console.log(params);
    if (params.nodes.length > 0) {
      console.log(params.nodes[0]);
      if (!this.dataset) {
        this.dataset = getById(this.datasets, params.nodes[0]);
      } else {
        if (!this.feature) {
          console.log(this.dataset.featureLists);
          this.feature = getByKey(this.dataset.featureLists, 'featureId', params.nodes[0]).feature;
        } else {
          let id: string = String(params.nodes[0]);
          const n: number = id.lastIndexOf('_');
          if (n !== -1) {
            id = id.substring(0, n);
          }
          let datasetFeature: DatasetFeature = getById(this.datasetFeatures, id);
          if (!datasetFeature) {
            datasetFeature = new DatasetFeature(this.featureService);
            datasetFeature.id = Number(id);
          }
          this.datasetFeature = datasetFeature;
        }
      }
      this.refresh();
    }
  }

  goDatasets(): void {
    this.dataset = undefined;
    this.feature = undefined;
    this.edges = [];
    this.nodes = this.datasets.map((dataset: Dataset): Node => {
      return {id: dataset.id, label: dataset.name};
    });
    this.redrawGraph();
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

  resetPageState(): void {
    this.pageEvent.pageSize = 0;
    this.pageEvent.length = 0;
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
