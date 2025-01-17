import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Hero {
  // @ApiProperty()
  // @PrimaryGeneratedColumn('uuid')
  // id: string; // uuid

  @ApiProperty({ type: Number, description: '英雄编码' })
  @PrimaryColumn({ type: 'int', name: 'id', comment: '英雄编码' })
  id: number;

  @ApiProperty({ type: String, description: '英雄名称' })
  @Column({ type: 'varchar', name: 'name', comment: '英雄名称' })
  name: string;

  @ApiProperty({
    type: String,
    description: '国家 1:汉 2：魏 3：蜀 4：吴 5：群',
  })
  @Column({
    type: 'varchar',
    name: 'country',
    comment: '国家 1:汉 2：魏 3：蜀 4：吴 5：群',
  })
  country: string;

  @ApiProperty({
    type: String,
    description: '赛季 N SP XP S3 S2',
  })
  @Column({
    type: 'varchar',
    name: 'season',
    comment: '赛季 N SP XP S3 S2',
  })
  season: string;

  @ApiProperty({ type: Number, description: '评分' })
  @Column({ type: 'int', name: 'score', comment: '评分' })
  score: number;
}
