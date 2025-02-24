import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CustomerService } from './customer.service';
import { Customer } from './customer.interface';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './customer-management.component.html',
  providers: [CustomerService]
})
export class CustomerManagementComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchText: string = '';

  totalCustomers: number = 0;

  // Biến điều khiển modal form
  showForm: boolean = false;
  isEditMode: boolean = false;
  currentCustomer: Customer = {
    name: '',
    email: '',
    phone: ''
  };

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
        this.filteredCustomers = data;
        this.totalCustomers = data.length;
      },
      error: (error) => console.error('Error fetching customers:', error)
    });
  }

  searchCustomers(text: string) {
    this.filteredCustomers = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(text.toLowerCase()) ||
      customer.email.toLowerCase().includes(text.toLowerCase()) ||
      customer.phone.toLowerCase().includes(text.toLowerCase())
    );
  }

  openAddForm() {
    this.isEditMode = false;
    this.currentCustomer = {
      name: '',
      email: '',
      phone: ''
    };
    this.showForm = true;
  }

  openEditForm(customer: Customer) {
    this.isEditMode = true;
    this.currentCustomer = { ...customer };
    this.showForm = true;
  }

  saveCustomer() {
    if (this.isEditMode) {
      this.customerService.updateCustomer(this.currentCustomer).subscribe({
        next: (updatedCustomer) => {
          const index = this.customers.findIndex(c => c.id === updatedCustomer.id);
          if (index !== -1) {
            this.customers[index] = updatedCustomer;
          }
          this.filteredCustomers = [...this.customers];
          this.showForm = false;
        },
        error: (error) => console.error('Error updating customer:', error)
      });
    } else {
      this.customerService.addCustomer(this.currentCustomer).subscribe({
        next: (newCustomer) => {
          this.customers.push(newCustomer);
          this.filteredCustomers = [...this.customers];
          this.totalCustomers = this.customers.length;
          this.showForm = false;
        },
        error: (error) => console.error('Error adding customer:', error)
      });
    }
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customer.name}" không?`)) {
      this.customerService.deleteCustomer(customer.id!).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.id !== customer.id);
          this.filteredCustomers = [...this.customers];
          this.totalCustomers = this.customers.length;
        },
        error: (error) => console.error('Error deleting customer:', error)
      });
    }
  }

  cancelForm() {
    this.showForm = false;
  }
}
