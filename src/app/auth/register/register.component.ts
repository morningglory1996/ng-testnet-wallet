import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  userName = new FormControl('', [
    Validators.required,
    Validators.maxLength(15),
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);
  hide = true;
  errors = [];

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      userName: this.userName,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });
  }

  userNameErrorMessage() {
    if (this.userName.hasError('required')) {
      return 'ユーザー名を入力してください';
    }

    return this.userName.hasError('maxlength')
      ? 'ユーザー名は15文字までです'
      : '';
  }

  emailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'メールアドレスを入力してください';
    }

    return this.email.hasError('email') ? '無効なメールアドレスです' : '';
  }

  passwordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'パスワードを入力してください';
    }

    return this.password.hasError('minlength')
      ? 'パスワードは6文字以上で入力してください'
      : '';
  }

  confirmErrorMessage() {
    return this.confirmPassword.hasError('required')
      ? '確認用パスワードを入力してください'
      : '';
  }

  register(registerForm) {
    if (this.registerForm.valid) {
      this.authService.register(registerForm.value).subscribe(
        (result) => {
          this.toastr.success(
            'ログインしてください',
            'アカウントの作成に成功しました'
          );
          this.router.navigate(['/login']);
        },
        (err: HttpErrorResponse) => {
          this.errors = err.error.errors;
        }
      );
    }
  }
}
