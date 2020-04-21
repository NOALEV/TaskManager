import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from './models/task.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpResponse } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http: any;
  webService: any;
  constructor(private webReqService: WebRequestService,private route: ActivatedRoute, private router: Router,private authService: AuthService) { }
  getUsers() {
    return this.webReqService.get('users');
  }
  deleteUser(id: string) {
    return this.webReqService.delete(`users/${id}`);
  }
  updateUser(id: string, city: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`users/${id}`, { city });

  }
 
}
