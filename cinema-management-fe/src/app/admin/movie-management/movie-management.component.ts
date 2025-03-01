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

  // Biến điều khiển form thêm/sửa
  showForm: boolean = false;
  isEditMode: boolean = false;
  
  // Khởi tạo đối tượng phim với đầy đủ các trường (trailerUrl thay genre)
  currentMovie: Movie = {
    id: 0,
    title: '',
    trailerUrl: '',
    duration: 0,
    description: '',
    posterUrl: '',
    categories: [],
    status: 'now-showing'
  };

  // Sử dụng biến tạm để nhập danh mục (các thể loại phụ, phân cách bởi dấu phẩy)
  categoriesInput: string = '';

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
    this.currentMovie = {
      id: 0,
      title: '',
      trailerUrl: '',
      duration: 0,
      description: '',
      posterUrl: '',
      categories: [],
      status: 'now-showing'
    };
    this.categoriesInput = '';
    this.showForm = true;
  }

  // Mở form sửa với dữ liệu của phim đã chọn
  openEditForm(movie: Movie) {
    this.isEditMode = true;
    // Clone dữ liệu để tránh thay đổi trực tiếp
    this.currentMovie = { ...movie };
    this.categoriesInput = movie.categories ? movie.categories.join(', ') : '';
    this.showForm = true;
  }

  // Xử lý lưu phim (thêm hoặc cập nhật)
  saveMovie() {
    // Chuyển đổi danh mục từ chuỗi thành mảng
    this.currentMovie.categories = this.categoriesInput
      ? this.categoriesInput.split(',').map(cat => cat.trim())
      : [];

    if (this.isEditMode) {
      this.movieService.updateMovie(this.currentMovie).subscribe({
        next: () => {
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
        next: (newMovie: Movie) => {
          this.movies.push(newMovie);
          this.filteredMovies = [...this.movies];
          this.showForm = false;
        },
        error: (error: any) => {
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
        error: (error: any) => {
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
