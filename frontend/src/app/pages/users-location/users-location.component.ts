import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users-location',
  templateUrl: './users-location.component.html',
  styleUrls: ['./users-location.component.css']
})
export class UsersLocationComponent implements OnInit {
  user: User;

  brunchesLocations: Array<{ lat: number, lng: number }>;
    // google maps zoom level
    zoom = 8;

    // initial center position for the map
    center = {lat: 32.014610, lng: 34.806500};
  

  constructor(private route: ActivatedRoute, private router: Router,  private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      const brunchesLocations = users.map(user => ({ lat: user.lat, lng: user.lng }));
      this.brunchesLocations = brunchesLocations;
    });
  }

}
