import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string; // Mã voucher

  @Column('decimal', { precision: 5, scale: 2 })
  discount: number; // % hoặc số tiền tuỳ bạn

  @Column()
  expirationDate: Date;

  @Column({ default: true })
  isActive: boolean;
}
