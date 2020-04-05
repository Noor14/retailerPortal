import { TreeTableModule } from 'primeng/treetable';
import { SharedModule } from './../../shared/shared.module';
import { UserService } from './user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile/profile.service';
import { TextMaskModule } from 'angular2-text-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SupportgridComponent } from './support/supportgrid/supportgrid.component';
import { SupportscreenComponent } from './support/supportscreen/supportscreen.component';
import { DashboardService } from './dashboard/dashboard.service';
import { TicketSupportService } from './support/ticket-support.service';
import { PaymentComponent } from './payment/payment.component';
import { PaymentService } from './payment/payment.service';
import { NgxSpinnerModule } from '@hardpool/ngx-spinner';
import { NetworkComponent } from './network/network.component';
import { NetworkService } from './network/network.service';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { PaymentDetailService } from './payment-details/payment-detail.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderDetailService } from './order-detail/order-detail.service';
import { OrderComponent } from './order/order.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent, 
    ProfileComponent,
    SupportgridComponent,
    SupportscreenComponent,
    PaymentComponent,
    NetworkComponent,
    PaymentDetailsComponent,
    OrderDetailComponent,
    OrderComponent
  ],

  imports: [
    CommonModule,
    UserRoutingModule,
    NgbModule,
    TextMaskModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule,
    TreeTableModule,
    SharedModule
  ],
  providers:[
    ProfileService,
    TicketSupportService,
    DashboardService,
    PaymentService,
    UserService,
    NetworkService,
    PaymentDetailService,
    OrderDetailService
  ]

})
export class UserModule { }
