import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Post()
  create(@Body() movieData: Partial<Movie>) {
    return this.moviesService.create(movieData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() movieData: Partial<Movie>) {
    return this.moviesService.update(+id, movieData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
