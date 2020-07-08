import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/token.intercepter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

import { AuthService } from './shared/auth.service';
import { AuthGuard } from './shared/auth.guard';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent}
];


@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    [RouterModule.forChild(routes)],
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class AuthModule { }
