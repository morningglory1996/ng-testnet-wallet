import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(userData): Observable<any> {
    return this.http.post('/api/v1/user/register', userData);
  }

  login(userData): Observable<any> {
    return this.http.post('/api/v1/user/login', userData);
  }
}
