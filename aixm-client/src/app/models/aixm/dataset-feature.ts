import { DatasetFeatureProperty } from './dataset-feature-property';
import { Feature }                from './feature';
import { Edge, Node } from 'vis-network';

export class DatasetFeature {
  id!: number;
  datasetId!: number;
  featureId!: number;
  gmlIdValue!: string;
  gmlIdentifierValue!: string;
  feature: Feature | undefined;
  associatedFeaturesCount!:number;
  descendantFeaturesCount!:number;
  datasetFeatureProperties: DatasetFeatureProperty[] = [];
  descendantFeatures: DatasetFeature[] = [];
  edges: Edge[] = [];

  getNodes(): Node[] {
    let result: Node[] = [];
    this.addFeatureNode(result, this);
    this.datasetFeatureProperties.filter((p: DatasetFeatureProperty):boolean => (p.xlinkHref!==''))
        .forEach((dfp: DatasetFeatureProperty): void=>{
          const id: string = this.id+'_'+dfp.id;
          result.push({id: id, label: dfp.property?.name, color: '#ff4081'})
          this.edges.push({from: this.id, to: id, title: dfp.xlinkHref, arrows: 'to', color: '#ff4081'});
        });
    this.descendantFeatures.forEach((df: DatasetFeature): void => {
        this.addFeatureNode(result, Object.assign(new DatasetFeature(), df));
        this.edges.push({from: this.id, to: df.id, arrows: 'from', color: '#3f51b5'});
    });
    return result;
  }

  addFeatureNode(nodes: Node[], datasetFeature: DatasetFeature): Node[] {
    nodes.push({
      id: datasetFeature.id,
      label: datasetFeature.feature?.abbreviation,
      shape: 'image',
      image: datasetFeature.getImagePath(),
      brokenImage: datasetFeature.getBrokenImagePath()
    });
    return nodes;
  }

  getImagePath(): string {
    return `assets/images/icons/AIXM/${this.feature?.abbreviation}/${this.feature?.abbreviation}.svg`;
  }

  getBrokenImagePath(): string {
    return `assets/images/icons/AIXM/default.svg`;
  }

}

