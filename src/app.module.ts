import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeroModule } from './modules/hero/hero.module';
import { Hero } from './modules/hero/entity/hero.entity';
import { WeaponModule } from './modules/weapon/weapon.module';
import { Weapon } from './modules/weapon/entity/weapon.entity';
import { ConditionModule } from './modules/condition/condition.module';
import { Condition } from './modules/condition/entity/condition.entity';
import { Account } from './modules/account/entity/account.entity';
import { AccountModule } from './modules/account/account.module';
import { Icon } from './modules/icon/entity/icon.entity';
import { IconModule } from './modules/icon/icon.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'love20230426',
      database: 'stzb',
      entities: [Hero, Weapon, Condition, Account, Icon],
      synchronize: true,
    }),
    HeroModule,
    WeaponModule,
    ConditionModule,
    AccountModule,
    IconModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
