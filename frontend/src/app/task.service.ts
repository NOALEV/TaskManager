import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from './models/task.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpResponse } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  http: any;
  webService: any;

  constructor(private webReqService: WebRequestService,private route: ActivatedRoute, private router: Router,private authService: AuthService) { }


  getLists() {
    return this.webReqService.get('lists');
  }

  createList(title: string ,category: string) {
    // We want to send a web request to create a list
    return this.webReqService.post('lists', { title,category });
  }

  updateList(id: string, title: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`lists/${id}`, { title });
  }

  updateTask(listId: string, taskId: string, title: string,time:string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, { title,time });
  }

  deleteTask(listId: string, taskId: string) {
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  deleteList(id: string) {
    return this.webReqService.delete(`lists/${id}`);
  }

  getTasks(listId: string) {
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  createTask(title: string, time:string, listId: string) {
    // We want to send a web request to create a task
    return this.webReqService.post(`lists/${listId}/tasks`, { title,time });
  }

  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }
  
  getNewAccessToken() {
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId()
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token'));
      })
    )
  }
  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }
 

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken)
  }
}
  