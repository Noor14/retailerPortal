
import { RoleAuthorizationService } from './../../services/role-authorization.service';
import { WebsocketService } from './../../services/websocket.service';
import { DeactivateGuard } from './../../services/deactivate.guard';
import { TreeTableModule } from 'primeng/treetable';
import { SharedModule } from './../../shared/shared.module';
import { UserService } from './user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile/profile.service';
import { TextMaskModule } from 'angular2-text-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { SupportgridComponent } from './support/supportgrid/supportgrid.component';
import { SupportscreenComponent } from './support/supportscreen/supportscreen.component';
import { DashboardService } from './dashboard/dashboard.service';
import { SupportService } from './support/support.service';
import { NetworkComponent } from './network/network.component';
import { NetworkService } from './network/network.service';
import { PaymentViewComponent } from './payment-view/payment-view.component';
import { PaymentViewService } from './payment-view/payment-view.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderService } from './order/order.service';
import { OrderComponent } from './order/order.component';
import { OrderDescriptionComponent } from './order-description/order-description.component';
import { PaymentCreationComponent } from './payment-creation/payment-creation.component';
import { UnpaidInvoiceViewComponent } from './unpaid-invoice-view/unpaid-invoice-view.component';
import { GeneralViewComponent } from './general-view/general-view.component';
import { CreateMPINComponent } from './accounts/create-mpin/create-mpin.component';
import { ChangeMPINComponent } from './accounts/change-mpin/change-mpin.component';
import { LinkedAccountsComponent } from './accounts/linked-accounts/linked-accounts.component';
import { AddAccountComponent } from './accounts/add-account/add-account.component';
import { AccountService } from './accounts/account.service';

@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    ProfileComponent,
    SupportgridComponent,
    SupportscreenComponent,
    NetworkComponent,
    PaymentViewComponent,
    OrderDetailComponent,
    OrderComponent,
    GeneralViewComponent,
    OrderDescriptionComponent,
    PaymentCreationComponent,
    UnpaidInvoiceViewComponent,
    GeneralViewComponent,
    AddAccountComponent,
    LinkedAccountsComponent,
    ChangeMPINComponent,
    CreateMPINComponent
    ],
  entryComponents: [
    AddAccountComponent,
    LinkedAccountsComponent,
    ChangeMPINComponent,
    CreateMPINComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    TextMaskModule,
    ReactiveFormsModule,
    TreeTableModule,
    SharedModule
  ],
  providers: [
    RoleAuthorizationService,
    ProfileService,
    AccountService,
    SupportService,
    DashboardService,
    UserService,
    NetworkService,
    PaymentViewService,
    OrderService,
    DeactivateGuard,
    WebsocketService
  ]

})
export class UserModule { }
