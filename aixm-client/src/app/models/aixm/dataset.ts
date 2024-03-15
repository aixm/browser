import { User } from '../auth/user';

export class Dataset {
  id: number | undefined;
  userId: number | undefined;
  name: string | undefined;
  filename: string | undefined;
  description: string | undefined;
  createdAt: string | undefined;
  datasetFeaturesCount!: number;
  user: User | undefined;
  checked: boolean = false;
}
