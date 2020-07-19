import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import * as moment from 'moment';
import { Router } from '@angular/router';

const jwt = new JwtHelperService();

class DecodedToken {
  userId: string = "";
  userName: string = "";
  exp: number = 0;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private decodedToken;


  constructor(
    private http: HttpClient,
    private router: Router
    ) { 
    this.decodedToken = JSON.parse(localStorage.getItem('app-meta')) || new DecodedToken();
  }


  getToken() {
    return localStorage.getItem('app-auth');
  }

  isAuthenticated() {
    return moment().isBefore(moment.unix(this.decodedToken.exp));
  }

  register(userData): Observable<any> {
    return this.http.post('/api/v1/user/register', userData);
  }

  login(userData): Observable<any> {
    return this.http.post('/api/v1/user/login', userData).pipe(map(
      (data: {token: string, userId: string})=> {
        const token = data.token;
        const userId = data.userId
        this.decodedToken = jwt.decodeToken(token);
        localStorage.setItem('app-auth', token);
        localStorage.setItem('app-meta', JSON.stringify(this.decodedToken));
        return { token, userId };
      }
    ));
  }

  logout() {
    localStorage.removeItem('app-auth');
    localStorage.removeItem('app-meta');
    this.decodedToken = new DecodedToken();
    this.router.navigate(['/']);
  }
}
