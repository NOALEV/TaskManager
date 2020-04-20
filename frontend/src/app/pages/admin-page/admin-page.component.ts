import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';
import { AuthService } from 'src/app/auth.service';
import{UserService} from 'src/app/user.service';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  users: User[];
 
  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router,private authService: AuthService) { }


  ngOnInit(): void {
    this.userService.getUser().subscribe((users: User[]) => {
      this.users = users;
      console.log(users);
  })
}
}
 
  
  

