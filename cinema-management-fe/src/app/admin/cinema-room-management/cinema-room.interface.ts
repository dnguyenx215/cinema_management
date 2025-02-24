export interface CinemaRoom {
    id?: number;
    name: string;
    seatCount: number;
    type: string; // 2D, 3D, IMAX, ...
    // Các trường bổ sung do front-end tính (nếu cần)
    status?: string;       // Ví dụ: 'Đang hoạt động', 'Đang bảo trì'
   // nextShowtime?: string; // Ví dụ: "14:30 - Avengers: Endgame"
  }
  