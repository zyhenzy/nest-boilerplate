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

  @ApiOperation({
    summary: '新建武器',
    description: '新建武器',
  })
  @Post()
  create(@Body() weapon: Weapon): Promise<Weapon> {
    return this.weaponService.create(weapon);
  }

  @ApiOperation({
    summary: '查询武器',
    description: '查询武器',
  })
  @Get()
  findAll(): Promise<Weapon[]> {
    return this.weaponService.findAll();
  }

  @ApiOperation({
    summary: '根据ID查询武器',
    description: '根据ID查询武器',
  })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Weapon | null> {
    return this.weaponService.findOne(id);
  }

  @ApiOperation({
    summary: '修改武器',
    description: '修改武器',
  })
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() weapon: Weapon,
  ): Promise<Weapon | null> {
    return this.weaponService.update(id, weapon);
  }

  @ApiOperation({
    summary: '删除武器',
    description: '删除武器',
  })
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
