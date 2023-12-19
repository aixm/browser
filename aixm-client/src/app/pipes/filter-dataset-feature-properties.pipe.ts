import { Pipe, PipeTransform } from '@angular/core';
import { DatasetFeatureProperty } from '../models/aixm/dataset-feature-property';

@Pipe({
  name: 'filterDatasetFeatureProperty'
})
/**
 * Filter User
 */
export class FilterDatasetFeaturePropertyPipe implements PipeTransform {
  transform(datasetFeatureProperty: DatasetFeatureProperty[], searchText: string): any[] {
    if (!datasetFeatureProperty) {
      return [];
    }
    if (!searchText) {
      return datasetFeatureProperty;
    }
    searchText = searchText.toLowerCase();
    return datasetFeatureProperty.filter(obj =>
      (obj.value ? obj.value.toLocaleLowerCase().includes(searchText) : false) ||
      (obj.xlinkHref ? obj.xlinkHref.toLocaleLowerCase().includes(searchText) : false)
    );
  }
}
