import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';
import { Movie } from '../movies/movie.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  // Ví dụ: Thống kê số lượng vé bán ra
  async getTicketSalesCount(): Promise<number> {
    return this.ticketRepository.count();
  }

  // Ví dụ: Thống kê số phim
  async getMovieCount(): Promise<number> {
    return this.movieRepository.count();
  }

    // Ví dụ: Thống kê doanh thu
    async getRevenue(): Promise<number> {
        const tickets = await this.ticketRepository.find();
        return tickets.reduce((acc, ticket) => acc + ticket.price, 0);
    }
}
