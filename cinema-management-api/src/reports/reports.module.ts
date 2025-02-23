import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/tickets/ticket.entity';
import { Movie } from 'src/movies/movie.entity';

@Module({
    imports: [
        // Đăng ký các entity cần dùng
        TypeOrmModule.forFeature([Ticket, Movie]),
      ],
    controllers: [ReportsController],
    providers: [ReportsService],
  })
export class ReportsModule {}
