import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hero } from './entity/hero.entity';

@Injectable()
export class HeroService {
    constructor(
        @InjectRepository(Hero)
        private readonly heroRepository: Repository<Hero>,
    ) {}

    async create(hero: Hero): Promise<Hero> {
        return await this.heroRepository.save(hero);
    }

    async findAll(): Promise<Hero[]> {
        return await this.heroRepository.find();
    }

    async findOne(id: number): Promise<Hero | null> {
        return await this.heroRepository.findOne({ where: { heroId: id } });
    }

    async update(id: number, updatedHero: Hero): Promise<Hero | null> {
        await this.heroRepository.update(id, updatedHero);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.heroRepository.delete(id);
    }
}
