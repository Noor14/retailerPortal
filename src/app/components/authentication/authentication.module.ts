import { DeactivateGuard } from './../../services/deactivate.guard';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthenticationComponent } from './authentication.component';
import { LoginService } from './login/login.service';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { UpdatepasswordComponent } from './updatepassword/updatepassword.component';
import { EULAComponent } from './eula/eula.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { SupportComponent } from './support/support.component';
import { SupportService } from './support/support.service';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [
    LoginComponent,
    AuthenticationComponent,
    ForgetpasswordComponent,
    UpdatepasswordComponent,
    EULAComponent,
    SupportComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgxCaptchaModule,
    SharedModule
  ],
  providers: [
    LoginService,
    SupportService,
    DeactivateGuard]
})
export class AuthenticationModule { }
