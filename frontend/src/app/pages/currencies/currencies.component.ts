import { Component, OnInit } from '@angular/core';
import { WebRequestService } from '../../web-request.service';
@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {

  constructor(private webService: WebRequestService) { }
  public list:any = [];
  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.webService.get('currencies').subscribe(res=>{
      this.list = res;
    })
  }

}
