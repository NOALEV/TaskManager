import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';
import { AuthService } from 'src/app/auth.service';
import{UserService} from 'src/app/user.service';

import { WebSocketService } from 'src/app/web-socket.service';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  users: User[];
  selectedUserId: string;
  isAdmin;
  NumOfConnected: string[] ;
  aa:[]
  constructor(private webSocketService:WebSocketService,private userService: UserService, private route: ActivatedRoute, private router: Router,private authService: AuthService) { }


  ngOnInit(): void {
    if(this.getIsAdmin()=='false'){
    this.router.navigate(['/lists']);
    }
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
     console.log(users)
  })
  //numofuser
  this.getUsersCount();
    this.webSocketService.listen('event').subscribe((data:[])=>{
      console.log(data);
    this.NumOfConnected=data;
   
    })
  
    this.route.params.subscribe(
      (params: Params) => {
        if (params.userId) {
          this.selectedUserId = params.userId;
        
        }
      }
    )
 
    
  
  
}

getIsAdmin(){
  return localStorage.getItem('isAdmin') ;
}
IsNotAdmin(){
return localStorage.getItem('isAdmin');

}
getUsersCount()
  {
    this.userService.getUsersCount().subscribe((data:[])=>{
      console.log(data);
    this.NumOfConnected=data;
    });
  }








onDeleteUserClick(userId : string){
  
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


sendMessage(message: string) {
  
  this.userService.sendMessage(message).subscribe(() => {
    
  })
}
}
