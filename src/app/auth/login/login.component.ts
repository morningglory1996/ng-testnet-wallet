import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errors = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }


  login(loginForm) {
    console.log(loginForm.value);
    this.authService.login(loginForm.value).subscribe(
      (result) => {
        console.log(result.token);
        console.log(result.foundUser);
        this.router.navigate(['/wallet/' + result.foundUser._id]);
      },
      (err: HttpErrorResponse) => {
        this.errors = err.error.errors;
        console.log(err);
      }
    )
  }
}
