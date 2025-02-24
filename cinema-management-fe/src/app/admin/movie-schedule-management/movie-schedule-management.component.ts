import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.interface';
import { Movie } from '../movie-management/movie.interface';
import { MovieService } from '../movie-management/movie.service';
import { CinemaRoomService } from '../cinema-room-management/cinema-room.service';
import { CinemaRoom } from '../cinema-room-management/cinema-room.interface';

@Component({
  selector: 'app-movie-schedule-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [ScheduleService, MovieService, CinemaRoomService],
  templateUrl: './movie-schedule-management.component.html',
})
export class MovieScheduleManagementComponent implements OnInit {
  schedules: Schedule[] = [];
  filteredSchedules: Schedule[] = [];
  searchText: string = '';

  showForm: boolean = false;
  isEditMode: boolean = false;
  // Khởi tạo currentSchedule với movie và room là đối tượng chứa ít nhất id
  currentSchedule: Schedule = {
    id: 0,
    startTime: '',
    endTime: '',
    movie: { id: 0 },
    room: { id: 0, name: '', seatCount: 0, type: '', status: '' }
  };

  // Binding cho ngày và giờ
  scheduleDate: string = '';
  scheduleTime: string = '';

  movies: Movie[] = [];
  rooms: CinemaRoom[] = [];

  constructor(
    private scheduleService: ScheduleService,
    private movieService: MovieService,
    private roomService: CinemaRoomService
  ) {}

  ngOnInit() {
    this.loadSchedules();
    this.loadMovies();
    this.loadRooms();
  }

  loadSchedules() {
    this.scheduleService.getSchedules().subscribe({
      next: (data: Schedule[]) => {
        // Đảm bảo movie và room không null
        this.schedules = data.map(schedule => ({
          ...schedule,
          movie: schedule.movie ? schedule.movie : { id: 0 },
          room: schedule.room ? schedule.room : { id: 0, name: '', seatCount: 0, type: '', status: '' }
        }));
        this.filteredSchedules = [...this.schedules];
      },
      error: (error) => console.error('Error fetching schedules:', error)
    });
  }

  loadMovies() {
    this.movieService.getMovies().subscribe({
      next: (data: Movie[]) => {
        this.movies = data;
      },
      error: (error) => console.error('Error fetching movies:', error)
    });
  }

  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (data: CinemaRoom[]) => {
        this.rooms = data;
      },
      error: (error) => console.error('Error fetching rooms:', error)
    });
  }

  searchSchedules(text: string) {
    this.filteredSchedules = this.schedules.filter(schedule => {
      return schedule.movie && schedule.movie.title && schedule.movie.title.toLowerCase().includes(text.toLowerCase());
    });
  }

  openAddForm() {
    this.isEditMode = false;
    this.currentSchedule = {
      id: 0,
      startTime: '',
      endTime: '',
      movie: { id: 0 },
      room: { id: 0, name: '', seatCount: 0, type: '', status: '' }
    };
    this.scheduleDate = '';
    this.scheduleTime = '';
    this.showForm = true;
  }

  openEditForm(schedule: Schedule) {
    this.isEditMode = true;
    this.currentSchedule = {
      ...schedule,
      movie: schedule.movie ? { id: schedule.movie.id } : { id: 0 },
      room: schedule.room ? { id: schedule.room.id, name: schedule.room.name, seatCount: schedule.room.seatCount, type: schedule.room.type, status: schedule.room.status } : { id: 0, name: '', seatCount: 0, type: '', status: '' }
    };
    const dt = new Date(schedule.startTime);
    this.scheduleDate = dt.toISOString().split('T')[0];
    this.scheduleTime = dt.toTimeString().split(':').slice(0, 2).join(':');
    this.showForm = true;
  }

  saveSchedule() {
    if (this.scheduleDate && this.scheduleTime) {
      const start = new Date(`${this.scheduleDate}T${this.scheduleTime}`);
      this.currentSchedule.startTime = start.toISOString();
      // Giả định lịch chiếu kéo dài 2 giờ
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      this.currentSchedule.endTime = end.toISOString();
    }
    
    // Chỉ gửi movie id và room id (loại bỏ các trường đầy đủ)
    this.currentSchedule.movie = { id: this.currentSchedule.movie!.id };
    this.currentSchedule.room = { id: this.currentSchedule.room!.id };
  
    if (this.isEditMode) {
      this.scheduleService.updateSchedule(this.currentSchedule).subscribe({
        next: () => {
          // Sau khi update thành công, load lại danh sách lịch chiếu để lấy thông tin đầy đủ
          this.loadSchedules();
          this.showForm = false;
        },
        error: (error) => console.error('Error updating schedule:', error)
      });
    } else {
      this.scheduleService.addSchedule(this.currentSchedule).subscribe({
        next: () => {
          // Sau khi thêm thành công, load lại danh sách lịch chiếu để lấy thông tin đầy đủ
          this.loadSchedules();
          this.showForm = false;
        },
        error: (error) => console.error('Error adding schedule:', error)
      });
    }
  }
  

  deleteSchedule(schedule: Schedule) {
    if (confirm(`Bạn có chắc muốn xóa lịch chiếu cho phim "${schedule.movie?.title || ''}" không?`)) {
      this.scheduleService.deleteSchedule(schedule.id!).subscribe({
        next: () => {
          this.schedules = this.schedules.filter(s => s.id !== schedule.id);
          this.filteredSchedules = [...this.schedules];
        },
        error: (error) => console.error('Error deleting schedule:', error)
      });
    }
  }

  cancelForm() {
    this.showForm = false;
  }
}
