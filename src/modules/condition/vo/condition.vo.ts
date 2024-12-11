import { Condition } from '../entity/condition.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ConditionVO extends Condition {
  @ApiProperty({ type: [String], description: '英雄名称' })
  heroNames: string[];
}
