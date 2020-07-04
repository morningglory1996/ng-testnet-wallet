import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userId;

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.getUserId();
  }

  logout() {
    this.auth.logout();
  }

  getUserId() {
    this.userId = JSON.parse(localStorage.getItem('app-meta')).userId;
  }
}
