import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CinemaRoom } from './cinema-room.interface';

@Injectable({
  providedIn: 'root'
})
export class CinemaRoomService {
 
  
  private apiUrl = 'http://localhost:3000/rooms'; // API endpoint

  constructor(private http: HttpClient) {}

  // Lấy danh sách phòng chiếu
  getRooms(): Observable<CinemaRoom[]> {
    return this.http.get<CinemaRoom[]>(this.apiUrl);
  }

  getRoom(id: any): Observable<CinemaRoom> {
    throw new Error('Method not implemented.');
  }

  // Thêm phòng chiếu mới
  addRoom(room: CinemaRoom): Observable<CinemaRoom> {
    return this.http.post<CinemaRoom>(this.apiUrl, room);
  }

  // Cập nhật phòng chiếu
  updateRoom(room: CinemaRoom): Observable<CinemaRoom> {
    const url = `${this.apiUrl}/${room.id}`;
    return this.http.put<CinemaRoom>(url, room);
  }

  // Xóa phòng chiếu
  deleteRoom(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
