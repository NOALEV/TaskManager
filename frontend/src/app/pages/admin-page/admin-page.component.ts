import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';

import { WebSocketService } from 'src/app/web-socket.service';
import { MessagesService } from 'src/app/messages.service';
import { Messages } from 'src/app/models/messages.model';
import { UsersByCities } from 'src/app/models/usersByCities.model';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  users: User[];
  usersByCities: UsersByCities[];
  listCategoriesByUsers: any[];
  selectedUserId: string;
  selectedMessageId:string;
  isAdmin;
  NumOfConnected: string[];
  messages: Messages[];
  title: string;
  selectedTab='users';
  numDistinctWordsObj: any;
  
  constructor(private messagesService: MessagesService, private webSocketService: WebSocketService, private userService: UserService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if (this.getIsAdmin() == 'false') {
      this.router.navigate(['/lists']);
    }
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      console.log(users)
    })

    this.userService.getUsersByCities().subscribe((usersByCities: UsersByCities[]) => {
      this.usersByCities = usersByCities;
      console.log(usersByCities)
    })

    this.userService.getListCategoriesByUsers().subscribe((listCategoriesByUsers: any[]) => {
      this.listCategoriesByUsers = listCategoriesByUsers;
      console.log(listCategoriesByUsers);
    })
  
    this.messagesService.getMessages().subscribe((messages:Messages[])=>{
      this.messages=messages;
    })
    //numofuser
    this.getUsersCount();
    this.webSocketService.listen('event').subscribe((data: []) => {
      console.log(data);
      this.NumOfConnected = data;

    })

    this.route.params.subscribe(
      (params: Params) => {
        if (params.userId) {
          this.selectedUserId = params.userId;

        }
      }
    )
    this.route.params.subscribe(
      (params: Params) => {
        if (params.messageId) {
          this.selectedMessageId = params.messageId;

        }
      }
    )


    this.webSocketService.listen('message').subscribe((data: any) => {
      this.getMessages();
    });

    this.getMessages();
    this.getNumDistinctWordsInMessages();
  }
  getMessages() {
    this.messagesService.getMessages().subscribe((messages: Messages[]) => {
      this.messages = messages;
    });
  }

  getNumDistinctWordsInMessages() {
    this.messagesService.getNumDistinctWordsInMessages().subscribe((numDistinctWordsObj: any) => {
      this.numDistinctWordsObj = numDistinctWordsObj;
    });
  }


  getIsAdmin() {
    return localStorage.getItem('isAdmin');
  }
  IsNotAdmin() {
    return localStorage.getItem('isAdmin');

  }
  getUsersCount() {
    this.userService.getUsersCount().subscribe((data: []) => {
      console.log(data);
      this.NumOfConnected = data;
    });
  }

  selectTab(name:string){
    this.selectedTab=name;
  }






  onDeleteUserClick(userId: string) {

    this.userService.deleteUser(userId).subscribe((res: any) => {

      this.userService.getUsers().subscribe((users: User[]) => {
        this.users = users;

      })

    },
      error => {
        this.userService.getUsers().subscribe((users: User[]) => {
          this.users = users;
        })
      }
    )

  }
  onDeleteMessageClick(messageId: string) {

    this.messagesService.deleteMessage(messageId).subscribe((res: any) => {

      this.messagesService.getMessages().subscribe((messages: Messages[]) => {
        this.messages = messages;

      })

    },
      error => {
        this.messagesService.getMessages().subscribe((messages: Messages[]) => {
          this.messages = messages;
        })
      }
    )
  }

  sendMessage() {
    this.messagesService.sendMessage(this.title).subscribe(() => {
      this.messagesService.getMessages().subscribe((messages: Messages[]) => {
        this.messages = messages;
        this.title='';
      })
    })
  }
}
