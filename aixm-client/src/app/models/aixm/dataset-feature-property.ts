import { DatasetFeature } from './dataset-feature';
import { Property }       from './property';

export class DatasetFeatureProperty {
  id!: number;
  parentId!: number;
  datasetFeatureId!: number;
  propertyId!: number;
  value!: string;
  xlinkHrefType!: string
  xlinkHref!: string;
  datasetFeature!: DatasetFeature | undefined;
  property: Property | undefined;
}
