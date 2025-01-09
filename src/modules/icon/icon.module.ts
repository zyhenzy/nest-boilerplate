import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IconController } from './icon.controller';
import { IconService } from './icon.service';
import { Icon } from './entity/icon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Icon])],
  controllers: [IconController],
  providers: [IconService],
  exports: [IconService],
})
export class IconModule {}
