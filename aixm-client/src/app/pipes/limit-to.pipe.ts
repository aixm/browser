import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo'
})
export class LimitToPipe implements PipeTransform {

  transform(value: string | undefined, args: number): string | undefined {
    const limit: number = args ? args : 10;
    const trail: string = '...';

    if (!value){
      return value;
    }

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

}
