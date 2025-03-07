import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { CinemaRoomService } from '../admin/cinema-room-management/cinema-room.service';
import { Movie } from '../admin/movie-management/movie.interface';
import { MovieService } from '../admin/movie-management/movie.service';
import { Schedule } from '../admin/movie-schedule-management/schedule.interface';
import { ScheduleService } from '../admin/movie-schedule-management/schedule.service';
import { Ticket } from '../admin/tickets/ticket.interface';
import { TicketService } from '../admin/tickets/ticket.service';
import { Customer } from '../admin/customer-management/customer.interface';
import { CustomerService } from '../admin/customer-management/customer.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Seat {
  row: string;
  number: number;
  status: 'available' | 'reserved' | 'selected';
}

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [MovieService, ScheduleService, CinemaRoomService, TicketService, CustomerService],
  templateUrl: './customer.component.html',
})
export class CustomerComponent {
  // Phim
  nowShowingMovies: Movie[] = [];
  comingSoonMovies: Movie[] = [];
  bannerMovie: Movie = { id: 0, title: '', posterUrl: '', trailerUrl: '', status: 'now-showing', description: '' } as Movie;
  loading: boolean = false;
  error: string = '';

  // Modal chọn suất chiếu
  showtimeModal: boolean = false;
  movieSchedules: Schedule[] = [];
  selectedMovie: Movie | null = null;

  // Modal chọn ghế
  showSeatModal: boolean = false;
  selectedSchedule: Schedule | null = null;

  // Modal Trailer
  showTrailerModal: boolean = false;
  safeTrailerUrl: SafeResourceUrl = '';

  // Modal nhập email khách hàng
  showEmailModal: boolean = false;
  customerEmail: string = '';

  // Modal nhập thông tin khách hàng mới (nếu email không tồn tại)
  showCustomerModal: boolean = false;
  newCustomer: Customer = { name: '', email: '', phone: '' };

  // Sau khi check email, lưu customerId dùng cho vé
  customerId: number | null = null;

  constructor(
    private movieService: MovieService,
    private scheduleService: ScheduleService,
    private cinemaRoomService: CinemaRoomService,
    private ticketService: TicketService,
    private customerService: CustomerService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.movieService.getMovies().subscribe({
      next: (movies: Movie[]) => {
        this.nowShowingMovies = movies.filter(movie => movie.status === 'now-showing');
        this.comingSoonMovies = movies.filter(movie => movie.status === 'coming-soon');
        // Chọn phim cho banner

        this.bannerMovie =
          this.nowShowingMovies.length > 0
            ? this.nowShowingMovies[Math.floor(Math.random() * this.nowShowingMovies.length)]
            : this.comingSoonMovies.length > 0
              ? this.comingSoonMovies[Math.floor(Math.random() * this.comingSoonMovies.length)]
              : { id: 0, title: '', posterUrl: '', trailerUrl: '', status: 'coming-soon', description: '' } as Movie;
        this.loading = false;

      },
      error: (err) => {
        console.error(err);
        this.error = 'Không thể tải dữ liệu phim.';
        this.loading = false;
      }
    });
  }

  // Mở modal đặt vé: lấy danh sách suất chiếu của phim từ backend
  openBookingForMovie(movie: Movie) {
    this.selectedMovie = movie;
    this.scheduleService.getSchedulesByMovie(movie.id).subscribe({
      next: (schedules: Schedule[]) => {
        this.movieSchedules = schedules;
        this.showtimeModal = true;
      },
      error: (err) => {
        console.error(err);
        alert('Không thể tải danh sách suất chiếu!');
      }
    });
  }

  // Khi người dùng chọn 1 suất chiếu
  selectSchedule(schedule: Schedule) {
    this.selectedSchedule = schedule;
    this.showtimeModal = false;
    if (schedule.room && schedule.room.seatCount !== undefined) {
      // Lấy vé đã đặt của suất chiếu này
      this.ticketService.getTicketsBySchedule(schedule.id!).subscribe({
        next: (tickets: Ticket[]) => {
          const bookedSeats = tickets.filter(ticket => ticket.status === 'booked').map(ticket => ticket.seatNumber);
          const allSeats = this.generateSeatsFromRoom(schedule.room.seatCount!);
          const updatedSeats = allSeats.map(seat => {
            const seatCode = `${seat.row}${seat.number}`;
            return bookedSeats.includes(seatCode) ? { ...seat, status: 'reserved' } : seat;
          });
          (this.selectedSchedule as any).seats = updatedSeats;
          this.showSeatModal = true;
        },
        error: (err: any) => {
          console.error(err);
          alert('Không thể tải thông tin vé đã đặt!');
        }
      });
    } else {
      alert('Thông tin phòng không hợp lệ!');
    }
  }

