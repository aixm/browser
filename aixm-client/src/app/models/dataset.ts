import { FeatureType } from './feature-type';

export class Dataset {
  datasetId!: string;
  datasetName!: string;
  featureTypes: FeatureType[] = [];
}
