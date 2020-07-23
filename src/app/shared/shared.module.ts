import { NumberDirective } from '../directives/number.directive';
import { AmountDirective } from './../directives/amount-only.directive';
import { UserRoleDirective } from './../directives/user-role.directive';
import { AlphaNumericOnlyDirective } from '../directives/alpha-numeric-only.directive';
import { NoWhiteSpaceDirective } from './../directives/no-white-space.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgxSpinnerModule } from '@hardpool/ngx-spinner';
import { DialogComponent } from './dialog-modal/dialog/dialog.component';
import { PaymentInstructionComponent } from './dialog-modal/payment-instruction/payment-instruction.component';
import { RouterModule } from '@angular/router';
import { SearchingComponent } from './searching/searching.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  
  declarations: [
    UserRoleDirective,
    NoWhiteSpaceDirective,
    AmountDirective,
    NumberDirective,
    AlphaNumericOnlyDirective,
    HeaderComponent,
    SidebarComponent,
    DialogComponent,
    PaymentInstructionComponent,
    SearchingComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    RouterModule,
    FormsModule,
    NgbModule,
  ],
  entryComponents: [
    DialogComponent,
    PaymentInstructionComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    SearchingComponent,
    NoWhiteSpaceDirective,
    UserRoleDirective,
    AmountDirective,
    NumberDirective,
    AlphaNumericOnlyDirective,
    NgbModule,
    NgxSpinnerModule,
    FormsModule
  ],

  providers: []
})
export class SharedModule { }
