import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavItemComponent, RouterModule, AppComponent],
  templateUrl: './admin.component.html',
})
export class AdminComponent {

  title = 'Cinema Management';
  constructor(private router: Router) {}
  isOpen = true;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.title = this.isOpen ? 'Cinema Management' : '';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    this.router.navigate(['/management/login']);
  }
}
