import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({ relations: ['movie', 'room'] });
  }

  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['movie', 'room'],
    });
    if (!schedule) {
      throw new Error(`Schedule with id ${id} not found`);
    }
    return schedule;
  }

  create(scheduleData: Partial<Schedule>): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(scheduleData);
    return this.scheduleRepository.save(schedule);
  }

  async update(id: number, scheduleData: Partial<Schedule>): Promise<Schedule> {
    await this.scheduleRepository.update(id, scheduleData);
    const schedule = await this.scheduleRepository.findOne({ where: { id }, relations: ['movie', 'room'] });
    if (!schedule) {
      throw new Error(`Schedule with id ${id} not found`);
    }
    return schedule;
  }

  async remove(id: number): Promise<void> {
    await this.scheduleRepository.delete(id);
  }
}
