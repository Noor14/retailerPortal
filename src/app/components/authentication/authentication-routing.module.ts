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
    // pathMatch: 'full',
    children: [
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'forgetPassword', component: ForgetpasswordComponent },
    { path: 'updatePassword', component: UpdatepasswordComponent },
    { path: 'eula', component: EULAComponent },
    { path: 'support', component: SupportComponent },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
