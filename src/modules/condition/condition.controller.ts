import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ConditionService } from './condition.service';
import { Condition } from './entity/condition.entity';
import { ApiOperation } from '@nestjs/swagger';
import { CookieDto } from './dto/cookie.dto';

@Controller('condition')
export class ConditionController {
  constructor(private readonly conditionService: ConditionService) {}

  @ApiOperation({
    summary: '新建检索条件',
    description: '新建检索条件',
  })
  @Post()
  async create(@Body() condition: Condition): Promise<Condition> {
    return this.conditionService.create(condition);
  }

  @ApiOperation({
    summary: '查询检索条件',
    description: '查询检索条件',
  })
  @Get()
  async findAll(): Promise<Condition[]> {
    return this.conditionService.findAll();
  }

  @ApiOperation({
    summary: '根据ID查询检索条件',
    description: '根据ID查询检索条件',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Condition | null> {
    return this.conditionService.findOne(id);
  }

  @ApiOperation({
    summary: '修改检索条件',
    description: '修改检索条件',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatedCondition: Condition,
  ): Promise<Condition | null> {
    return this.conditionService.update(id, updatedCondition);
  }

  @ApiOperation({
    summary: '删除检索条件',
    description: '删除检索条件',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.conditionService.remove(id);
  }

  @ApiOperation({
    summary: '设置cookie',
    description: '设置cookie',
  })
  @Post('/setCookie')
  setCookie(@Body() params: CookieDto) {
    return this.conditionService.setCookie(params.cookie);
  }

  @ApiOperation({
    summary: '执行检索条件',
    description: '执行检索条件',
  })
  @Post('/perform')
  perform(@Body() condition: Condition) {
    return this.conditionService.perform(condition);
  }
}
