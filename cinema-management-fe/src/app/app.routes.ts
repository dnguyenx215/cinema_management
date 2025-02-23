import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { MovieManagementComponent } from './admin/movie-management/movie-management.component';
import { MovieScheduleManagementComponent } from './admin/movie-schedule-management/movie-schedule-management.component';
import { CinemaRoomManagementComponent } from './admin/cinema-room-management/cinema-room-management.component';


export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'movie-management', component: MovieManagementComponent },
  { path: 'movie-schedule', component: MovieScheduleManagementComponent},
  { path: 'cinema-room-manager', component: CinemaRoomManagementComponent},
];
