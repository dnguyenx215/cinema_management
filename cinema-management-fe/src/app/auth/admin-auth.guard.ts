import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivateChild {
  constructor(private router: Router) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // const token = localStorage.getItem('token');
    const email = localStorage.getItem('user_email');
    const role = localStorage.getItem('user_role');

    // Kiểm tra nếu không có token, email hoặc role không phải là admin
    if (!email || role !== 'admin') {
      // Chuyển hướng về trang đăng nhập (ví dụ: /management/login)
      this.router.navigate(['/management/login']);
      return false;
    }
    return true;
  }
}
