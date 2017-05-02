import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'queuetypeDescription'
})
export class QueuetypeDescriptionPipe implements PipeTransform {

  transform(queuetype: string): string {
    switch (queuetype) {
      case "RankedSolo5x5":
        return "Solo/Duo queue";
      case "RankedFlexSR":
        return "Flex queue";
      default:
        return queuetype;
    }
  }

}
