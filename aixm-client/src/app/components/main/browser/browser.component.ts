import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule }                             from '@angular/common';
import { FormsModule }                              from '@angular/forms';
import { MatBadgeModule }                           from '@angular/material/badge';
import { MatButtonModule }                          from '@angular/material/button';
import { MatButtonToggleModule }                    from '@angular/material/button-toggle';
import { MatCheckboxModule }                        from '@angular/material/checkbox';
import { MatDialog, MatDialogRef }                  from '@angular/material/dialog';
import { MatIconModule }                            from '@angular/material/icon';
import { MatInputModule }                           from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule }                     from '@angular/material/progress-bar';
import { MatSlideToggleModule }                     from '@angular/material/slide-toggle';
import { MatTabsModule }                 from '@angular/material/tabs';
import { MatToolbarModule }       from '@angular/material/toolbar';
import { MatTooltipModule }                            from '@angular/material/tooltip';
import { ActivatedRoute }      from '@angular/router';
import { Network, Data, Edge, Node, Options }                 from 'vis-network';
import { copyToClipboard, getById, getByKey, getTooltip, isValidUUID } from '../../../helpers/utils';
import { Dataset }                                                     from '../../../models/aixm/dataset';
import { DatasetFeature }    from '../../../models/aixm/dataset-feature';
import { Feature }           from '../../../models/aixm/feature';
import { FeatureList } from '../../../models/aixm/feature-list';
import { ApiResponse } from '../../../models/api-response';
import { PipesModule } from '../../../pipes/pipes.module';
import { AuthService } from '../../../services/auth.service';
import { BackendApiService } from '../../../services/backend-api.service';
import { FeatureService }                              from '../../../services/feature.service';
import { NotificationService }                         from '../../../services/notification.service';
import { SettingsService } from '../../../services/settings.service';
import { DatasetFeatureComponent } from '../../common/cards/dataset-feature/dataset-feature.component';
import { DatasetComponent }  from '../../common/cards/dataset/dataset.component';
import { FeatureComponent }  from '../../common/cards/feature/feature.component';
import { InfoComponent } from '../../common/dialogs/info/info.component';
import { DatasetEditComponent } from '../datasets/dataset-edit/dataset-edit.component';
import { AixmIconComponent } from '../../common/shared/aixm-icon/aixm-icon.component';

