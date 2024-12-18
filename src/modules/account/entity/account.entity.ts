import { Entity, PrimaryColumn, JoinTable, ManyToMany, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Condition } from '../../condition/entity/condition.entity';
import { AccountHero } from './accountHero';
import { delDuplication } from '../util';
import { Weapon } from '../../weapon/entity/weapon.entity';
import { Hero } from '../../hero/entity/hero.entity';
import { AccountWeapon } from './accountWeapon';

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
    description: 'meta',
    additionalProperties: true,
  })
  @Column('json', { nullable: true, comment: 'meta' })
  meta: Record<string, any>;

  @ApiProperty({
    type: Number,
  })
  @Column({ type: 'int', name: 'price', comment: '标价' })
  price: number;

  @ApiProperty({
    type: Number,
  })
  @Column({
    type: 'int',
    name: 'intermediaryPrice',
    comment: '中介价格',
    default: 0,
  })
  intermediaryPrice: number;

  @ApiProperty({ type: [AccountHero] })
  @Column({ type: 'simple-json', name: 'heroList', comment: '武将列表' })
  heroList: AccountHero[];

  @ApiProperty({ type: [AccountWeapon] })
  @Column({ type: 'simple-json', name: 'weaponList', comment: '武器列表' })
  weaponList: AccountWeapon[];

  @ApiProperty({
    type: Number,
  })
  @Column({ type: 'int', name: 'score', comment: '综合分数', default: 0 })
  score: number;

  @ApiProperty({
    type: Number,
  })
  @Column({ type: 'int', name: 'heroScore', comment: '武将分数', default: 0 })
  heroScore: number;

  @ApiProperty({
    type: Number,
  })
  @Column({
    type: 'int',
    name: 'seasonScore',
    comment: 'S赛季分数',
    default: 0,
  })
  seasonScore: number;

  /**
   * 创建账号
   * @param meta 账号元数据
   * @param heroAll 所有英雄，为了计算分数
   * @param weaponAll 所有武器，为了获取武器价格
   */
  static create(meta: any, heroAll: Hero[], weaponAll: Weapon[]): Account {
    const account = new Account();
    const _meta = meta;
    let equip_desc_obj;
    try {
      console.log(typeof _meta.equip_desc);
      equip_desc_obj = JSON.parse(_meta.equip_desc);
    } catch (error) {
      console.error('Failed to parse equip_desc:', error);
      equip_desc_obj = { card: [], gear: [] }; // 默认值为空对象或根据需要处理
    }
    account.id = _meta.game_ordersn;
    account.meta = _meta;
    account.price = _meta.price;
    // todo:测试插入英雄是否有效
    account.heroList = delDuplication(
      equip_desc_obj.card.map((i: any) => new AccountHero(i)),
    );
    account.weaponList = equip_desc_obj.gear.map(
      (i: any) => new AccountWeapon(i),
    );
    account.computeHeroScore(heroAll);
    account.computeWeaponScore(weaponAll);
    account.computeScore();
    // console.log(account);
    return account;
  }

  /**
   * 计算武将分数
   */
  computeHeroScore(heroAll: Hero[]) {
    this.heroScore = 0;
    this.seasonScore = 0;
    this.heroList.forEach((accountHero) => {
      const findHero = heroAll.find((h) => h.id === accountHero.id);
      if (findHero) {
        const num = findHero.score * accountHero.advanceNum;
        this.heroScore += num;
        if (findHero.season !== 'XP') {
          this.seasonScore += num;
        }
      }
    });
  }

  computeWeaponScore(weaponAll: Weapon[]) {}

  computeScore() {
    this.score = 0;
    this.score += this.heroScore;
  }
}
