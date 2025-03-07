import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Ticket } from '../admin/tickets/ticket.interface';
import { TicketService } from '../admin/tickets/ticket.service';
import { ScheduleService } from '../admin/movie-schedule-management/schedule.service';
import { CustomerService } from '../admin/customer-management/customer.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-paid',
  templateUrl: './paid.component.html',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  providers: [TicketService, ScheduleService, CustomerService],
})
export class PaidComponent implements OnInit {
  bookingData: any; // Lưu dữ liệu đặt vé từ localStorage (chỉ chứa scheduleId, customerId, seats, price)
  paymentStatus: 'processing' | 'success' | 'failed' = 'processing';
  message: string = '';
  totalSeats: number = 0;
  totalAmount: number = 0;
  bookedTickets: Ticket[] = []; // Danh sách vé đã đặt từ API
  aggregatedTicket: any = null; // Vé ảo tổng hợp chứa thông tin đầy đủ
  qrCodeUrl: string = ''; // URL mã QR hiển thị

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private scheduleService: ScheduleService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    // Lấy query parameters từ VNPay redirect
    this.route.queryParams.subscribe(params => {
      console.log('Query params:', params);
      const responseCode = params['vnp_ResponseCode'];
      if (responseCode === '00') {
        // Thanh toán VNPay thành công, lấy bookingData từ localStorage
        const bookingDataJson = localStorage.getItem('bookingData');
        if (!bookingDataJson) {
          this.paymentStatus = 'failed';
          this.message = 'Không tìm thấy dữ liệu đặt vé. Vui lòng thử lại.';
          return;
        }
        this.bookingData = JSON.parse(bookingDataJson);
        this.totalSeats = this.bookingData.seats.length;
        this.totalAmount = this.totalSeats * this.bookingData.price;
        // Gọi API addTicket cho từng ghế
        this.processTicketBooking();
      } else {
        // Thanh toán không thành công
        this.paymentStatus = 'failed';
        this.message = 'Thanh toán không thành công. Vui lòng thử lại.';
      }
    });
  }

  processTicketBooking(): void {
    const seats = this.bookingData.seats;
    const scheduleId = this.bookingData.scheduleId;
    const customerId = this.bookingData.customerId;
    const price = this.bookingData.price;
    let completed = 0;
    let errors = 0;
    const total = seats.length;
    
    seats.forEach((seat: any) => {
      const ticket: Ticket = {
        scheduleId: scheduleId,
        customerId: customerId,
        seatNumber: `${seat.row}${seat.number}`,
        price: price,
        status: 'booked'
      };
      this.ticketService.addTicket(ticket).subscribe({
        next: (result) => {
          this.bookedTickets.push(result);
          completed++;
          this.checkCompletion(completed, errors, total);
        },
        error: (err) => {
          console.error(err);
          errors++;
          this.checkCompletion(completed, errors, total);
        }
      });
    });
  }

  checkCompletion(completed: number, errors: number, total: number): void {
    if (completed + errors === total) {
      if (errors === 0) {
        this.paymentStatus = 'success';
        this.message = 'Thanh toán và đặt vé thành công!';
        // Tổng hợp danh sách ghế từ các vé đã đặt
        const seatsList = this.bookedTickets.map(ticket => ticket.seatNumber).join(', ');
        // Tạo mã vé tổng hợp bằng cách nối các id của vé với dấu gạch ngang
        const aggregatedTicketId = this.bookedTickets.map(ticket => ticket.id).join('');
        // Tạo object vé ảo cơ bản (chưa có thông tin chi tiết)
        this.aggregatedTicket = {
          aggregatedTicketId,
          scheduleId: this.bookingData.scheduleId,
          customerId: this.bookingData.customerId,
          seats: seatsList,
          totalPrice: this.totalAmount,
          scheduleInfo: {}, // Sẽ cập nhật sau
          customerInfo: {}  // Sẽ cập nhật sau
        };
        // Sau khi tổng hợp vé, gọi API để lấy thông tin chi tiết của suất chiếu và khách hàng
        this.loadAdditionalDetails();
        // Xóa bookingData sau khi xử lý xong
        localStorage.removeItem('bookingData');
      } else {
        this.paymentStatus = 'failed';
        this.message = 'Thanh toán thành công, nhưng có lỗi khi đặt một số vé. Vui lòng liên hệ hỗ trợ.';
      }
    }
  }

  loadAdditionalDetails(): void {
    forkJoin({
      schedule: this.scheduleService.findOne(this.bookingData.scheduleId),
      customer: this.customerService.findOne(this.bookingData.customerId)
    }).subscribe(({ schedule, customer }) => {
      
      this.aggregatedTicket.scheduleInfo = {
        id: schedule.id,
        name: schedule.movie?.title || 'N/A',   // Ví dụ: tên phim hoặc suất chiếu
        time: schedule.startTime,                // Thời gian chiếu
        room: schedule.room?.name || 'N/A'
      };
      this.aggregatedTicket.customerInfo = {
        id: customer.id,
        name: customer.name
      };
      // Cập nhật mã QR với thông tin vé ảo mới nhất
      const qrData = encodeURIComponent(JSON.stringify(this.aggregatedTicket));
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
    });
  }

  redirectHome(): void {
    this.router.navigate(['/']);
  }
}