@Component({
    selector: 'app-browser',
    imports: [
        CommonModule, DatasetComponent, MatTabsModule, MatButtonModule, MatIconModule, FeatureComponent, DatasetFeatureComponent,
        AixmIconComponent, MatToolbarModule, MatButtonToggleModule, MatInputModule, MatTooltipModule, MatPaginatorModule, MatProgressBarModule,
        FormsModule, MatCheckboxModule, MatBadgeModule, MatSlideToggleModule, PipesModule,
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
  featureLists: FeatureList[] | undefined;
  feature: Feature | undefined;
  datasetFeature: DatasetFeature | undefined;
  datasetFeatures: DatasetFeature[] = [];
  viewLayout: 'browser' | 'graph' | 'combined' = 'combined';
  pageEvent: PageEvent = new PageEvent();
  pageSizeOptions: number[] = [10, 25, 50, 100];
  nodes: Node[] = [];
  edges: Edge[] = [];
  multiMode: boolean = false;


  constructor(
      private backendApiService: BackendApiService,
      private matDialog: MatDialog,
      private settingsService: SettingsService,
      private route: ActivatedRoute,
      private featureService: FeatureService,
      private notificationService: NotificationService,
      public authService: AuthService
  ) {}

  ngOnInit(): void {
    // graph
    this.createGraph();

    // layout
    if (this.route.snapshot.queryParamMap.get('layout')) {
      const layout: string | null = this.route.snapshot.queryParamMap.get('layout');
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
      this.refreshDatasets((): void => {this.datasetClick(getById(
          this.datasets, Number(this.route.snapshot.queryParamMap.get('dataset'))))}, false);
    } else {
      this.refreshDatasets();
    }
  }


  goDatasets(): void {
    this.pageEvent = new PageEvent();
    this.dataset = undefined;
    this.featureLists = undefined;
    this.feature = undefined;
    this.datasetFeature = undefined;
    this.refreshDatasets();
  }

  goFeatureLists(dataset?: Dataset): void {
    if (dataset) {
      this.dataset = dataset;
    }
    this.pageEvent = new PageEvent();
    this.featureLists = undefined;
    this.feature = undefined;
    this.datasetFeature = undefined;
    this.refreshFeaturesList();
  }

  goDatasetFeatures(feature: Feature, dataset?: Dataset): void {
    if (dataset) {
      this.dataset = dataset;
    }
    if (feature) {
      this.feature = feature;
    }
    this.pageEvent = new PageEvent();
    this.datasetFeature = undefined;
    this.refreshDatasetFeatures();
  }

  goDatasetFeature(datasetFeature: DatasetFeature, feature?: Feature, dataset?: Dataset): void {
    if (dataset) {
      this.dataset = dataset;
    }
    if (feature) {
      this.feature = feature;
    }
    this.datasetFeature = datasetFeature;
    this.refreshDatasetFeature(new PageEvent());
  }

  goDatasetFeatureWithPageEvent(event: any): void {
    this.datasetFeature = event.datasetFeature;
    this.refreshDatasetFeature(event.pageEvent);
  }

  refresh(): void {
    if (this.datasetFeature){
      this.refreshDatasetFeature(new PageEvent());
    } else {
      if (this.feature) {
        this.refreshDatasetFeatures();
      } else {
        if ((this.dataset && !this.multiMode) || (this.multiMode && this.getSelectedDatasets().length>0)) {
          // @ts-ignore
          this.refreshFeaturesList(this.dataset);
        } else {
          this.refreshDatasets();
        }
      }
    }
  }

  refreshDatasets(callback?: Function, paging: boolean = true): void {
    this.loading = true;
    this.backendApiService.getData(`${this.urlDatasets}?${paging ? this.getPagingUrl() : '' }`+ (this.searchText ? '&search=' + this.searchText : ''))
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
      this.updateGraph();
      callback?.call(this);
    });
  }

  refreshFeaturesList(): void {
    this.loading = true;
    this.backendApiService.getData(`${this.urlDatasets}/${
      this.dataset?.id ? this.dataset?.id : 0}/features_list?with=datasetfeature.feature${
      this.getDatasetsUrl()}&${this.getPagingUrl()}` + (this.searchText ? '&search=' + this.searchText : '')).subscribe((data: ApiResponse): void => {
      console.log(data);
      this.storePageState(data);
      if (data.data) {
        this.nodes = [];
        this.edges = [];
        this.featureLists = data.data.map((x: FeatureList): FeatureList => {
          const featureList: FeatureList = Object.assign(new FeatureList(), x);
          this.nodes.push(featureList.getNode());
          return featureList;
        });
      }
      this.loading = false;
      this.updateGraph();
    });

  }

  refreshDatasetFeatures(): void {
    this.loading = true;
    this.backendApiService.getData(`${this.urlDatasets}/${this.dataset?.id? this.dataset.id : 0}/features_list/${this.feature?.id
    }?with=datasetfeature.dataset,datasetfeature.feature,datasetfeature.dataset_feature_properties,datasetfeatureproperty.property${
      this.getDatasetsUrl()}&${this.getPagingUrl()}` + (this.searchText ? '&search=' + this.searchText : '')).subscribe((data: ApiResponse): void => {
      console.log(data);
      this.storePageState(data);
      if (data.data) {
        this.datasetFeatures = data.data.map((x: DatasetFeature): DatasetFeature => Object.assign(new DatasetFeature(this.featureService), x));
        this.processNodesAndEdges();
      } else {
        this.datasetFeatures = [];
      }
      this.loading = false;
      this.updateGraph();
    });
  }

  refreshDatasetFeature(pageEvent: PageEvent): void {
    this.loading = true;
    this.clearGraph();
    this.backendApiService.getData(`${this.urlDatasetFeatures}/${this.datasetFeature?.id
    }?with=datasetfeature.dataset,datasetfeature.feature,datasetfeature.dataset_feature_properties,datasetfeatureproperty.property&rbf_page=${
        pageEvent.pageIndex ? pageEvent.pageIndex + 1 : 1}`).subscribe((data: ApiResponse): void => {
      console.log(data);
      this.resetPageState();
      if (data.data) {
        const datasetFeature: DatasetFeature = Object.assign(new DatasetFeature(this.featureService), data.data);
        this.datasetFeature = datasetFeature;
        this.datasetFeatures = [ datasetFeature ];
        this.processNodesAndEdges();
      }
      this.loading = false;
      this.updateGraph();
    });
  }

  datasetClick(dataset?: Dataset): void {
    if (!this.multiMode) {
      this.goFeatureLists(dataset);
    } else {
      if (dataset) {
        dataset.checked = !dataset.checked;
      }
    }
  }

  getSelectedDatasets(): Dataset[] {
    return this.datasets.filter((ds: Dataset) => ds.checked);
  }

  featureVisibilityChange(): void {
    // console.log('feature visibility changed');
    this.nodes = [];
    this.edges = [];
    this.processNodesAndEdges(true);
    this.updateGraph();
  }

  clearGraph(): void {
    this.nodes = [];
    this.edges = [];
    this.updateGraph();
  }

  updateGraph(): void {
    const data: Data = {
      nodes: this.nodes,
      edges: this.edges,
    };
    this.network?.setData(data);
  }

  createGraph(): void {
    const data: Data = {
      nodes: this.nodes,
      edges: this.edges,
    };
    const options: Options = {
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
      params.event = "hoverNode";
      // @ts-ignore
      this.network.canvas.body.container.style.cursor = 'pointer';
    });

    this.network.on("blurNode", (params: any): void => {
      params.event = "blurNode";
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
      if (!this.dataset || (this.multiMode && this.getSelectedDatasets().length===0)) {
        this.multiMode = false;
        this.multiModeToggle();
        this.dataset = getById(this.datasets, params.nodes[0]);
        this.refresh();
      } else {
        if (!this.feature) {
          // console.log(this.featureLists);
          if (this.featureLists) {
            this.feature = getByKey(this.featureLists, 'featureId', params.nodes[0]).feature;
          }
          this.refresh();
        } else {
          if (params.nodes[0]) {
            const id: string = String(params.nodes[0]);
            if (!isValidUUID(id)) {
              let datasetFeature: DatasetFeature = getById(this.datasetFeatures, id);
              if (!datasetFeature) {
                datasetFeature = new DatasetFeature(this.featureService);
                datasetFeature.id = Number(id);
              }
              this.datasetFeature = datasetFeature;
              this.refresh();
            } else {
              // console.log('copy');
              // broken dataset feature
              this.copyToCb(id);
            }
          }
        }
      }
    }
  }

  addDataset(): void {
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
        if (!dataset.id) {
          this.matDialog.open(InfoComponent, {
            data: {
              title: 'Uploading dataset',
              message: 'It takes several minutes to parse uploaded dataset. Please, check dataset\'s status.'}
          });
        }
      }
    });
  }

  switchLayout($event: 'browser' | 'graph' | 'combined' ): void {
    this.viewLayout=$event;
    this.settingsService.setValue('BROWSER_LAYOUT', this.viewLayout);
    //this.network?.fit();
    //this.createGraph();


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

  getDatasetsUrl(): string {
    if (this.getSelectedDatasets().length>0) {
      return `&datasets=${this.getSelectedDatasets().map((ds:Dataset)=>ds.id).join(',')}`;
    } else {
      return '';
    }
  }

  multiModeToggle(): void {
    if (!this.multiMode) {
      // clear selected datasets
      this.datasets.forEach((ds: Dataset): void => {
        ds.checked = false;
      })
    }
    this.goDatasets();
  }

  copyToCb(text?: string): void {
    if (text) {
      copyToClipboard(text);
      this.notificationService.notify('Copied to clipboard: ' + text);
    }
  }

  protected readonly getTooltip = getTooltip;
}
