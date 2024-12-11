import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/modules/account/entity/account.entity';

@Entity()
export class Condition {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid

  @ManyToMany(() => Account, (account) => account.conditions)
  accounts: Account[];

  @ApiProperty({ type: Number, description: '最小金额' })
  @Column({ type: 'int', name: 'priceMin', comment: '最小金额' })
  priceMin: number;

  @ApiProperty({ type: Number, description: '最大金额' })
  @Column({ type: 'int', name: 'priceMax', comment: '最大金额' })
  priceMax: number;

  @ApiProperty({
    type: String,
    description: '公示期 0：公示期 1：非公示期 2 所有',
  })
  @Column({
    type: 'varchar',
    name: 'passFairShow',
    comment: '公示期 0：公示期 1：非公示期 2 所有',
  })
  passFairShow: string;

  @ApiProperty({ type: [String], description: '英雄ID(","分割)' })
  @Column({
    type: 'simple-array',
    name: 'cardHeroId',
    comment: '英雄ID(","分割)',
  })
  cardHeroId: string[];

  @ApiProperty({ type: [String], description: '战法ID(","分割)' })
  @Column({
    type: 'simple-array',
    name: 'skillId',
    comment: '战法ID(","分割)',
  })
  skillId: string[];

  @ApiProperty({ type: Number, description: '进阶' })
  @Column({ type: 'int', name: 'advanceNum', comment: '进阶' })
  advanceNum: number;

  @ApiProperty({ type: Boolean, description: '试师' })
  @Column({ type: 'boolean', name: 'apprentice', comment: '试师' })
  apprentice: boolean;

  @ApiProperty({ type: String, description: '备注' })
  @Column({ type: 'varchar', name: 'remark', comment: '备注' })
  remark: string; // 备注

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
