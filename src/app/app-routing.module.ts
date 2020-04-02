import { AuthGuard } from './services/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'user', loadChildren: () => import('./components/user/user.module').then(m => m.UserModule), canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: '', loadChildren: () => import('./components/authentication/authentication.module').then(m => m.AuthenticationModule)}

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
