import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationComponent } from './authentication.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { ForgetpassowrdComponent } from './forgetpassowrd/forgetpassowrd.component';
import { UpdatepassowrdComponent } from './updatepassowrd/updatepassowrd.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { EULAComponent } from './eula/eula.component';
@NgModule({
  declarations: [RegistrationComponent, LoginComponent, AuthenticationComponent, ForgetpassowrdComponent, UpdatepassowrdComponent, EULAComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AuthenticationRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    TextMaskModule
  ],
  providers:[LoginService]
})
export class AuthenticationModule { }
