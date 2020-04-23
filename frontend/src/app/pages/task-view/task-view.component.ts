import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';
import { AuthService } from 'src/app/auth.service';
import {User} from 'src/app/models/user.model';
import{UserService} from 'src/app/user.service';
import { WebSocketService } from 'src/app/web-socket.service';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: List[];
  tasks: Task[];
  user: User;
  users: User[];
  
  selectedListId: string;

  constructor(private webSocketService:WebSocketService,private authService:AuthService,private taskService: TaskService, private route: ActivatedRoute, private router: Router,private userService: UserService) { }

  ngOnInit() {
    
    this.webSocketService.listen('event').subscribe((data)=>{
console.log(data)
    })
    

    this.route.params.subscribe(
      (params: Params) => {
        if (params.listId) {
          this.selectedListId = params.listId;
          this.taskService.getTasks(params.listId).subscribe((tasks: Task[]) => {
            this.tasks = tasks;
          })
        } else {
          this.tasks = undefined;
        }
      }
    )

    this.taskService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;

    })
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;

  
  })
}


  onTaskClick(task: Task) {
    // we want to set the task to completed
    this.taskService.complete(task).subscribe(() => {
      // the task has been set to completed successfully
      console.log("Completed successully!");
      task.completed = !task.completed;
    })
  }

  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
      this.router.navigate(['/lists']);
      console.log(res);
    })
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== id);
      console.log(res);
    })
  }
  logout() {
    
    this.userService.logout(localStorage.getItem('user-id')).subscribe((res: any) => {
      this.removeSession();
      this.router.navigate(['/login']);
    });
    
   
    
    
  }
  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }
  getIsAdmin(){
    return localStorage.getItem('isAdmin') == 'true';
  }
  getUser(){
    return localStorage.getItem('userName') ;
    
  }

}
 
 


