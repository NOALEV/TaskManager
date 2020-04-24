import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  http: any;
  webService: any;
  constructor(private webReqService: WebRequestService,private route: ActivatedRoute, private router: Router,private authService: AuthService) { }
  getMessages() {
    return this.webReqService.get('messages');
  }
  deleteMessage(id: string) {
    return this.webReqService.delete(`messages/${id}`);
  }
  sendMessage(title:string)
  {
    return this.webReqService.post(`message`, {title})
  }
  updateMessage(id: string, title: string) {
    // We want to send a web request to update a message
    return this.webReqService.patch(`messages/${id}`, { title });

  }


}
