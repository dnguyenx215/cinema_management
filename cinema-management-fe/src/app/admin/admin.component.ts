import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavItemComponent } from './components/nav-item/nav-item.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavItemComponent, RouterModule],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  title = 'Cinema Management';

  isOpen = true;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.title = this.isOpen ? 'Cinema Management' : '';
  }
}
