import { Module } from '@nestjs/common';
import { ConditionController } from './condition.controller';
import { ConditionService } from './condition.service';
import { Condition } from './entity/condition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroModule } from '../hero/hero.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Condition]), AccountModule, HeroModule],
  controllers: [ConditionController],
  providers: [ConditionService],
})
export class ConditionModule {}
