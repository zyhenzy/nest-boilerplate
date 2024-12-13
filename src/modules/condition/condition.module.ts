import { Module } from '@nestjs/common';
import { ConditionController } from './condition.controller';
import { ConditionService } from './condition.service';
import { Condition } from './entity/condition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroModule } from '../hero/hero.module';
import { AccountModule } from '../account/account.module';
import { WeaponModule } from '../weapon/weapon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Condition]),
    AccountModule,
    HeroModule,
    WeaponModule,
  ],
  controllers: [ConditionController],
  providers: [ConditionService],
})
export class ConditionModule {}
