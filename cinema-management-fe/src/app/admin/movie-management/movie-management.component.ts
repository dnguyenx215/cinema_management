import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MovieService } from './movie.service';
import { Movie } from './movie.interface';

@Component({
  selector: 'app-movie-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [MovieService],
  templateUrl: './movie-management.component.html',
})
export class MovieManagementComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  searchText: string = '';

  // Biến để điều khiển form thêm/sửa
  showForm: boolean = false;
  isEditMode: boolean = false;
  // Khởi tạo đối tượng phim, lưu ý đảm bảo trường id (với trường hợp thêm mới, id có thể là 0 hoặc undefined tùy backend)
  currentMovie: Movie = { id: 0, title: '', genre: '', duration: 0, description: '' };

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.filteredMovies = data;
      },
      error: (error) => {
        console.error('Error fetching movies:', error);
      }
    });
  }

  searchMovies(text: string) {
    this.filteredMovies = this.movies.filter(movie => 
      movie.title.toLowerCase().includes(text.toLowerCase())
    );
  }

  // Mở form thêm mới
  openAddForm() {
    this.isEditMode = false;
    this.currentMovie = { id: 0, title: '', genre: '', duration: 0, description: '' };
    this.showForm = true;
  }

  // Mở form sửa với dữ liệu của phim đã chọn
  openEditForm(movie: Movie) {
    this.isEditMode = true;
    // Dùng spread để clone đối tượng tránh thay đổi trực tiếp
    this.currentMovie = { ...movie };
    this.showForm = true;
  }

  // Xử lý lưu phim (thêm hoặc cập nhật)
  saveMovie() {
    if (this.isEditMode) {
      this.movieService.updateMovie(this.currentMovie).subscribe({
        next: () => {
          // Cập nhật lại danh sách phim
          const index = this.movies.findIndex(m => m.id === this.currentMovie.id);
          if (index !== -1) {
            this.movies[index] = this.currentMovie;
          }
          this.filteredMovies = [...this.movies];
          this.showForm = false;
        },
        error: (error) => {
          console.error('Error updating movie:', error);
        }
      });
    } else {
      this.movieService.addMovie(this.currentMovie).subscribe({
        next: (newMovie : Movie) => {
          this.movies.push(newMovie);
          this.filteredMovies = [...this.movies];
          this.showForm = false;
        },
        error: (error : any) => {
          console.error('Error adding movie:', error);
        }
      });
    }
  }

  // Xóa phim sau khi xác nhận
  deleteMovie(movie: Movie) {
    if (confirm(`Bạn có chắc chắn muốn xóa phim "${movie.title}" không?`)) {
      this.movieService.deleteMovie(movie.id).subscribe({
        next: () => {
          this.movies = this.movies.filter(m => m.id !== movie.id);
          this.filteredMovies = [...this.movies];
        },
        error: (error : any) => {
          console.error('Error deleting movie:', error);
        }
      });
    }
  }

  // Hủy form
  cancelForm() {
    this.showForm = false;
  }
}
