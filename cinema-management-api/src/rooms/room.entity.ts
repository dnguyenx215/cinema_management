import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  status: string;

  @Column()
  seatCount: number;

  @Column({ default: '2D' })
  type: string; // 2D, 3D, IMAX, v.v.
}
