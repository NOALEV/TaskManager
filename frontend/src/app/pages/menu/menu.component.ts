import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor( private route: ActivatedRoute, private router: Router,) { }

  ngOnInit(): void {
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
}
