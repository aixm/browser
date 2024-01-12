import { FeatureList } from './feature-list';

export class Dataset {
  id: number | undefined;
  user_id: number | undefined;
  name: string | undefined;
  filename: string | undefined;
  description: string = "";
  createdAt: string | undefined;
  datasetFeaturesCount!: number;
  featureLists: FeatureList[] = [];
}
