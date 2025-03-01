import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TicketService } from './ticket.service';
import { Ticket } from './ticket.interface';
import { CustomerService } from '../customer-management/customer.service';
import { CinemaRoomService } from '../cinema-room-management/cinema-room.service';
import { ScheduleService } from '../movie-schedule-management/schedule.service';
import { Schedule } from '../movie-schedule-management/schedule.interface';
import { Customer } from '../customer-management/customer.interface';
import { CinemaRoom } from '../cinema-room-management/cinema-room.interface';
import { VoucherService } from '../voucher-management/voucher.service';
import { Voucher } from '../voucher-management/voucher.interface';

@Component({
  selector: 'app-ticket-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ticket-management.component.html',
  providers: [TicketService, CustomerService, CinemaRoomService, ScheduleService, VoucherService]
})
export class TicketManagementComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  searchText: string = '';

  // Thống kê vé
  totalTickets: number = 0;
  bookedTickets: number = 0;
  canceledTickets: number = 0;
  usedTickets: number = 0;

  // Danh sách suất chiếu, khách hàng, phòng và voucher
  schedules: Schedule[] = [];
  customers: Customer[] = [];
  rooms: CinemaRoom[] = [];
  vouchers: Voucher[] = [];
  
  // Danh sách ghế khả dụng dựa trên phòng của suất chiếu được chọn
  availableSeats: string[] = [];
  selectedRoom?: CinemaRoom | {
    id?: number;
    name?: string;
    seatCount?: number;
    type?: string;
    status?: string;
};

  // Biến điều khiển modal form
  showForm: boolean = false;
  isEditMode: boolean = false;
  currentTicket: Ticket = {
    scheduleId: 0,
    customerId: 0,
    seatNumber: '',
    price: 0,
    status: 'booked',
    voucher: { id: 0, code: '', discount: 0, expirationDate: '', isActive: false }
  };

  constructor(
    private ticketService: TicketService,
    private scheduleService: ScheduleService,
    private customerService: CustomerService,
    private roomService: CinemaRoomService,
    private voucherService: VoucherService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
    this.loadSchedules();
    this.loadCustomers();
    this.loadRooms();
    this.loadVouchers();
  }

  loadVouchers() {
    this.voucherService.getVouchers().subscribe({
      next: (data: Voucher[]) => {
        this.vouchers = data;
      },
      error: (error: any) => console.error('Error fetching vouchers:', error)
    });
  }

  loadTickets() {
    this.ticketService.getTickets().subscribe({
      next: (data: Ticket[]) => {
        this.tickets = data;
        this.filteredTickets = data;
        this.computeStats();
      },
      error: (error) => console.error('Error fetching tickets:', error)
    });
  }

  loadSchedules() {
    this.scheduleService.getSchedules().subscribe({
      next: (data: Schedule[]) => {
        this.schedules = data;
      },
      error: (error: any) => console.error('Error fetching schedules:', error)
    });
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
      },
      error: (error: any) => console.error('Error fetching customers:', error)
    });
  }

  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (data: CinemaRoom[]) => {
        this.rooms = data;
      },
      error: (error: any) => console.error('Error fetching rooms:', error)
    });
  }

  computeStats() {
    this.totalTickets = this.tickets.length;
    this.bookedTickets = this.tickets.filter(ticket => ticket.status === 'booked').length;
    this.canceledTickets = this.tickets.filter(ticket => ticket.status === 'canceled').length;
    this.usedTickets = this.tickets.filter(ticket => ticket.status === 'used').length;
  }

  searchTickets(text: string) {
    this.filteredTickets = this.tickets.filter(ticket =>
      ticket.seatNumber.toLowerCase().includes(text.toLowerCase()) ||
      ticket.status.toLowerCase().includes(text.toLowerCase()) ||
      ticket.scheduleId.toString().includes(text) ||
      ticket.customerId.toString().includes(text)
    );
  }

  // Khi chọn suất chiếu, lấy thông tin phòng từ schedule để generate danh sách ghế dựa trên seatCount
  onScheduleChange() {
    const selectedSchedule = this.schedules.find(s => s.id === this.currentTicket.scheduleId);
    if (selectedSchedule && selectedSchedule.room && selectedSchedule.room.seatCount) {
      this.selectedRoom = selectedSchedule.room;
      
      const available = this.generateAvailableSeats(selectedSchedule.room.seatCount);
      // Nếu ghế hiện được chọn không có trong danh sách ghế khả dụng mới, reset lại seatNumber
      if (!available.includes(this.currentTicket.seatNumber)) {
        this.currentTicket.seatNumber = '';
      }
    } else {
      this.availableSeats = [];
    }
  }

  generateAvailableSeats(seatCount: number, seatsPerRow: number = 10): string[] {
    const allSeats = Array.from({ length: seatCount }, (_, i) => {
      const row = Math.floor(i / seatsPerRow);
      const seatNumber = (i % seatsPerRow) + 1;
      return `${String.fromCharCode(65 + row)}${seatNumber}`;
    });
  
    const bookedSeats = this.tickets
      .filter(ticket =>
        ticket.scheduleId === this.currentTicket.scheduleId &&
        ticket.status !== 'canceled' &&
        ticket.id !== this.currentTicket.id
      )
      .map(ticket => ticket.seatNumber);
  
    const available = allSeats.filter(seat => !bookedSeats.includes(seat));
    this.availableSeats = available;
    return available;
  }
  
  // Helper để hiển thị thông tin suất chiếu
  getScheduleDetail(scheduleId: number): string {
    const sch = this.schedules.find(s => s.id === scheduleId);
    if (sch) {
      const date = new Date(sch.startTime).toLocaleDateString();
      const time = new Date(sch.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return ` ${time} ${date} - ${sch.movie?.title}`;
    }
    return scheduleId.toString();
  }

  // Helper để lấy tên khách hàng
  getCustomerName(customerId: number): string {
    const cust = this.customers.find(c => c.id === customerId);
    return cust ? cust.name : customerId.toString();
  }

  // Helper tính thành tiền: nếu có voucher, áp dụng giảm giá theo %; nếu không, trả về giá ban đầu.
  getFinalPrice(ticket: Ticket): number {
    if (ticket.voucher && ticket.voucher.discount) {
      return ticket.price * (100 - Number(ticket.voucher.discount)) / 100;
    }
    return ticket.price;
  }

  openAddForm() {
    this.isEditMode = false;
    // Khởi tạo currentTicket với voucher được khởi tạo sẵn
    this.currentTicket = {
      scheduleId: this.schedules.length > 0 ? this.schedules[0].id! : 0,
      customerId: 0,
      seatNumber: '',
      price: 0,
      status: 'booked',
      voucher: { id: 0, code: '', discount: 0, expirationDate: '', isActive: false }
    };
    // Sau khi currentTicket đã có voucher, gọi onScheduleChange để generate ghế
    this.onScheduleChange();
    this.showForm = true;
  }
  
  
  openEditForm(ticket: Ticket) {
    this.isEditMode = true;
    this.currentTicket = { ...ticket };
    if (!this.currentTicket.voucher) {
      this.currentTicket.voucher = { id: 0, code: '', discount: 0, expirationDate: '', isActive: false };
    }
    // Khi mở form sửa, cập nhật danh sách ghế theo schedule đang chọn
    this.onScheduleChange();
    this.showForm = true;
  }
  

  saveTicket() {
    // Xử lý voucher: nếu voucher id bằng 0, loại bỏ voucher; nếu có, chỉ gửi voucher id.
    if (this.currentTicket.voucher) {
      if (Number(this.currentTicket.voucher.id) === 0) {
        this.currentTicket.voucher = undefined;
      } else {
        const voucherId = Number(this.currentTicket.voucher.id);
        const fullVoucher = this.vouchers.find(v => v.id === voucherId);
        if (fullVoucher) {
          this.currentTicket.voucher = fullVoucher;
        } else {
          this.currentTicket.voucher = { id: voucherId, code: '', discount: 0, expirationDate: '', isActive: false };
        }
      }
    }
  
    if (this.isEditMode) {
      this.ticketService.updateTicket(this.currentTicket).subscribe({
        next: (updatedTicket) => {
          // Nếu voucher chưa đầy đủ, merge thông tin từ danh sách vouchers
          if (updatedTicket.voucher && !updatedTicket.voucher.code) {
            const fullVoucher = this.vouchers.find(v => v.id === this.currentTicket.voucher?.id);
            if (fullVoucher) {
              updatedTicket.voucher = fullVoucher;
            }
          }
          const index = this.tickets.findIndex(t => t.id === updatedTicket.id);
          if (index !== -1) {
            this.tickets[index] = updatedTicket;
          }
          this.filteredTickets = [...this.tickets];
          this.computeStats();
          this.showForm = false;
        },
        error: (error) => console.error('Error updating ticket:', error)
      });
    } else {
      this.ticketService.addTicket(this.currentTicket).subscribe({
        next: (newTicket) => {
          if (newTicket.voucher && !newTicket.voucher.code) {
            const fullVoucher = this.vouchers.find(v => v.id === this.currentTicket.voucher?.id);
            if (fullVoucher) {
              newTicket.voucher = fullVoucher;
            }
          }
          this.tickets.push(newTicket);
          this.loadTickets();
          this.filteredTickets = [...this.tickets];
          this.computeStats();
          this.showForm = false;
        },
        error: (error) => console.error('Error adding ticket:', error)
      });
    }
  }

  deleteTicket(ticket: Ticket) {
    if (confirm(`Bạn có chắc chắn muốn xóa vé có ghế ${ticket.seatNumber} không?`)) {
      this.ticketService.deleteTicket(ticket.id!).subscribe({
        next: () => {
          this.tickets = this.tickets.filter(t => t.id !== ticket.id);
          this.filteredTickets = [...this.tickets];
          this.computeStats();
        },
        error: (error) => console.error('Error deleting ticket:', error)
      });
    }
  }

  cancelForm() {
    this.showForm = false;
  }
}
