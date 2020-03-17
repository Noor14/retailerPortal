import { NumberDirective } from 'src/app/directives/numbers-only.directive';
import { NoWhiteSpaceDirective } from './../directives/no-white-space.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgxSpinnerModule } from '@hardpool/ngx-spinner';
import { DialogComponent } from './dialog-modal/dialog/dialog.component';
import { PaymentInstructionComponent } from './dialog-modal/payment-instruction/payment-instruction.component';
import { RouterModule } from '@angular/router';

@NgModule({
  
  declarations: [
    NoWhiteSpaceDirective, 
    NumberDirective,
    HeaderComponent,
    SidebarComponent, 
    DialogComponent,
    PaymentInstructionComponent,
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    RouterModule
  ],
  entryComponents:[
    DialogComponent,
    PaymentInstructionComponent
  ],
  exports:[
    HeaderComponent,
    SidebarComponent,
    NoWhiteSpaceDirective, 
    NumberDirective],

  providers:[]
})
export class SharedModule { }
