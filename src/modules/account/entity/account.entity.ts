import { Entity, PrimaryColumn, JoinTable, ManyToMany, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Condition } from '../../condition/entity/condition.entity';

@Entity()
export class Account {
  @ApiProperty()
  @PrimaryColumn({ comment: 'ID（网易）' })
  id: string;

  @ManyToMany(() => Condition, (condition) => condition.accounts)
  @JoinTable() // 这个装饰器表示这是关系的拥有方，并且需要一个中间表
  conditions: Condition[];

  // 元数据
  @ApiProperty({
    type: 'object',
    description: 'Metadata',
    additionalProperties: true,
  })
  @Column('json', { nullable: true, comment: 'Metadata' })
  metadata: Record<string, any>;
}
