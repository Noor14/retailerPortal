import { UserGuard } from './../../services/auth.guard';
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
    {path: 'dashboard', component: DashboardComponent},
    {
    path: 'profile',
    canLoad: [UserGuard],
    component: ProfileComponent,
    data: {
      roles: [
        '3',
      ]
    }, canDeactivate: [DeactivateGuard]},
    {
      path: 'support',
      canLoad: [UserGuard],
      component: SupportgridComponent,
      data: {
        roles: [
          '11',
        ]
      }
   },
    {
      path: 'support/:id',
      canLoad: [UserGuard],
      component: SupportscreenComponent,
      data: {
        roles: [
          '12',
        ]
      },
      canDeactivate: [DeactivateGuard] },
    {
    path: 'payment',
    canLoad: [UserGuard],
    component: PaymentComponent,
    data: {
      roles: [
        '9',
      ]
    },
    canDeactivate: [DeactivateGuard]},
    {
    path: 'payment/:id/:viewType',
    canLoad: [UserGuard],
    component: PaymentComponent,
    data: {
      roles: [
        '9',
      ]
    }, canDeactivate: [DeactivateGuard] },
    {
      path: 'paymentView/:id/:viewType',
      canLoad: [UserGuard],
      component: PaymentViewComponent,
      data: {
        roles: [
          '10',
        ]
      } },
    {
      path: 'order',
      canLoad: [UserGuard],
      component: OrderComponent,
      data: {
        roles: [
          '4',
        ]
      },
      canDeactivate: [DeactivateGuard] },
    {
    path: 'order/:id',
    canLoad: [UserGuard],
    component: OrderComponent,
    data: {
      roles: [
        '4',
      ]
    },
    canDeactivate: [DeactivateGuard] },
    {
    path: 'orderView/:id',
    canLoad: [UserGuard],
    component: OrderViewComponent,
    data: {
      roles: [
        '6',
      ]
    }},
    {
      path: 'network',
      canLoad: [UserGuard],
      component: NetworkComponent,
      data: {
        roles: [
          '7',
        ]
      }},
    { path: '**', redirectTo: 'dashboard' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
