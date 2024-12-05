import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Weapon {
  @ApiProperty({ type: Number, description: 'ID' })
  @PrimaryColumn({ type: 'int', name: 'weaponId', comment: 'ID' })
  weaponId: number;

  @ApiProperty({ type: Number, description: '武器编码' })
  @Column({ type: 'int', name: 'gearId', comment: '武器编码' })
  gearId: number;

  @ApiProperty({ type: String, description: '武器名称' })
  @Column({ type: 'varchar', name: 'name', comment: '武器名称' })
  name: string;

  @ApiProperty({ type: Number, description: '锻造编码' })
  @Column({ type: 'int', name: 'featureId', comment: '锻造编码' })
  featureId: number;

  @ApiProperty({ type: String, description: '锻造名称' })
  @Column({ type: 'varchar', name: 'featureName', comment: '锻造名称' })
  featureName: string;

  @ApiProperty({ type: Number, description: '价格' })
  @Column({ type: 'int', name: 'price', comment: '价格' })
  price: number;
}
