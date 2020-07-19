import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/shared/auth.service' ;

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  userId: string;

  constructor(
    public authService: AuthService,
    ) { }

  ngOnInit(): void {
    if(localStorage.getItem('app-meta')) {
      const id = JSON.parse(localStorage.getItem('app-meta')).userId;
      this.userId = id;
    }
  }


}
