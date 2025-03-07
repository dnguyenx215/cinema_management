// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Customer } from '../customers/customer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // Giá trị mặc định là 'user', admin có giá trị 'admin'
  @Column({ default: 'user' })
  role: string;

  @OneToOne(() => Customer, { nullable: true })
  @JoinColumn()
  customer: Customer;
}
