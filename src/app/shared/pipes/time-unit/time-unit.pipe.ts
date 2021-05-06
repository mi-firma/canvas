import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeUnit'
})
export class TimeUnitPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value.toUpperCase() === 'ANIO') return 'Año';
    return value;
  }

}
