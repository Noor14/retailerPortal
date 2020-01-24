import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationComponent } from './authentication.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { LoginService } from './login/login.service';
import { ForgetpassowrdComponent } from './forgetpassowrd/forgetpassowrd.component';
import { UpdatepassowrdComponent } from './updatepassowrd/updatepassowrd.component';


@NgModule({
  declarations: [RegistrationComponent, LoginComponent, AuthenticationComponent, ForgetpassowrdComponent, UpdatepassowrdComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AuthenticationRoutingModule,
    FormsModule
  ],
  providers:[LoginService]
})
export class AuthenticationModule { }
