import { CinemaRoom } from "../cinema-room-management/cinema-room.interface";

export interface Schedule {
  id?: number;
  startTime: string;
  endTime: string;
  movie: {
    id: number;
    title?: string;
    genre?: string;
    description?: string;
    duration?: number;
  } | null;
  room: {
    id?: number;
    name?: string;
    seatCount?: number;
    type?: string; // 2D, 3D, IMAX, ...
    // Các trường bổ sung do front-end tính (nếu cần)
    status?: string;
  } | null;
  availableSeats?: number;
  ticketPrice?: number;
}
