import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from './ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  
  private apiUrl = 'http://localhost:3000/tickets';

  constructor(private http: HttpClient) {}

  // Lấy danh sách vé
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  getTicketsBySchedule(scheduleId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl + '/by-schedule?scheduleId=' + scheduleId);
  }
  

  // Thêm vé mới
  addTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  // Cập nhật vé
  updateTicket(ticket: Ticket): Observable<Ticket> {
    const url = `${this.apiUrl}/${ticket.id}`;
    return this.http.put<Ticket>(url, ticket);
  }

  // Xóa vé
  deleteTicket(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
