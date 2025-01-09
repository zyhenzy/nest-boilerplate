import { Controller } from '@nestjs/common';
import { Get, Post } from '@nestjs/common';
import { IconService } from './icon.service';
import { Icon } from './entity/icon.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('Icon')
export class IconController {
  constructor(private readonly IconService: IconService) {}

  @ApiOperation({
    summary: '查询画像',
    description: '查询画像',
  })
  @Get()
  async findAll(): Promise<Icon[]> {
    return await this.IconService.findAll();
  }

  @ApiOperation({
    summary: '导入画像',
    description: '导入画像',
  })
  @Post('bulk')
  async bulkImport(): Promise<Icon[]> {
    return await this.IconService.bulkImport();
  }
}
