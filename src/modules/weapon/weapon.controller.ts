import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { WeaponService } from './weapon.service';
import { Weapon } from './entity/weapon.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('weapon')
export class WeaponController {
  constructor(private readonly weaponService: WeaponService) {}

  @Post()
  create(@Body() weapon: Weapon): Promise<Weapon> {
    return this.weaponService.create(weapon);
  }

  @Get()
  findAll(): Promise<Weapon[]> {
    return this.weaponService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Weapon | null> {
    return this.weaponService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() weapon: Weapon,
  ): Promise<Weapon | null> {
    return this.weaponService.update(id, weapon);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.weaponService.remove(id);
  }

  @ApiOperation({
    summary: '导入文件',
    description: '导入文件',
  })
  @Post('bulk')
  async bulkImport(): Promise<Weapon[]> {
    return await this.weaponService.bulkImport();
  }
}
