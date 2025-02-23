import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from './voucher.entity';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
  ) {}

  findAll(): Promise<Voucher[]> {
    return this.voucherRepository.find();
  }

  async findOne(id: number): Promise<Voucher> {
    const voucher = await this.voucherRepository.findOne({ where: { id } });
    if (!voucher) {
      throw new Error(`Voucher with id ${id} not found`);
    }
    return voucher;
  }

  create(voucherData: Partial<Voucher>): Promise<Voucher> {
    const voucher = this.voucherRepository.create(voucherData);
    return this.voucherRepository.save(voucher);
  }

  async update(id: number, voucherData: Partial<Voucher>): Promise<Voucher> {
    await this.voucherRepository.update(id, voucherData);
    const voucher = await this.voucherRepository.findOne({ where: { id } });
    if (!voucher) {
      throw new Error(`Voucher with id ${id} not found`);
    }
    return voucher;
  }

  async remove(id: number): Promise<void> {
    await this.voucherRepository.delete(id);
  }
}
