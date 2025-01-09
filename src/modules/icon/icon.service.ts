import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Icon } from './entity/icon.entity';
import { getAllIcon } from './utils';

@Injectable()
export class IconService {
  constructor(
    @InjectRepository(Icon)
    private readonly iconRepository: Repository<Icon>,
  ) {}

  async findAll(): Promise<Icon[]> {
    return await this.iconRepository.find();
  }

  async bulkImport(): Promise<Icon[]> {
    const icons: Icon[] = getAllIcon();
    const iconEntities = this.iconRepository.create(icons);
    return await this.iconRepository.save(iconEntities);
  }
}
