import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('ticket-sales-count')
  getTicketSalesCount() {
    return this.reportsService.getTicketSalesCount();
  }

  @Get('movie-count')
  getMovieCount() {
    return this.reportsService.getMovieCount();
  }

    @Get('revenue')
    getRevenue() {
        return this.reportsService.getRevenue();
    }
}
