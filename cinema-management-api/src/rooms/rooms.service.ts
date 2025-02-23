import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new Error(`Room with id ${id} not found`);
    }
    return room;
  }

  create(roomData: Partial<Room>): Promise<Room> {
    const room = this.roomRepository.create(roomData);
    return this.roomRepository.save(room);
  }

  async update(id: number, roomData: Partial<Room>): Promise<Room> {
    await this.roomRepository.update(id, roomData);
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new Error(`Room with id ${id} not found`);
    }
    return room;
  }

  async remove(id: number): Promise<void> {
    await this.roomRepository.delete(id);
  }
}
