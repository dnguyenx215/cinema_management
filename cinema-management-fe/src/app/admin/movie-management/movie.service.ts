import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from './movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3000/movies';

  constructor(private http: HttpClient) {}

  // Lấy danh sách phim
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  // Thêm phim mới
  addMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  // Cập nhật phim
  updateMovie(movie: Movie): Observable<Movie> {
    const url = `${this.apiUrl}/${movie.id}`;
    return this.http.put<Movie>(url, movie);
  }

  // Xóa phim
  deleteMovie(movieId: number): Observable<void> {
    const url = `${this.apiUrl}/${movieId}`;
    return this.http.delete<void>(url);
  }
}
