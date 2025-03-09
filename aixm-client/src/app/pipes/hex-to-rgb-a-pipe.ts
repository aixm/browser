import { Pipe, PipeTransform } from '@angular/core';
import { hexToRgbA }           from '../helpers/utils';
@Pipe({
    name: 'hexToRgbA',
    pure: true,
    standalone: false
})
export class HexToRgbAPipe implements PipeTransform {
  transform(color: string, alfa: number): string {
    return hexToRgbA(color, alfa);
  }
}
