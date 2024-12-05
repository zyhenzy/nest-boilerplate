import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeroModule } from './modules/hero/hero.module';
import { Hero } from './modules/hero/entity/hero.entity';
import { WeaponModule } from './modules/weapon/weapon.module';
import { Weapon } from './modules/weapon/entity/weapon.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'stzb',
      entities: [Hero, Weapon],
      synchronize: true,
    }),
    HeroModule,
    WeaponModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
