import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { MovieManagementComponent } from './admin/movie-management/movie-management.component';
import { MovieScheduleManagementComponent } from './admin/movie-schedule-management/movie-schedule-management.component';
import { CinemaRoomManagementComponent } from './admin/cinema-room-management/cinema-room-management.component';
import { TicketManagementComponent } from './admin/tickets/ticket-management.component';
import { CustomerManagementComponent } from './admin/customer-management/customer-management.component';
import { VoucherManagementComponent } from './admin/voucher-management/voucher-management.component';


export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'movie-management', component: MovieManagementComponent },
  { path: 'movie-schedule', component: MovieScheduleManagementComponent},
  { path: 'cinema-room-manager', component: CinemaRoomManagementComponent},
  {path: 'ticket-management', component: TicketManagementComponent},
  {path: 'vip', component: CustomerManagementComponent},
  {path: 'voucher', component: VoucherManagementComponent}
];