  // Hàm generate ghế từ số lượng ghế
  private generateSeatsFromRoom(seatCount: number): Seat[] {
    const seats: Seat[] = [];
    const columns = 10;
    const rows = Math.ceil(seatCount / columns);
    let seatCounter = 0;
    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(65 + i);
      for (let j = 1; j <= columns; j++) {
        seatCounter++;
        if (seatCounter > seatCount) break;
        seats.push({ row: rowLetter, number: j, status: 'available' });
      }
    }
    return seats;
  }

  closeShowtimeModal() {
    this.showtimeModal = false;
    this.selectedMovie = null;
    this.movieSchedules = [];
  }

  closeSeatModal() {
    this.showSeatModal = false;
    this.selectedSchedule = null;
  }

  // Xử lý chọn ghế
  toggleSeat(seat: Seat) {
    if (seat.status === 'available') {
      seat.status = 'selected';
    } else if (seat.status === 'selected') {
      seat.status = 'available';
    }
  }

  // Khi bấm "Xác nhận đặt vé", mở modal nhập email khách hàng
  confirmBooking() {
    if (this.selectedSchedule && this.selectedSchedule.seats) {
      const selectedSeats = this.selectedSchedule.seats.filter(seat => seat.status === 'selected');
      if (selectedSeats.length === 0) {
        alert('Vui lòng chọn ít nhất một ghế!');
        return;
      }
      this.showEmailModal = true;
    }
  }

  // Khi nhập email và bấm xác nhận trong modal email
  checkCustomerByEmail() {
    if (!this.customerEmail) {
      alert('Vui lòng nhập email!');
      return;
    }
    // Ở đây, bạn có thể gọi API để tìm khách hàng theo email. Ví dụ:
    this.customerService.getCustomerByEmail(this.customerEmail).subscribe(customer => {
      // const customer = customers.find(c => c.email === this.customerEmail);
      if (customer) {
        this.customerId = customer.id!;
        this.showEmailModal = false;
        this.bookTickets();
      } else {
        // Nếu email chưa có, mở modal nhập thông tin khách hàng
        this.newCustomer.email = this.customerEmail;
        this.showEmailModal = false;
        this.showCustomerModal = true;
      }
    });
  }

  // Tạo mới khách hàng sau khi nhập đầy đủ thông tin
  createCustomer() {
    if (!this.newCustomer.name || !this.newCustomer.email || !this.newCustomer.phone) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    this.customerService.addCustomer(this.newCustomer).subscribe(customer => {
      this.customerId = customer.id!;
      this.showCustomerModal = false;
      this.bookTickets();
    });
  }

  // Sau khi có customerId, tiến hành đặt vé cho các ghế đã chọn
  // bookTickets() {
  //   if (this.selectedSchedule && this.selectedSchedule.seats && this.customerId) {
  //     const selectedSeats = this.selectedSchedule.seats.filter(seat => seat.status === 'selected');
  //     const price = this.selectedSchedule.ticketPrice || 80000.0;
  //     const bookedTickets: Ticket[] = [];
  //     let completed = 0;

  //     selectedSeats.forEach(seat => {
  //       const ticket: Ticket = {
  //         scheduleId: this.selectedSchedule!.id!,
  //         customerId: this.customerId!,
  //         seatNumber: `${seat.row}${seat.number}`,
  //         price,
  //         status: 'booked'
  //       };
  //       this.ticketService.addTicket(ticket).subscribe({
  //         next: (result) => {
  //           bookedTickets.push(result);
  //           completed++;
  //           if (completed === selectedSeats.length) {
  //             // Tất cả vé đã được đặt, điều hướng sang trang thanh toán và truyền thông tin vé qua state
  //             this.router.navigate(['/payment'], { state: { tickets: bookedTickets } });
  //           }
  //         },
  //         error: (err) => {
  //           console.error(err);
  //           alert('Đặt vé thất bại cho ghế ' + `${seat.row}${seat.number}`);
  //         }
  //       });
  //     });

  //     this.showSeatModal = false;
  //     this.selectedSchedule = null;
  //   }
  // }
  bookTickets() {
    if (this.selectedSchedule && this.selectedSchedule.seats && this.customerId) {
      const selectedSeats = this.selectedSchedule.seats.filter(seat => seat.status === 'selected');
      if (selectedSeats.length === 0) {
        alert('Vui lòng chọn ít nhất một ghế!');
        return;
      }
      const price = this.selectedSchedule.ticketPrice || 80000.0;

      // Chuẩn bị dữ liệu đặt vé
      const bookingData = {
        scheduleId: this.selectedSchedule.id,
        customerId: this.customerId,
        seats: selectedSeats,  // Chứa thông tin ghế (row, number)
        price: price
      };

      // Reset lại modal và thông tin suất chiếu
      this.showSeatModal = false;
      this.selectedSchedule = null;

      // Lưu bookingData vào localStorage để đảm bảo không bị mất khi chuyển hướng
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
      // Điều hướng sang trang thanh toán và truyền bookingData qua state
      this.router.navigate(['/payment'], { state: { bookingData } });
    }
  }


  // Các hàm đóng modal
  closeEmailModal() {
    this.showEmailModal = false;
  }
  closeCustomerModal() {
    this.showCustomerModal = false;
  }

  // Trailer modal
  openTrailer(movie: Movie) {
    if (movie.trailerUrl) {
      this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(movie.trailerUrl);
      this.showTrailerModal = true;
    } else {
      alert('Trailer chưa khả dụng');
    }
  }
  closeTrailer() {
    this.showTrailerModal = false;
    this.safeTrailerUrl = '';
  }
}
