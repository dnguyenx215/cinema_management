import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new Error(`Movie with id ${id} not found`);
    }
    return movie;
  }

  create(movieData: Partial<Movie>): Promise<Movie> {
    const movie = this.movieRepository.create(movieData);
    return this.movieRepository.save(movie);
  }

  async update(id: number, movieData: Partial<Movie>): Promise<Movie> {
    await this.movieRepository.update(id, movieData);
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new Error(`Movie with id ${id} not found`);
    }
    return movie;
  }

  async remove(id: number): Promise<void> {
    await this.movieRepository.delete(id);
  }
}
