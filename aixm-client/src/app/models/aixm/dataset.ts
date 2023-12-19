import { FeatureList } from './feature-list';

export class Dataset {
  id!: number;
  user_id!: number;
  name!: string;
  filename!: string;
  description: string = "";
  createdAt: string | undefined;
  datasetFeaturesCount!: number;
  featureLists: FeatureList[] = [];
}
