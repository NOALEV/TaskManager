import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})

export class SignupPageComponent implements OnInit {

  citiesLocation: { [key: string]: { lat: number, lng: number } } = {
    Jerusalem: { lat: 31.775680, lng: 35.215624 },
    'Tel-aviv': { lat: 32.442, lng: 34.45 },
    'Bnei-Brak': { lat: 32.1030431, lng: 34.8278683 },
    Hifa: { lat: 32.801046, lng: 34.987934 },
  };
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  onSignupButtonClicked(userName: string, email: string, password: string, city: string) {
    const { lat, lng } = this.citiesLocation[city];
    this.authService.signup(userName, email, password, city, lat, lng).subscribe((res: HttpResponse<any>) => {
      console.log(res);
      this.router.navigate(['/lists']);
    });
  }
}
