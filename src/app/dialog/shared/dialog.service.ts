import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  scanSuccess: Subject<string>;

  constructor() {}

  scanStart() {
    this.scanSuccess = new Subject<string>();
  }

  scanEnd() {
    this.scanSuccess.complete();
  }
}
