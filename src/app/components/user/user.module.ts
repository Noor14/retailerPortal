import { SidebarComponent } from './../../shared/sidebar/sidebar.component';
import { HeaderComponent } from './../../shared/header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user.component';
import { PaymentComponent } from '../../shared/payment/payment.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent, 
    HeaderComponent,
    PaymentComponent,
    SidebarComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgbModule
  ]
})
export class UserModule { }
