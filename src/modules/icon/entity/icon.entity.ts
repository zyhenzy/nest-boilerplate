import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Icon {
  @ApiProperty({ type: Number, description: '画像编码' })
  @PrimaryColumn({ type: 'int', name: 'id', comment: '画像编码' })
  id: number;

  @ApiProperty({ type: String, description: '画像名称' })
  @Column({ type: 'varchar', name: 'name', comment: '画像名称' })
  name: string;

  @ApiProperty({
    type: String,
    description: '类型 0：其他 1：动态',
  })
  @Column({
    type: 'varchar',
    name: 'type',
    comment: '类型 0：其他 1：动态',
  })
  type: string;
}
