import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from './dialog-modal/dialog/dialog.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    DialogComponent,
  ],
  entryComponents:[
    DialogComponent
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  providers:[]
})
export class SharedModule { }
