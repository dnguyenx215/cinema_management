import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CinemaRoomService } from './cinema-room.service';
import { CinemaRoom } from './cinema-room.interface';

@Component({
  selector: 'app-cinema-room-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [CinemaRoomService],
  templateUrl: './cinema-room-management.component.html',
})
export class CinemaRoomManagementComponent implements OnInit {
  cinemaRooms: CinemaRoom[] = [];
  filteredCinemaRooms: CinemaRoom[] = [];
  searchText: string = '';

  // Các số liệu thống kê
  totalRooms: number = 0;
  activeRooms: number = 0;
  maintenanceRooms: number = 0;
  nextShowTotal: number = 0;

  // Các biến điều khiển modal form
  showForm: boolean = false;
  isEditMode: boolean = false;
  currentRoom: CinemaRoom = {
    id: 0,
    name: '',
    seatCount: 0,
    type: '2D',
    status: 'Đang hoạt động'
  };

  constructor(private cinemaRoomService: CinemaRoomService) {}

  ngOnInit(): void {
    this.loadCinemaRooms();
  }

  loadCinemaRooms() {
    this.cinemaRoomService.getRooms().subscribe({
      next: (data: CinemaRoom[]) => {
        // Nếu backend không cung cấp status, gán mặc định 'Đang hoạt động'
        this.cinemaRooms = data.map(room => ({
          ...room,
          status: room.status ? room.status : 'Đang hoạt động'
        }));
        this.filteredCinemaRooms = this.cinemaRooms;
        this.computeStats();
      },
      error: (error) => console.error('Error fetching cinema rooms:', error)
    });
  }

  computeStats() {
    this.totalRooms = this.cinemaRooms.length;
    this.activeRooms = this.cinemaRooms.filter(room => room.status === 'Đang hoạt động').length;
    this.maintenanceRooms = this.cinemaRooms.filter(room => room.status === 'Đang bảo trì').length;
    this.nextShowTotal = this.cinemaRooms.filter(room => room.nextShowtime).length;
  }

  searchRooms(text: string) {
    this.filteredCinemaRooms = this.cinemaRooms.filter(room =>
      room.name.toLowerCase().includes(text.toLowerCase())
    );
  }

  openAddForm() {
    this.isEditMode = false;
    this.currentRoom = {
      id: 0,
      name: '',
      seatCount: 0,
      type: '2D',
      status: 'Đang hoạt động'
    };
    this.showForm = true;
  }

  openEditForm(room: CinemaRoom) {
    this.isEditMode = true;
    this.currentRoom = { ...room };
    this.showForm = true;
  }

  saveRoom() {
    if (this.isEditMode) {
      this.cinemaRoomService.updateRoom(this.currentRoom).subscribe({
        next: (updatedRoom) => {
          const index = this.cinemaRooms.findIndex(r => r.id === updatedRoom.id);
          if (index !== -1) {
            this.cinemaRooms[index] = updatedRoom;
          }
          this.filteredCinemaRooms = [...this.cinemaRooms];
          this.computeStats();
          this.showForm = false;
        },
        error: (error) => console.error('Error updating room:', error)
      });
    } else {
      this.cinemaRoomService.addRoom(this.currentRoom).subscribe({
        next: (newRoom) => {
          this.cinemaRooms.push(newRoom);
          this.filteredCinemaRooms = [...this.cinemaRooms];
          this.computeStats();
          this.showForm = false;
        },
        error: (error) => console.error('Error adding room:', error)
      });
    }
  }

  deleteRoom(room: CinemaRoom) {
    if (confirm(`Bạn có chắc chắn muốn xóa phòng "${room.name}" không?`)) {
      this.cinemaRoomService.deleteRoom(room.id!).subscribe({
        next: () => {
          this.cinemaRooms = this.cinemaRooms.filter(r => r.id !== room.id);
          this.filteredCinemaRooms = [...this.cinemaRooms];
          this.computeStats();
        },
        error: (error) => console.error('Error deleting room:', error)
      });
    }
  }

  cancelForm() {
    this.showForm = false;
  }
}
