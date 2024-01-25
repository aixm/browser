import { Node }                                            from 'vis-network';
import { getFeatureDefaultImagePath, getFeatureImagePath } from '../../helpers/utils';
import { Feature }                                         from './feature';

export class FeatureList {
  count: number = 0;
  feature_id!: number;
  feature!: Feature

  getNode(): Node {
    return {
      id: this.feature.id,
      label: `${this.feature?.abbreviation} (${this.count})`,
      title: `${this.feature?.name}`,
      shape: 'image', //circularImage
      font: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--mat-sidenav-content-text-color'),
      },
      size: 15,
      image: getFeatureImagePath(this.feature),
      brokenImage: getFeatureDefaultImagePath()
    };
  }
}
