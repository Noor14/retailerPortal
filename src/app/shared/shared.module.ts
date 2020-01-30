import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogServiceService } from './dialog-modal/dialog-service';
import { PaymentComponent } from './payment/payment.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  providers:[DialogServiceService]
})
export class SharedModule { }
