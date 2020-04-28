import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';
import { AuthService } from 'src/app/auth.service';
import {User} from 'src/app/models/user.model';
import {UserService} from 'src/app/user.service';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: List[];
  tasks: Task[];
  user: User;
  brunchesLocations: Array<{ lat: number, lng: number }>;
  tasksSummary: Array<{ count: number, title: string }>;
  // google maps zoom level
  zoom = 8;

  // initial center position for the map
  center = {lat: 32.014610, lng: 34.806500};

  selectedListId: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.listId) {
          this.selectedListId = params.listId;
          this.taskService.getTasks(params.listId).subscribe((tasks: Task[]) => {
            this.tasks = tasks;
          });
        } else {
          this.tasks = undefined;
        }
      }
    );

    this.userService.getUsers().subscribe((users: User[]) => {
      const brunchesLocations = users.map(user => ({ lat: user.lat, lng: user.lng }));
      this.brunchesLocations = brunchesLocations;
    });

    this.taskService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
    });


    this.taskService.getTasksSummary().subscribe((tasks: Array<{ count: number, title: string }>) => {
      console.log('taskssummary', tasks);
      this.tasksSummary = tasks;
    });
  }

  onTaskClick(task: Task) {
    // we want to set the task to completed
    this.taskService.complete(task).subscribe(() => {
      // the task has been set to completed successfully
      console.log('Completed successully!');
      task.completed = !task.completed;
    });
  }

  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
      this.router.navigate(['/lists']);
      console.log(res);
    });
  }


  onTasksFilter(freeText: string, taskTimeInput: string, onlyPending: boolean) {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskService.getTasks(params.listId, { freeText, taskTimeInput, onlyPending }).subscribe((tasks: Task[]) => {
          this.tasks = tasks;
        });
      }
    );
  }

  onListsFilter(freeText: string, taskTimeInput: string, category: string) {
    this.taskService.getLists({ freeText, taskTimeInput, category }).subscribe((lists: List[]) => {
      this.lists = lists;
    });
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== id);
      console.log(res);
    });
  }
  logout() {
    this.removeSession();

    this.router.navigate(['/login']);
  }
  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }
  getIsAdmin() {
    return localStorage.getItem('isAdmin') == 'true';
  }
  getUser() {
    return localStorage.getItem('userName') ;

  }

}




