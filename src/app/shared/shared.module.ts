import { loadingConfig } from './../constant/globalfunction';
import { AlphaNumericOnlyDirective } from '../directives/alpha-numeric-only.directive';
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
import { SearchingComponent } from './searching/searching.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  
  declarations: [
    NoWhiteSpaceDirective, 
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
    NgxSpinnerModule.config(loadingConfig),
    RouterModule,
    FormsModule,
    NgbModule,
  ],
  entryComponents:[
    DialogComponent,
    PaymentInstructionComponent
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    SearchingComponent,
    NoWhiteSpaceDirective,
    NumberDirective,
    AlphaNumericOnlyDirective,
    NgbModule,
    NgxSpinnerModule.config(loadingConfig)
  ],

  providers:[]
})
export class SharedModule { }
