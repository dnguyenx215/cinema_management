import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-item.component.html'
})
export class NavItemComponent {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() isOpen!: boolean;
}
