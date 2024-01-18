import { getFeatureDefaultImagePath, getFeatureImagePath } from '../../helpers/utils';
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
 // referenceToFeaturesCount!:number;
 // referencedByFeaturesCount!:number;
  datasetFeatureProperties: DatasetFeatureProperty[] = [];
  referenceToFeatures: DatasetFeature[] = [];
  referencedByFeatures: DatasetFeature[] = [];
  toFeatures: Feature[] | undefined;
  byFeatures: Feature[] | undefined;
  edges: Edge[] = [];
  label: string | undefined;


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


  getNodes(): Node[] {
    let result: Node[] = [];
    this.addFeatureNode(result, this);
    this.referenceToFeatures.forEach((df: DatasetFeature): void => {
      result = this.addFeatureNode(result, Object.assign(new DatasetFeature(), df));
      this.edges.push({from: this.id, to: df.id, arrows: 'to', color: '#ff4081'});
    });
    this.referencedByFeatures.forEach((df: DatasetFeature): void => {
      result = this.addFeatureNode(result, Object.assign(new DatasetFeature(), df));
      this.edges.push({from: this.id, to: df.id, arrows: 'from', color: '#3f51b5'});
    });
    return result;
  }

  addFeatureNode(nodes: Node[], datasetFeature: DatasetFeature): Node[] {
    nodes.push({
      id: datasetFeature.id,
      label: datasetFeature.getLabel(),
      shape: 'image',
      size: 15,
      image: getFeatureImagePath(datasetFeature.feature),
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

