import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emphasiseThousands'
})
export class EmphasiseThousandsPipe implements PipeTransform {

  transform(value: any): string {
    return value
      .toString()
      .split("")
      .reverse()
      .map((s,i) => {
        if (i%3===0 && i!=(value.toString().length-1)) {
          return s + " ";
        }
        return s;
      })
      .reverse()
      .join("");
  }

}
