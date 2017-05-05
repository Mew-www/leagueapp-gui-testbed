import { Pipe, PipeTransform } from '@angular/core';
import {GameType} from "../enums/game-type";

@Pipe({
  name: 'stringifyGameType'
})
export class StringifyGameTypePipe implements PipeTransform {

  transform(value: GameType): string {
    switch (value) {
      case GameType.SOLO_QUEUE:
        return "Ranked Solo/Duo";
      case GameType.FLEX_QUEUE:
        return "Ranked Flex";
      case GameType.UNKNOWN_UNDEFINED:
        return "Ranked(?) Undefined Game Type";
      default:
        return "Ranked(?) Non-stringified Game Type";
    }
  }

}
