import { SidebarComponent } from './../../shared/sidebar/sidebar.component';
import { HeaderComponent } from './../../shared/header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from "@angular/common/http";
import { ProfileService } from './profile/profile.service';
import { TextMaskModule } from 'angular2-text-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { SupportgridComponent } from './support/supportgrid/supportgrid.component';
import { SupportscreenComponent } from './support/supportscreen/supportscreen.component';
import { SupportSignInService } from './support/supportsign.service';
import { TableComponent } from '../../shared/table/table.component';
import { PaymentComponent } from '../../shared/payment/payment.component';
@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent, 
    HeaderComponent,
    SidebarComponent,
    ProfileComponent,
    SupportgridComponent,
    SupportscreenComponent,
    TableComponent,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgbModule,
    HttpClientModule,
    TextMaskModule,
    ReactiveFormsModule,
    // SharedModule
  ],
  providers:[ProfileService,SupportSignInService]

})
export class UserModule { }
