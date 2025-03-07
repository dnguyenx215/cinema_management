import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PaymentService } from './payment.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ScheduleService } from '../admin/movie-schedule-management/schedule.service';
import { CustomerService } from '../admin/customer-management/customer.service';

export interface PaymentRequest {
  amount: number;
  orderDescription: string;
  orderType: string;
  bankCode: string;
  language: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  providers: [PaymentService, ScheduleService, CustomerService],
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  bookingData: any;
  totalAmount: number = 0;
  paymentRequest: PaymentRequest | undefined;
  aggregatedTicket: any = null; // Vé ảo tổng hợp hiển thị preview

  constructor(
    private router: Router, 
    private paymentService: PaymentService,
    private scheduleService: ScheduleService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    // Lấy thông tin bookingData được truyền qua router state
    if (history.state && history.state.bookingData) {
      this.bookingData = history.state.bookingData;
      this.totalAmount = this.bookingData.seats.length * this.bookingData.price;

      // Xây dựng PaymentRequest theo yêu cầu backend
      this.paymentRequest = {
        amount: this.totalAmount,
        orderDescription: 'ticket_paid',
        orderType: 'billpayment',
        bankCode: '', // Có thể cho phép người dùng chọn nếu cần
        language: 'vn'
      };

      // Gọi API để lấy thông tin chi tiết của suất chiếu và khách hàng, sau đó tạo vé ảo preview
      this.loadAdditionalDetails();
    } else {
      this.router.navigate(['/']);
    }
  }

  loadAdditionalDetails(): void {
    forkJoin({
      schedule: this.scheduleService.findOne(this.bookingData.scheduleId),
      customer: this.customerService.findOne(this.bookingData.customerId)
    }).subscribe(({ schedule, customer }) => {
      const seatsList = this.bookingData.seats
        .map((seat: any) => `${seat.row}${seat.number}`)
        .join(', ');

      // Tạo đối tượng vé ảo preview (chưa có mã vé thực vì vé chỉ được tạo sau thanh toán)
      this.aggregatedTicket = {
        aggregatedTicketId: 'TICKET-PREVIEW', // Placeholder
        scheduleInfo: {
          id: schedule.id,
          name: schedule.movie?.title || 'N/A',   // Ví dụ: tên phim được chiếu
          time: schedule.startTime,                // Thời gian chiếu
          room: schedule.room?.name || 'N/A'
        },
        customerInfo: {
          id: customer.id,
          name: customer.name
        },
        seats: seatsList,
        totalPrice: this.totalAmount
      };
    });
  }

  onPayNow(): void {
    if (this.paymentRequest) {
      this.paymentService.createPaymentUrl(this.paymentRequest);
    } else {
      console.error('Payment request is undefined');
    }
  }
}
