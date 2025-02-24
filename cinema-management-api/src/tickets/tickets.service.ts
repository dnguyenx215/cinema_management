import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find({ relations: ['voucher'] });
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ where: { id }, relations: ['voucher'] });
    if (!ticket) {
      throw new Error(`Ticket with id ${id} not found`);
    }
    return ticket;
  }

  create(ticketData: Partial<Ticket>): Promise<Ticket> {
    const ticket = this.ticketRepository.create(ticketData);
    return this.ticketRepository.save(ticket);
  }

  async update(id: number, ticketData: Partial<Ticket>): Promise<Ticket> {
    await this.ticketRepository.update(id, ticketData);
    const ticket = await this.ticketRepository.findOne({ where: { id }, relations: ['voucher'] });
    if (!ticket) {
      throw new Error(`Ticket with id ${id} not found`);
    }
    return ticket;
  }

  async remove(id: number): Promise<void> {
    await this.ticketRepository.delete(id);
  }
}
