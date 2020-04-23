import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/web-socket.service';
import{UserService} from 'src/app/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { TaskService } from 'src/app/task.service';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  NumOfConnected:[];
  constructor(private webSocketService:WebSocketService,private authService:AuthService,private taskService: TaskService, private route: ActivatedRoute, private router: Router,private userService: UserService) { }

  ngOnInit(): void {

    
  }
  getUsersCount()
  {
    this.userService.getUsersCount().subscribe((data:[])=>{
      console.log(data);
    this.NumOfConnected=data;
    });
  }
  getIsAdmin(){
    return localStorage.getItem('isAdmin') == 'true';
  }

}
