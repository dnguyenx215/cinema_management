import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AdminComponent } from './app/admin/admin.component';

bootstrapApplication(AdminComponent, appConfig)
  .catch((err) => console.error(err));
