import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { Voucher } from './voucher.entity';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get()
  findAll() {
    return this.vouchersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vouchersService.findOne(+id);
  }

  @Post()
  create(@Body() voucherData: Partial<Voucher>) {
    return this.vouchersService.create(voucherData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() voucherData: Partial<Voucher>) {
    return this.vouchersService.update(+id, voucherData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vouchersService.remove(+id);
  }
}
