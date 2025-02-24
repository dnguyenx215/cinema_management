import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Voucher } from './voucher.interface';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private apiUrl = 'http://localhost:3000/vouchers';

  constructor(private http: HttpClient) {}

  // Lấy danh sách voucher
  getVouchers(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(this.apiUrl);
  }

  // Thêm voucher mới
  addVoucher(voucher: Voucher): Observable<Voucher> {
    return this.http.post<Voucher>(this.apiUrl, voucher);
  }

  // Cập nhật voucher
  updateVoucher(voucher: Voucher): Observable<Voucher> {
    const url = `${this.apiUrl}/${voucher.id}`;
    return this.http.put<Voucher>(url, voucher);
  }

  // Xóa voucher
  deleteVoucher(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
