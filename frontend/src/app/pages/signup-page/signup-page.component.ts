import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})

export class SignupPageComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  citiesLocation: { [key: string]: { lat: number, lng: number } } = {
    Jerusalem: { lat: 31.775680, lng: 35.215624 },
    'Tel-aviv': { lat: 32.442, lng: 34.45 },
    'Bnei-Brak': { lat: 32.1030431, lng: 34.8278683 },
    Hifa: { lat: 32.801046, lng: 34.987934 },
  };
  constructor(private authService: AuthService, private router: Router,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nameInput: ['', Validators.required,Validators.minLength(3)],
      cityInput : ['', Validators.required],
      emailInput: ['', [Validators.required, Validators.email]],
      pwInput: ['', [Validators.required, Validators.minLength(8)]],
  }, {
  });

  }




  get f() { return this.registerForm.controls; }


  onSignupButtonClicked(userName: string, email: string, password: string, city: string) {
   
    this.submitted =true;
    if (this.registerForm.invalid) {
      return;
  }
    const { lat, lng } = this.citiesLocation[city];
    this.authService.signup(userName, email, password, city, lat, lng).subscribe((res: HttpResponse<any>) => {
      console.log(res);
      this.router.navigate(['/lists']);
    });
  }
  onReset() {
    this.submitted = false;
    this.registerForm.reset();
}
}
