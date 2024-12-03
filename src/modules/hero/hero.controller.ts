import { Controller } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { HeroService } from './hero.service';
import { Hero } from './entity/hero.entity';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post()
  async create(@Body() hero: Hero): Promise<Hero> {
    return await this.heroService.create(hero);
  }

  @Get()
  async findAll(): Promise<Hero[]> {
    return await this.heroService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Hero | null> {
    return await this.heroService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedHero: Hero,
  ): Promise<Hero | null> {
    return await this.heroService.update(id, updatedHero);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.heroService.remove(id);
  }
}
