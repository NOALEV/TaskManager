import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/web-socket.service';
import { MessagesService } from 'src/app/messages.service';
import { Messages } from 'src/app/models/messages.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  AdminMessage: any;
  messages: Messages[];
  constructor(private webSocketService: WebSocketService, private messagesService: MessagesService) { }

  ngOnInit(): void {

    this.webSocketService.listen('message').subscribe((data: any) => {
      this.getMessages();
    });
    this.getMessages();
  }
  getMessages() {
    this.messagesService.getMessages().subscribe((messages: Messages[]) => {
      this.messages = messages;
    });


  }
  
}
