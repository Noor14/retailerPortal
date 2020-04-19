import { DeactivateGuard } from './../../services/deactivate.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthenticationComponent } from './authentication.component';
import { UpdatepasswordComponent } from './updatepassword/updatepassword.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { EULAComponent } from './eula/eula.component';
import { SupportComponent } from './support/support.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
    { path: 'login', component: LoginComponent },
    { path: 'eula', component: EULAComponent },
    { path: 'registration', component: RegistrationComponent, canDeactivate: [DeactivateGuard] },
    { path: 'forgetPassword', component: ForgetpasswordComponent, canDeactivate: [DeactivateGuard] },
    { path: 'updatePassword', component: UpdatepasswordComponent, canDeactivate: [DeactivateGuard] },
    { path: 'support', component: SupportComponent, canDeactivate: [DeactivateGuard] },
    { path: '**', redirectTo: 'login' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
