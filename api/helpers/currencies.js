const puppeteer = require('puppeteer');
const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/List_of_circulating_currencies';
const {Currency} = require('../db/models/currency.model');
const Currencies = {
    getData(){
        rp(url)
            .then(data=>{
                $('table.wikitable tbody tr',data).each((index ,element)=>{
                    let currencyArray = [];
                    $('td',element).each((index , item)=>{
                        currencyArray.push($(item).text())
                    });
                    let currency = new Currency({
                        country : currencyArray[0],
                        currency : currencyArray[1],
                        symbol : currencyArray[2],
                        isoCode : currencyArray[3],
                    })
                    currency.save()
                    .then(currencyObject=>{
                        console.log(currencyObject);
                    })
                    .catch(err=>{
                        console.dir(err);
                    })
                })
            });
    }
    
}
module.exports = Currencies ;