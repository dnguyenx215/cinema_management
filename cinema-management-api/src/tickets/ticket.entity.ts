import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scheduleId: number;

  @Column()
  customerId: number;

  @Column()
  seatNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'booked' }) // booked, canceled, used
  status: string;
}
