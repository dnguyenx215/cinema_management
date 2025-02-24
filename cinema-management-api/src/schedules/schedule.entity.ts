import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { Room } from 'src/rooms/room.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  // Thời gian bắt đầu chiếu
  @Column()
  startTime: Date;

  // Thời gian kết thúc
  @Column()
  endTime: Date;

  // Có thể liên kết với Movie
  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  movie: Movie;

  // Liên kết với Room -> tuỳ ý, ví dụ:
  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  room: Room;
}
