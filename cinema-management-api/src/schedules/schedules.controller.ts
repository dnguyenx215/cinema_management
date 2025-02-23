import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedule } from './schedule.entity';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(+id);
  }

  @Post()
  create(@Body() scheduleData: Partial<Schedule>) {
    return this.schedulesService.create(scheduleData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() scheduleData: Partial<Schedule>) {
    return this.schedulesService.update(+id, scheduleData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
}
