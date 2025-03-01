import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { MovieService } from '../movie-management/movie.service';
import { TicketService } from '../tickets/ticket.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [HttpClientModule],
  providers: [MovieService, TicketService],
  standalone: true,
})
export class DashboardComponent implements OnInit {
  totalMovies: number = 0;
  ticketsSold: number = 0;
  revenue: number = 0;
  salesData: number[] = [];
  movieDistributionLabels: string[] = [];
  movieDistributionData: number[] = [];

  constructor(
    private movieService: MovieService,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.loadMovieData();
    this.loadTicketData();
  }

  loadMovieData() {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.totalMovies = movies.length;
        // Phân bố phim theo thể loại
        const distribution: { [genre: string]: number } = {};
        movies.forEach(movie => {
          const genre = (movie.categories && movie.categories[0]) || 'Khác';
          distribution[genre] = (distribution[genre] || 0) + 1;
        });
        this.movieDistributionLabels = Object.keys(distribution);
        this.movieDistributionData = Object.values(distribution);
        // Khi dữ liệu phim đã sẵn, cập nhật biểu đồ phim
        this.createMovieChart();
      },
      error: (err) => console.error('Error loading movies', err)
    });
  }

  loadTicketData() {
    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.ticketsSold = tickets.length;
        // Tính doanh thu (giả sử price là số tiền bán vé)
        this.revenue = tickets.reduce((sum, ticket) => sum + Number(ticket.price), 0);
        // Giả lập dữ liệu doanh số theo ngày trong tuần
        // Trong thực tế, bạn có thể nhóm các vé theo ngày bán
        const salesByDay: { [day: string]: number } = {
          'T2': 0, 'T3': 0, 'T4': 0, 'T5': 0, 'T6': 0, 'T7': 0, 'CN': 0
        };
        // Ví dụ: mỗi vé tăng doanh số theo giá, ta giả định giá trị bán vé được nhóm vào ngày bán (tùy thuộc vào thuộc tính ngày của vé)
        // Ở đây ta dùng dữ liệu mô phỏng
        salesByDay['T2'] = 1200;
        salesByDay['T3'] = 1900;
        salesByDay['T4'] = 1500;
        salesByDay['T5'] = 2400;
        salesByDay['T6'] = 2800;
        salesByDay['T7'] = 3200;
        salesByDay['CN'] = 3800;
        this.salesData = [
          salesByDay['T2'], salesByDay['T3'], salesByDay['T4'],
          salesByDay['T5'], salesByDay['T6'], salesByDay['T7'],
          salesByDay['CN']
        ];
        // Sau khi dữ liệu vé đã sẵn, cập nhật biểu đồ doanh số
        this.createSalesChart();
      },
      error: (err) => console.error('Error loading tickets', err)
    });
  }

  createSalesChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [{
          label: 'Doanh số bán vé',
          data: this.salesData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { display: true } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  createMovieChart() {
    const ctx = document.getElementById('movieChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.movieDistributionLabels,
        datasets: [{
          data: this.movieDistributionData,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(96, 165, 250, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}
