import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterColDev'
})
export class FilterItems implements PipeTransform {

  transform(items: any[], type: string): any[] {
    ////console.log(items)
    ////console.log(type)
    if (!items) {
      return [];
    }

    return items.filter(it => {
      return it.coldel_type.toString().includes(type);
    });
  }

}

