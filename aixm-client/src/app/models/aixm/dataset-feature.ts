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
  referenceToFeaturesCount!:number;
  referencedByFeaturesCount!:number;
  datasetFeatureProperties: DatasetFeatureProperty[] = [];
  referencedByFeatures: DatasetFeature[] = [];
  edges: Edge[] = [];

  getNodes(): Node[] {
    let result: Node[] = [];
    this.addFeatureNode(result, this);
    this.datasetFeatureProperties.filter((p: DatasetFeatureProperty): boolean => (p.xlinkHref!==''))
        .forEach((dfp: DatasetFeatureProperty): void=>{
          const id: string = this.id+'_'+dfp.id;
          result.push({id: id, label: dfp.property?.name, color: '#ff4081'})
          this.edges.push({from: this.id, to: id, title: dfp.xlinkHref, arrows: 'to', color: '#ff4081'});
        });
    this.referencedByFeatures.forEach((df: DatasetFeature): void => {
      result = this.addFeatureNode(result, df);
      this.edges.push({from: this.id, to: df.id, arrows: 'from', color: '#3f51b5'});
    });
    return result;
  }

  addFeatureNode(nodes: Node[], datasetFeature: DatasetFeature): Node[] {
    nodes.push({
      id: datasetFeature.id,
      label: datasetFeature.feature?.abbreviation,
      shape: 'image',
      size: 15,
      image: getFeatureImagePath(datasetFeature.feature),
      brokenImage: getFeatureDefaultImagePath()
    });
    return nodes;
  }

}

