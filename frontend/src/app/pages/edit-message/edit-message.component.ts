import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MessagesService } from 'src/app/messages.service';

@Component({
  selector: 'app-edit-message',
  templateUrl: './edit-message.component.html',
  styleUrls: ['./edit-message.component.css']
})
export class EditMessageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private messagesService: MessagesService, private router: Router) { }
  messageId: string;
  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.messageId = params.messageId;
        console.log(this.messageId);
       
      }
    )



  }

  updateMessage(title:string)
  {
    this.messagesService.updateMessage(this.messageId, title).subscribe(() => {
      this.router.navigate(['/messages', this.messageId]);
     
    });
  }

}

