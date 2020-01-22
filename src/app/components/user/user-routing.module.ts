import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    // pathMatch: 'full',
    children: [
    { path: 'dashboard', component: DashboardComponent },
    // { path: 'messages', component: MessagesComponent },
    // { path: 'calls', component: CallsComponent },
    // { path: 'reminders', component: RemindersComponent },
    // { path: 'schedulers', component: SchedulersComponent },
    // { path: 'settings', component: SettingsComponent },
    { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
