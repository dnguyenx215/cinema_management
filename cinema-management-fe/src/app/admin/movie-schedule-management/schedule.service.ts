import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule } from './schedule.interface';

@Injectable({
    providedIn: 'root'
  })
  export class ScheduleService {
    private apiUrl = 'http://localhost:3000/schedules';
  
    constructor(private http: HttpClient) {}
  
    getSchedules(): Observable<Schedule[]> {
      return this.http.get<Schedule[]>(this.apiUrl);
    }
  
    addSchedule(schedule: Schedule): Observable<Schedule> {
      return this.http.post<Schedule>(this.apiUrl, schedule);
    }
  
    updateSchedule(schedule: Schedule): Observable<Schedule> {
      const url = `${this.apiUrl}/${schedule.id}`;
      return this.http.put<Schedule>(url, schedule);
    }
  
    deleteSchedule(id: number): Observable<void> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.delete<void>(url);
    }
  }