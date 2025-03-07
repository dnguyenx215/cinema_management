import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RegisterResponse } from './auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
    standalone: true,
    providers: [AuthService],
    imports: [CommonModule, FormsModule, HttpClientModule]
})
export class RegisterComponent {
  email = '';
  password = '';
  role = ''; // Tùy chọn, nếu muốn cho phép chọn role
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register(this.email, this.password, this.role).subscribe({
      next: (response: RegisterResponse) => {
        this.successMessage = 'Đăng ký thành công! Bạn có thể đăng nhập ngay.';
        // Chuyển hướng về trang đăng nhập sau vài giây hoặc ngay lập tức
        this.router.navigate(['/login']);
      },
      error: (error : any) => {
        console.error('Registration failed:', error);
        this.errorMessage = error.error?.message || 'Đăng ký thất bại';
      }
    });
  }
}
