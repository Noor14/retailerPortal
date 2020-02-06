import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthenticationComponent } from './authentication.component';
import { HttpClientModule } from "@angular/common/http";
import { LoginService } from './login/login.service';
import { RegistrationComponent } from './registration/registration.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { UpdatepasswordComponent } from './updatepassword/updatepassword.component';
import { EULAComponent } from './eula/eula.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { SupportComponent } from './support/support.component';
import { SupportService } from './support/support.service';
@NgModule({
  declarations: [
    RegistrationComponent,
    LoginComponent,
    AuthenticationComponent, 
    ForgetpasswordComponent, 
    UpdatepasswordComponent, 
    EULAComponent, SupportComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    TextMaskModule
  ],
  providers:[LoginService,SupportService]
})
export class AuthenticationModule { }
