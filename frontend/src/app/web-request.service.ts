import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
  }

  get(uri: string, params?) {
    return this.http.get(`${this.ROOT_URL}/${uri}`, { params: {...params} });
  }

  post(uri: string, payload: Object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
  }

  patch(uri: string, payload: Object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload);
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/users/login`, {
      email,
      password
    }, {
        observe: 'response'
      });
  }
  signup(userName: string, email: string, password: string, city: string, lat: number, lng: number) {
    return this.http.post(`${this.ROOT_URL}/users`, {
      userName,
      email,
      password,
      city,
      lat,
      lng
    }, {
        observe: 'response'
      });
  }



}
