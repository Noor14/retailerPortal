import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthenticationComponent } from './authentication.component';
import { UpdatepassowrdComponent } from './updatepassowrd/updatepassowrd.component';
import { ForgetpassowrdComponent } from './forgetpassowrd/forgetpassowrd.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    // pathMatch: 'full',
    children: [
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'forgetPassword', component: ForgetpassowrdComponent },
    { path: 'updatePassword', component: UpdatepassowrdComponent },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
