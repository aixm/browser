import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  hiddenFeatureIds: number[] = [];
  constructor() { }

  isFeatureHidden(featureId: number | undefined): boolean {
    return (this.hiddenFeatureIds.findIndex((id: number): boolean => id === featureId) !== -1)
  }

  hideFeature(featureId: number | undefined): void {
    if (featureId) {
      this.hiddenFeatureIds.push(featureId);
    }
  }

  showFeature(featureId: number | undefined): void {
    if (featureId) {
      this.hiddenFeatureIds.forEach((element: number, index: number): void => {
        if(element==featureId) this.hiddenFeatureIds.splice(index,1);
      });
    }
  }
}
