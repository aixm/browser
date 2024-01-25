import { getFeatureBrokenImagePath, getFeatureDefaultImagePath, getFeatureImagePath } from '../../helpers/utils';
import { FeatureService }                                                             from '../../services/feature.service';
import { DatasetFeatureProperty }                          from './dataset-feature-property';
import { Feature }                                         from './feature';
import { Edge, Node }                                      from 'vis-network';

export class DatasetFeature {
  id!: number;
  datasetId!: number;
  featureId!: number;
  gmlIdValue!: string;
  gmlIdentifierValue!: string;
  feature: Feature | undefined;
  datasetFeatureProperties: DatasetFeatureProperty[] = [];
  referenceToFeatures: DatasetFeature[] = [];
  referencedByFeatures: DatasetFeature[] = [];
  toFeatures: Feature[] | undefined;
  byFeatures: Feature[] | undefined;
  brokenFeatures: DatasetFeature[] | undefined;
  edges: Edge[] = [];
  label: string | undefined;
  tooltip: HTMLDivElement | undefined;

  constructor(
      private featureService: FeatureService
  ) {}

  clearEdges(): void {
    this.edges = [];
  }

  getLabel(): string {
    if (this.label) {
      return this.label;
    } else {
      let fallbackLabel: string = this.feature?.abbreviation ? this.feature?.abbreviation : '';
      let label: string = '';
      this.datasetFeatureProperties.forEach((dfp: DatasetFeatureProperty):void => {
        if (dfp.property?.isIdentifying && dfp.value) {
          label += dfp.value + ' ';
        }
      });
      return label.length>0 ? label : fallbackLabel;
      // return fallbackLabel;
    }
  }

  getTooltip(): HTMLDivElement {
    if (this.tooltip) {
      return this.tooltip;
    } else {
      let fallbackTooltip: string = `<p>${this.feature?.name}</p>`;
      let tooltip: string = '';
      this.datasetFeatureProperties.forEach((dfp: DatasetFeatureProperty):void => {
        if (dfp.property?.isIdentifying && dfp.value.trim().length>0) {
          tooltip += `<tr><td><i>${dfp.property.name}:</i></td><td>${dfp.value}</td></tr>`;
        }
      });
      const container: HTMLDivElement = document.createElement("div");
      container.innerHTML = tooltip.length>0 ? `${fallbackTooltip}<table>${tooltip}</table>` : fallbackTooltip;
      return container;
    }
  }

  getReferenceToFeaturesCount(): number {
    return this.referenceToFeatures.length;
  }

  getReferencedByFeaturesCount(): number {
    return this.referencedByFeatures.length;
  }

  getReferenceToFeatures(): Feature[] {
    if (!this.toFeatures) {
      this.toFeatures = [];
      this.referenceToFeatures.forEach((df: DatasetFeature): void => {
        if (df.feature) {
          if (this.toFeatures?.findIndex((f: Feature): boolean => f.id === df.feature?.id) === -1) {
            this.toFeatures.push(df.feature);
          }
        }
      });
    }
    return this.toFeatures;
  }

  getReferencedByFeatures(): Feature[] {
    if (!this.byFeatures) {
      this.byFeatures = [];
      this.referencedByFeatures.forEach((df: DatasetFeature): void => {
        if (df.feature) {
          if (this.byFeatures?.findIndex((f: Feature): boolean => f.id === df.feature?.id) === -1) {
            this.byFeatures.push(df.feature);
          }
        }
      });
    }
    return this.byFeatures;
  }


  getBrokenFeatures(): DatasetFeature[] {
    if (!this.brokenFeatures) {
      this.brokenFeatures = [];
      this.datasetFeatureProperties.forEach((dfp: DatasetFeatureProperty): void => {
        if (dfp.isBroken) {
          let df: DatasetFeature = new DatasetFeature(this.featureService);
          df.featureId = dfp.id;
          df.gmlIdentifierValue = dfp.xlinkHref;
          // @ts-ignore
          this.brokenFeatures.push(df);
        }
      });
    }
    return this.brokenFeatures;
  }


  getNodes(): Node[] {
    let result: Node[] = [];
    this.addFeatureNode(result, this);
    // ref to
    this.referenceToFeatures.forEach((df: DatasetFeature): void => {
      result = this.addFeatureNode(result, Object.assign(new DatasetFeature(this.featureService), df));
      let accentColor: string = getComputedStyle(document.documentElement).getPropertyValue('--mdc-checkbox-selected-icon-color');
      this.edges.push({from: this.id, to: df.id, arrows: 'to', color: accentColor});
    });
    // ref by
    this.referencedByFeatures.forEach((df: DatasetFeature): void => {
      result = this.addFeatureNode(result, Object.assign(new DatasetFeature(this.featureService), df));
      let primaryColor: string = getComputedStyle(document.documentElement).getPropertyValue('--mat-badge-background-color');
      this.edges.push({from: this.id, to: df.id, arrows: 'from', color: primaryColor});
    });
    // broken
    this.getBrokenFeatures().forEach((df: DatasetFeature): void => {
      result = this.addBrokenFeatureNode(result, Object.assign(new DatasetFeature(this.featureService), df));
      let accentColor: string = getComputedStyle(document.documentElement).getPropertyValue('--mdc-checkbox-selected-icon-color');
      this.edges.push({from: this.id, to: df.gmlIdentifierValue, arrows: 'to', color: accentColor});
    });
    return result;
  }

  addFeatureNode(nodes: Node[], datasetFeature: DatasetFeature): Node[] {
    if (!this.featureService.isFeatureHidden(datasetFeature.featureId)) {
      nodes.push({
        id: datasetFeature.id,
        label: datasetFeature.getLabel(),
        title: datasetFeature.getTooltip(),
        shape: 'image', //circularImage
        font: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--mat-sidenav-content-text-color'),
        },
        size: 15,
        image: getFeatureImagePath(datasetFeature.feature),
        brokenImage: getFeatureDefaultImagePath()
      });
    }
    return nodes;
  }

  addBrokenFeatureNode(nodes: Node[], datasetFeature: DatasetFeature): Node[] {
    nodes.push({
      id: datasetFeature.id,
      label: 'Unknown',
      title: datasetFeature.gmlIdValue,
      shape: 'image', //circularImage
      font: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--mat-sidenav-content-text-color'),
      },
      size: 15,
      image: getFeatureBrokenImagePath(),
      brokenImage: getFeatureDefaultImagePath()
    });
    return nodes;
  }









  // deprecated
  getReferenceUniqFeatures(): Feature[] {
    let features: Feature[] = [];
    this.referenceToFeatures.forEach((df: DatasetFeature):void => {
      if (df.feature) {
        if (features.findIndex((f: Feature): boolean => f.id === df.feature?.id) === -1) {
          features.push(df.feature);
        }
      }
    });
    this.referencedByFeatures.forEach((df: DatasetFeature):void => {
      if (df.feature) {
        if (features.findIndex((f: Feature): boolean => f.id === df.feature?.id) === -1) {
          features.push(df.feature);
        }
      }
    });
    return features;
  }
}

