import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule }        from '@angular/common';
import { MatBadgeModule }                           from '@angular/material/badge';
import { MatButtonModule }                          from '@angular/material/button';
import { MatExpansionModule }                       from '@angular/material/expansion';
import { MatIconModule }                 from '@angular/material/icon';
import { MatInputModule }                           from '@angular/material/input';
import { MatListModule }                            from '@angular/material/list';
import { MatMenuModule }                            from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule }                     from '@angular/material/progress-bar';
import { MatSidenavModule }              from '@angular/material/sidenav';
import { MatToolbarModule }                         from '@angular/material/toolbar';
import { MatTooltipModule }                         from '@angular/material/tooltip';
import { of }                                       from 'rxjs';
import { Data, Edge, Network } from 'vis-network';
import { Dataset }                                  from '../../../models/aixm/dataset';
import { FeatureList }                              from '../../../models/aixm/feature-list';
import { PipesModule }                              from '../../../pipes/pipes.module';
import { BackendApiService }   from '../../../services/backend-api.service';


@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    CommonModule, MatSidenavModule, MatExpansionModule, MatIconModule, MatButtonModule, MatToolbarModule, MatPaginatorModule,
    MatInputModule, PipesModule, MatTooltipModule, MatProgressBarModule, MatMenuModule, MatListModule, MatBadgeModule,
  ],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent implements OnInit {
  @ViewChild('treeContainer', { static: true }) treeContainer!: ElementRef;
  @ViewChild('fileUpload', { static: true }) fileUpload!: ElementRef;
  uploadStatus: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file
  datasets: Dataset[] = [];
  currentDatasetId: string = '';
  currentFeatureType: string = '';
  featureLists: FeatureList[] = [];
  iconPath: string = '/assets/images/icons/AIXM/';
  private network: Network | undefined;
  private data!: Data;
  private ghostNodeColor: string = '#FF0000';
  private ghostNodeShape: string = 'star';
  pageEvent: PageEvent = new PageEvent();
  pageSizeOptions = [5, 10, 25];
  private options = {
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

  constructor(
      private backendApiService: BackendApiService,
  ) {}


  ngOnInit(): void {
    this.refreshDatasets();
  }

  refreshDatasets(): void {
    const urlDatasets: string = `aixm/datasets`;
    this.backendApiService.getData(urlDatasets).subscribe(data => {
      if (data.data) {
        console.log(data.data);
        this.datasets = data.data;
        this.datasets.map((dataset: Dataset)=> this.refreshFeatureTypes(dataset));
      }
    });
  }

  refreshFeatureTypes(dataset: Dataset): void {
    const urlFeatureTypes: string = `aixm/datasets/${dataset.id}/features_list?with=datasetfeature.feature`;
    this.backendApiService.getData(urlFeatureTypes).subscribe(data => {
      if (data.data) {
        console.log(data.data);
        dataset.featureLists = data.data;
      }
    });
  }

  refreshGraph(datasetId: string, featureType: string): void {
    const urlGraph: string = `api/datasets/${datasetId}/feature_types/${featureType}/graph?offset=${
        this.pageEvent.pageIndex ? this.pageEvent.pageIndex*this.pageEvent.pageSize : 0}&limit=${
      this.pageEvent.pageSize ? this.pageEvent.pageSize : 5}`;
    this.backendApiService.getData(urlGraph).subscribe(data => {
      if (data.data) {
        console.log(data);
        this.storePageState(data.data);
        this.data = this.getEnhancedData(data.data.graph);
        console.log(this.data);
        this.network = new Network(this.treeContainer.nativeElement, this.data, this.options);
        this.currentDatasetId = datasetId;
        this.currentFeatureType = featureType;
      }
    });
  }

  getEnhancedData(data: Data): Data {
    // console.log(data);
    // @ts-ignore
    const nodes: any = data.nodes?.map((node: Node) => this.getEnhancedNode(node));

    const edges: any = data.edges?.map((edge: Edge) => this.getEnhancedEdge(edge));
    return { nodes, edges };
  }

  getEnhancedNode (node: any): any {
    const nodeEdges = [];// edges.filter((e: { source: any; target: any; }) => e.source === node.id || e.target === node.id);

    let label = node.assoc_count > nodeEdges.length ? `[+] ${node.abbrev}` : node.abbrev;

    if (node.fields.length > 0) {
      const sep = node.fields_concat ? '' : ',';
      const fields = node.fields.map((k: string) => Object.values(k)[0]).join(sep);
      label += `: ${fields}`;
    }

    // console.log(node);

    let image = `${this.iconPath}default.svg`;
    if (node.image && node.image === 'default') {
      image = `${this.iconPath}${node.abbrev}/${node.abbrev}.svg`;
    }

    return {
      id: node.id,
      name: node.name,
      label,
      associationsNum: node.assoc_count,
      title: 'title', //GraphModel.getNodePopup(origNode),
      color: {background: "orange"},
      //color: node.is_ghost ? this.ghostNodeColor : node.color,
      shape: node.is_ghost ? this.ghostNodeShape : node.shape,
      image: `${image}`,
      icon: node.icon ? node.icon : 'undefined',
      /* icon: {
       face: 'aixm',
       code: '\ub001',
       size: 100,
       color: '#000000',
       }, */
    };
  }

  getEnhancedEdge(edge: any): any {
    return {
      from: edge.source,
      to: edge.target,
      label: edge.name,
      dashes: edge.isBroken,
      arrows: edge.direction === 'source' ? 'from' : 'to'
    };
  }

  storePageState(data: any) {
    this.pageEvent.pageSize = data.limit;
    this.pageEvent.length = data.size;
    /*
    this.pageEvent.pageIndex = data.offset;
    this.pageEvent.previousPageIndex = data.prevOffset;
    */
  }

  handlePageEvent(event: PageEvent) {
    this.pageEvent = event;
    console.log(this.pageEvent);
    this.refreshGraph(this.currentDatasetId, this.currentFeatureType);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files.item(0);
    if (file) {
      this.uploadStatus = 'uploading';
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.backendApiService.postItem('api/upload', formData).subscribe(data => {
        if (!data.error) {
          // console.log(data);
          this.uploadStatus = 'success';
          this.refreshDatasets();
        } else {
          this.uploadStatus = 'fail';
        }
      });
    }
  }
}
