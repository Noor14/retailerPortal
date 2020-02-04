import { PaymentComponent } from './../../shared/payment/payment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    // pathMatch: 'full',
    children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'profile', component: ProfileComponent },
    //{ path: 'editPayment/:id', component: PaymentComponent },
    // { path: 'paymentDetail/:id', component: RemindersComponent },
    // { path: 'schedulers', component: SchedulersComponent },
    // { path: 'settings', component: SettingsComponent },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
