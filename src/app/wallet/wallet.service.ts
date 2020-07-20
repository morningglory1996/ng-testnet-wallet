import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(private http: HttpClient) {}

  getAddressDetail(): Observable<any> {
    const userId = JSON.parse(localStorage.getItem('app-meta')).userId;
    return this.http.get('/api/v1/wallet/' + userId);
  }

  pushTransaction(sendingData): Observable<any> {
    const userId = JSON.parse(localStorage.getItem('app-meta')).userId;
    return this.http.post('/api/v1/wallet/' + userId, sendingData);
  }
}
