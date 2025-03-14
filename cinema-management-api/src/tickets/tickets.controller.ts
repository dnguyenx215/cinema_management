import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get('by-schedule')
  async getTicketsBySchedule(@Query('scheduleId') scheduleId: number): Promise<Ticket[]> {
    return this.ticketsService.getTicketsBySchedule(scheduleId);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Post()
  create(@Body() ticketData: Partial<Ticket>) {
    return this.ticketsService.create(ticketData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() ticketData: Partial<Ticket>) {
    return this.ticketsService.update(+id, ticketData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
