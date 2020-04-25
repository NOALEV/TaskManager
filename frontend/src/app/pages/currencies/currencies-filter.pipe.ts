
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
    const matches = [];
    currencies.forEach(currency => {
      const currenciesStr = currency.country.toLowerCase() + currency.currency.toLowerCase() + currency.symbol;
      const splitedStr = currenciesStr.split(/(?:,| )+/);
      const ac = new AhoCorasick(splitedStr);
      const result = ac.search(searchTerm);

      if (result.length !== 0) {
        matches.push(currency._id);
      }
    });

    if (matches.length !== 0) {
      return currencies.filter(currency => matches.includes(currency._id));
    } else {
      return currencies;
    }

  }
}
