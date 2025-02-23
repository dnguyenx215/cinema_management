import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from './room.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Post()
  create(@Body() roomData: Partial<Room>) {
    return this.roomsService.create(roomData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() roomData: Partial<Room>) {
    return this.roomsService.update(+id, roomData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
