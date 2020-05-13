import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distinctwords'
})
export class DistinctwordsPipe implements PipeTransform {

  transform(numDistinctWordsObj: any): string {
    return "NUM DISTINCT WORDS IN MESSAGES: " + numDistinctWordsObj.numDistinctWords;
  }
}
