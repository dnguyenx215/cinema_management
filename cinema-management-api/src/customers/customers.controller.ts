import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Post()
  create(@Body() customerData: Partial<Customer>) {
    return this.customersService.create(customerData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() customerData: Partial<Customer>) {
    return this.customersService.update(+id, customerData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
