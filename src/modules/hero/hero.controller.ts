import { Controller } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { HeroService } from './hero.service';
import { Hero } from './entity/hero.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @ApiOperation({
    summary: '新建英雄',
    description: '新建英雄',
  })
  @Post()
  async create(@Body() hero: Hero): Promise<Hero> {
    return await this.heroService.create(hero);
  }

  @ApiOperation({
    summary: '查询英雄',
    description: '查询英雄',
  })
  @Get()
  async findAll(): Promise<Hero[]> {
    return await this.heroService.findAll();
  }

  @ApiOperation({
    summary: '根据ID查询英雄',
    description: '根据ID查询英雄',
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Hero | null> {
    return await this.heroService.findOne(id);
  }

  @ApiOperation({
    summary: '修改英雄',
    description: '修改英雄',
  })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedHero: Hero,
  ): Promise<Hero | null> {
    return await this.heroService.update(id, updatedHero);
  }

  @ApiOperation({
    summary: '删除英雄',
    description: '删除英雄',
  })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.heroService.remove(id);
  }

  @ApiOperation({
    summary: '导入文件',
    description: '导入文件',
  })
  @Post('bulk')
  async bulkImport(): Promise<Hero[]> {
    return await this.heroService.bulkImport();
  }
}
