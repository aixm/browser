import { Node }                                            from 'vis-network';
import { getFeatureDefaultImagePath, getFeatureImagePath } from '../../helpers/utils';
import { Feature }                                         from './feature';

export class FeatureList {
  count: number = 0;
  feature!: Feature

  getNode(): Node {
    return {
      id: this.feature.id,
      label: `${this.feature?.abbreviation} (${this.count})`,
      shape: 'image',
      image: getFeatureImagePath(this.feature),
      brokenImage: getFeatureDefaultImagePath()
    };
  }
}
