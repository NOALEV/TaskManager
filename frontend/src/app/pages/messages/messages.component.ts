import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/web-socket.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  AdminMessage: any ;
  constructor(private webSocketService:WebSocketService) { }

  ngOnInit(): void {

    this.webSocketService.listen('message').subscribe((data:any)=>{
      this.AdminMessage=data;
    })

}
}
