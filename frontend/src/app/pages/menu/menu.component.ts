import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {UserService} from 'src/app/user.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor( private route: ActivatedRoute, private router: Router,private userService: UserService) { }

  ngOnInit(): void {
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
  getIsAdmin() {
    return localStorage.getItem('isAdmin') == 'true';
  }
}
