import { Injectable } from '@angular/core';

export interface PaymentRequest {
  amount: number;
  orderDescription: string;
  orderType: string;
  bankCode: string;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/payment/create-payment-url'; // Điều chỉnh URL nếu cần

  createPaymentUrl(paymentRequest: PaymentRequest): void {
    // Tạo form ẩn và submit form để trình duyệt chuyển hướng
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = this.apiUrl;

    // Tạo input ẩn cho mỗi tham số trong paymentRequest
    for (const key in paymentRequest) {
      if (paymentRequest.hasOwnProperty(key)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentRequest[key as keyof PaymentRequest] as string;
        form.appendChild(input);
      }
    }
    document.body.appendChild(form);
    form.submit();
  }
}
