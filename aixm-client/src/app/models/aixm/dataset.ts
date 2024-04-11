import { User } from '../auth/user';
import { DatasetStatus } from './dataset-status';

export class Dataset {
  id: number | undefined;
  userId: number | undefined;
  name: string | undefined;
  filename: string | undefined;
  description: string | undefined;
  createdAt: string | undefined;
  datasetFeaturesCount!: number;
  user: User | undefined;
  datasetStatus: DatasetStatus | undefined;
  checked: boolean = false;
}
