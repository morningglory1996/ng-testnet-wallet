import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  errors = [];

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  register(registerForm) {
    this.authService.register(registerForm.value).subscribe(
      (result) => {
        console.log(result);
        this.router.navigate(['/login']);
      },
      (err: HttpErrorResponse) => {
        this.errors = err.error.errors;
        console.log(err);
      }
    )
  }
}
