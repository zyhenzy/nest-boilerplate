import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weapon } from './entity/weapon.entity';
import { getAllWeapon } from './utils';

@Injectable()
export class WeaponService {
  constructor(
    @InjectRepository(Weapon)
    private readonly weaponRepository: Repository<Weapon>,
  ) {}

  async create(weapon: Weapon): Promise<Weapon> {
    return await this.weaponRepository.save(weapon);
  }

  async findAll(): Promise<Weapon[]> {
    return await this.weaponRepository.find();
  }

  async findOne(id: number): Promise<Weapon | null> {
    return await this.weaponRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updatedWeapon: Weapon): Promise<Weapon | null> {
    await this.weaponRepository.update(id, updatedWeapon);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.weaponRepository.delete(id);
  }

  async bulkImport(): Promise<Weapon[]> {
    const weapons: Weapon[] = getAllWeapon();
    console.log(weapons);
    debugger;
    const weaponEntities = this.weaponRepository.create(weapons);
    return await this.weaponRepository.save(weaponEntities);
  }
}
