import { UserService } from './user.service';
import { PaymentInstructionComponent } from './../../shared/dialog-modal/payment-instruction/payment-instruction.component';
import { SidebarComponent } from './../../shared/sidebar/sidebar.component';
import { HeaderComponent } from './../../shared/header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ProfileService } from './profile/profile.service';
import { TextMaskModule } from 'angular2-text-mask';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SupportgridComponent } from './support/supportgrid/supportgrid.component';
import { SupportscreenComponent } from './support/supportscreen/supportscreen.component';
import { DialogComponent } from '../../shared/dialog-modal/dialog/dialog.component';
import { DashboardService } from './dashboard/dashboard.service';
import { TicketSupportService } from './support/ticket-support.service';
import { PaymentComponent } from './payment/payment.component';
import { PaymentService } from './payment/payment.service';
import { NgxSpinnerModule } from '@hardpool/ngx-spinner';
import { NetworkComponent } from './network/network.component';
import { NetworkService } from './network/network.service';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { PaymentDetailService } from './payment-details/payment-detail.service';
import { InterceptorService } from 'src/app/services/interceptor.service';
import { NumberDirective } from 'src/app/directives/numbers-only.directive';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderDetailService } from './order-detail/order-detail.service';
import { OrderComponent } from './order/order.component';
import { TreeTableModule } from 'ng-treetable';

@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent, 
    HeaderComponent,
    SidebarComponent, 
    ProfileComponent,
    SupportgridComponent,
    SupportscreenComponent,
    DialogComponent,
    PaymentComponent,
    PaymentInstructionComponent,
    NetworkComponent,
    PaymentDetailsComponent,
    NumberDirective,
    OrderDetailComponent,
    OrderComponent
  ],
  entryComponents:[
    DialogComponent,
    PaymentInstructionComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgbModule,
    HttpClientModule,
    TextMaskModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule,
    TreeTableModule

  ],
  providers:[
    ProfileService,
    TicketSupportService,
    DashboardService,
    PaymentService,
    UserService,
    NetworkService,
    PaymentDetailService,
    OrderDetailService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]

})
export class UserModule { }
