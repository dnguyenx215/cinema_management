import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VoucherService } from './voucher.service';
import { Voucher } from './voucher.interface';

@Component({
  selector: 'app-voucher-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './voucher-management.component.html',
  providers: [VoucherService]
})
export class VoucherManagementComponent implements OnInit {
  vouchers: Voucher[] = [];
  filteredVouchers: Voucher[] = [];
  searchText: string = '';

  totalVouchers: number = 0;
  activeVouchers: number = 0;
  expiredVouchers: number = 0;

  // Biến điều khiển modal form
  showForm: boolean = false;
  isEditMode: boolean = false;
  currentVoucher: Voucher = {
    code: '',
    discount: 0,
    expirationDate: '',
    isActive: true
  };

  constructor(private voucherService: VoucherService) {}

  ngOnInit(): void {
    this.loadVouchers();
  }

  loadVouchers() {
    this.voucherService.getVouchers().subscribe({
      next: (data: Voucher[]) => {
        this.vouchers = data;
        this.filteredVouchers = data;
        this.computeStats();
      },
      error: (error) => console.error('Error fetching vouchers:', error)
    });
  }

  computeStats() {
    this.totalVouchers = this.vouchers.length;
    const now = new Date();
    this.activeVouchers = this.vouchers.filter(v => v.isActive && new Date(v.expirationDate) >= now).length;
    this.expiredVouchers = this.vouchers.filter(v => new Date(v.expirationDate) < now).length;
  }

  searchVouchers(text: string) {
    this.filteredVouchers = this.vouchers.filter(voucher =>
      voucher.code.toLowerCase().includes(text.toLowerCase())
    );
  }

  openAddForm() {
    this.isEditMode = false;
    this.currentVoucher = {
      code: '',
      discount: 0,
      expirationDate: '',
      isActive: true
    };
    this.showForm = true;
  }

  openEditForm(voucher: Voucher) {
    this.isEditMode = true;
    // Chuyển expirationDate thành dạng YYYY-MM-DD cho input type="date"
    this.currentVoucher = {
      ...voucher,
      expirationDate: new Date(voucher.expirationDate).toISOString().split('T')[0]
    };
    this.showForm = true;
  }

  saveVoucher() {
    if (this.isEditMode) {
      this.voucherService.updateVoucher(this.currentVoucher).subscribe({
        next: (updatedVoucher) => {
          const index = this.vouchers.findIndex(v => v.id === updatedVoucher.id);
          if (index !== -1) {
            this.vouchers[index] = updatedVoucher;
          }
          this.filteredVouchers = [...this.vouchers];
          this.computeStats();
          this.showForm = false;
        },
        error: (error) => console.error('Error updating voucher:', error)
      });
    } else {
      this.voucherService.addVoucher(this.currentVoucher).subscribe({
        next: (newVoucher) => {
          this.vouchers.push(newVoucher);
          this.filteredVouchers = [...this.vouchers];
          this.computeStats();
          this.showForm = false;
        },
        error: (error) => console.error('Error adding voucher:', error)
      });
    }
  }

  deleteVoucher(voucher: Voucher) {
    if (confirm(`Bạn có chắc muốn xóa voucher "${voucher.code}" không?`)) {
      this.voucherService.deleteVoucher(voucher.id!).subscribe({
        next: () => {
          this.vouchers = this.vouchers.filter(v => v.id !== voucher.id);
          this.filteredVouchers = [...this.vouchers];
          this.computeStats();
        },
        error: (error) => console.error('Error deleting voucher:', error)
      });
    }
  }

  cancelForm() {
    this.showForm = false;
  }
}
