import { OrderViewComponent } from './order-view/order-view.component';
import { DeactivateGuard } from './../../services/deactivate.guard';
import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment/payment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';
import { SupportgridComponent } from './support/supportgrid/supportgrid.component';
import { SupportscreenComponent } from './support/supportscreen/supportscreen.component';
import { NetworkComponent } from './network/network.component';
import { PaymentViewComponent } from './payment-view/payment-view.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent, canDeactivate: [DeactivateGuard] },
    { path: 'support', component: SupportgridComponent },
    { path: 'support/:id', component: SupportscreenComponent, canDeactivate: [DeactivateGuard] },
    { path: 'payment', component: PaymentComponent, canDeactivate: [DeactivateGuard]},
    { path: 'payment/:id/:viewType', component: PaymentComponent, canDeactivate: [DeactivateGuard] },
    { path: 'paymentView/:id/:viewType', component: PaymentViewComponent },
    { path: 'order', component: OrderComponent, canDeactivate: [DeactivateGuard] },
    { path: 'order/:id', component: OrderComponent, canDeactivate: [DeactivateGuard] },
    { path: 'orderView/:id', component: OrderViewComponent },
    { path: 'network', component: NetworkComponent },
    { path: '**', redirectTo: 'dashboard' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
