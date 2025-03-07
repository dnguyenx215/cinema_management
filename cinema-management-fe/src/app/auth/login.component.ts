import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  providers: [AuthService],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.loginAdmin(this.email, this.password).subscribe({
      next: (response: LoginResponse) => {
        // Lưu token, email và role vào localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_email', response.data.user_email);
        localStorage.setItem('user_role', response.data.user_role);
        // Chuyển hướng đến dashboard admin
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error: any) => {
        console.error('Login failed:', error);
        this.errorMessage = error.error?.message || 'Đăng nhập thất bại';
      }
    });
  }
  
}
