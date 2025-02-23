import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new Error(`Customer with id ${id} not found`);
    }
    return customer;
  }

  create(customerData: Partial<Customer>): Promise<Customer> {
    const customer = this.customerRepository.create(customerData);
    return this.customerRepository.save(customer);
  }

  async update(id: number, customerData: Partial<Customer>): Promise<Customer> {
    await this.customerRepository.update(id, customerData);
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new Error(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async remove(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
