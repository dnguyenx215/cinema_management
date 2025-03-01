import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MovieStatus {
  NOW_SHOWING = 'now-showing',
  COMING_SOON = 'coming-soon',
}

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  duration: number;

  @Column()
  posterUrl: string;

  @Column()
  trailerUrl: string;

  @Column('simple-array', { nullable: true })
  categories: string[];

  @Column({
    type: 'enum',
    enum: MovieStatus,
    default: MovieStatus.NOW_SHOWING,
  })
  status: MovieStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
