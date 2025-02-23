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
  roomId: number;
  availableSeats?: number;
  ticketPrice?: number;
}
