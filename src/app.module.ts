import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeroModule } from './hero/hero.module';
import { Hero } from './hero/entity/hero.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'stzb',
      entities: [Hero],
      synchronize: true,
    }),
    HeroModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
