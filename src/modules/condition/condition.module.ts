import { Module } from '@nestjs/common';
import { ConditionController } from './condition.controller';
import { ConditionService } from './condition.service';
import { Condition } from './entity/condition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Condition])],
  controllers: [ConditionController],
  providers: [ConditionService],
})
export class ConditionModule {}
