
import { PipeTransform, Pipe, OnInit } from '@angular/core';
import { Currencies } from 'src/app/models/currencies.model';
declare var require: any;

@Pipe({
  name: 'CurrenciesFilter'
})
export class CurrenciesFilterPipe implements PipeTransform {
  transform(currencies: Currencies[], searchTerm: string): Currencies[] {
    const AhoCorasick = require('ahocorasick');
    if (!currencies || !searchTerm) {
       return currencies;
    }
    searchTerm = searchTerm.toLowerCase();
    console.log(searchTerm);
    const matches = [];
    currencies.forEach(currency => {
      let currencieArr:string []=['Apple', 'Orange', 'Banana'];
      currency.country?currencieArr[0]=currency.country.toLowerCase():currencieArr[0]='';
      currency.symbol?currencieArr[1]=currency.symbol.toLowerCase():currencieArr[1]='';
      currency.currency?currencieArr[2]=currency.currency:currencieArr[2]='';
      const ac = new AhoCorasick(currencieArr);
      const result = ac.search(searchTerm);
     
      if (result.length !== 0) {
      if(matches.indexOf(currency._id)<0){
        matches.push(currency._id);
      }
      }
    });
    console.log(matches.length);
    console.log(matches);
    if (matches.length !== 0) {
      return currencies.filter(currency => matches.includes(currency._id));
    } else {
      return currencies;
    }

  }
}
