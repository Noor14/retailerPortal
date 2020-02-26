import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment/payment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';
import { SupportgridComponent } from './support/supportgrid/supportgrid.component';
import { SupportscreenComponent } from './support/supportscreen/supportscreen.component';
import { NetworkComponent } from './network/network.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    // pathMatch: 'full',
    children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'support', component: SupportgridComponent },
    { path: 'support/:id', component: SupportscreenComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'network', component: NetworkComponent },
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
