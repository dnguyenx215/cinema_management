import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from './customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:3000/customers'; // Đường dẫn API backend của bạn

  constructor(private http: HttpClient) {}

  // Lấy danh sách khách hàng
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomerByEmail(email: string): Observable<Customer> {
    return this.http.get<Customer>(this.apiUrl + '/find-by-email/' + email);
  }


  // Thêm khách hàng mới
  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  // Cập nhật khách hàng
  updateCustomer(customer: Customer): Observable<Customer> {
    const url = `${this.apiUrl}/${customer.id}`;
    return this.http.put<Customer>(url, customer);
  }

  // Xóa khách hàng
  deleteCustomer(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
