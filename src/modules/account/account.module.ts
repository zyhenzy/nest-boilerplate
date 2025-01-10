import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './entity/account.entity';
import { HeroModule } from '../hero/hero.module';
import { WeaponModule } from '../weapon/weapon.module';
import { ConditionModule } from '../condition/condition.module';
import { IconModule } from '../icon/icon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    forwardRef(() => ConditionModule),
    HeroModule,
    WeaponModule,
    IconModule,
  ],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
