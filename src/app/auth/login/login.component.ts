import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { WebSocketService } from '../../websocket/web-socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  hide = true;
  errors = [];

  constructor(
    private authService: AuthService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }

  emailErrorMessage() {
    return this.email.hasError('required')
      ? 'メールアドレスを入力してください'
      : '';
  }

  passwordErrorMessage() {
    return this.password.hasError('required')
      ? 'パスワードを入力してください'
      : '';
  }

  login(loginForm) {
    if (this.loginForm.valid) {
      this.authService.login(loginForm.value).subscribe(
        (result) => {
          this.webSocketService.connectWs(result.decodedToken.address);
          this.router.navigate(['/wallet/' + result.decodedToken.userId]);
        },
        (err: HttpErrorResponse) => {
          this.errors = err.error.errors;
        }
      );
    }
  }
}
