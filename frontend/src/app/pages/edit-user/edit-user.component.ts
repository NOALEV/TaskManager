import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { UserService } from 'src/app/user.service';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }
  userId: string;
  ngOnInit() {
    
    this.route.params.subscribe(
      (params: Params) => {
        this.userId = params.userId;
        console.log(this.userId);
       
      }
    )
  }

  updateUser(userName: string) {
    this.userService.updateUser(this.userId, userName).subscribe(() => {
      this.router.navigate(['/users', this.userId]);
     
      
    })
  }

}
