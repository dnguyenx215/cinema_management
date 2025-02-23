import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.interface';
import { Movie } from '../movie-management/movie.interface';
import { MovieService } from '../movie-management/movie.service';


@Component({
  selector: 'app-movie-schedule-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [ScheduleService, MovieService],
  templateUrl: './movie-schedule-management.component.html',
})
export class MovieScheduleManagementComponent implements OnInit {
  schedules: Schedule[] = [];
  filteredSchedules: Schedule[] = [];
  searchText: string = '';

  showForm: boolean = false;
  isEditMode: boolean = false;
  currentSchedule: Schedule = {
    id: 0,
    startTime: '',
    endTime: '',
    movie: { id: 0 },
    roomId: 0
  };

  // Binding riêng cho ngày và giờ của lịch chiếu
  scheduleDate: string = '';
  scheduleTime: string = '';

  movies: Movie[] = [];
  // Danh sách rạp, có thể thay bằng dữ liệu từ BE
  rooms: number[] = [1, 2, 3];

  constructor(private scheduleService: ScheduleService, private movieService: MovieService) {}

  ngOnInit() {
    this.loadSchedules();
    this.loadMovies();
  }

  loadSchedules() {
    this.scheduleService.getSchedules().subscribe({
      next: (data) => {
        this.schedules = data.map(schedule => ({
          ...schedule,
          movie: schedule.movie ? schedule.movie : { id: 0 }
        }));
        this.filteredSchedules = [...this.schedules];
      },
      error: (error) => console.error('Error fetching schedules:', error)
    });
  }
  

  loadMovies() {
    this.movieService.getMovies().subscribe({
      next: (data : any) => {
        this.movies = data;
      },
      error: (error : any) => console.error('Error fetching movies:', error)
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
      roomId: 0
    };
    this.scheduleDate = '';
    this.scheduleTime = '';
    this.showForm = true;
  }

  openEditForm(schedule: Schedule) {
    this.isEditMode = true;
    this.currentSchedule = {
      ...schedule,
      movie: schedule.movie ? { id: schedule.movie.id } : { id: 0 }
    };
    const dt = new Date(schedule.startTime);
    this.scheduleDate = dt.toISOString().split('T')[0];
    this.scheduleTime = dt.toTimeString().split(':').slice(0,2).join(':');
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
  
    if (this.isEditMode) {
      this.scheduleService.updateSchedule(this.currentSchedule).subscribe({
        next: (updatedSchedule) => {
          // Nếu movie bị null hoặc thiếu thông tin, gán lại từ danh sách movies
          if (!updatedSchedule.movie || !updatedSchedule.movie.title) {
            const fullMovie = this.movies.find(m => m.id === this.currentSchedule.movie!.id);
            if (fullMovie) {
              updatedSchedule.movie = fullMovie;
            }
          }
          const index = this.schedules.findIndex(s => s.id === updatedSchedule.id);
          if (index !== -1) {
            this.schedules[index] = { ...updatedSchedule };
          }
          this.filteredSchedules = [...this.schedules];
          this.showForm = false;
        },
        error: (error) => console.error('Error updating schedule:', error)
      });
    } else {
      this.scheduleService.addSchedule(this.currentSchedule).subscribe({
        next: (newSchedule) => {
          // Nếu API trả về newSchedule với movie null hoặc thiếu thông tin, gán lại từ danh sách movies
          if (!newSchedule.movie || !newSchedule.movie.title) {
          
            
            const fullMovie = this.movies.find(m => m.id === Number(this.currentSchedule.movie!.id));
            
            
            
            if (fullMovie) {
              newSchedule.movie = fullMovie;
            
              
            }
          }
          this.schedules.push(newSchedule);
          this.filteredSchedules = [...this.schedules];
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
