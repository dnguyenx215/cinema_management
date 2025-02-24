import { Voucher } from 'src/vouchers/voucher.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => Voucher, { onDelete: 'CASCADE' })
  voucher: Voucher;
}
