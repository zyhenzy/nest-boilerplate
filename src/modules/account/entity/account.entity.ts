import {
  Entity,
  PrimaryColumn,
  JoinTable,
  ManyToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Condition } from '../../condition/entity/condition.entity';
import { AccountHero } from './accountHero';
import { delDuplication } from '../util';
import { Weapon } from '../../weapon/entity/weapon.entity';
import { Hero } from '../../hero/entity/hero.entity';
import { AccountWeapon } from './accountWeapon';
import { AccountSkill } from './accountSkill';
import { eightSkillId, fiveSkillId, threeSkillId } from '../const/skill';

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
    name: 'heroPrice',
    comment: '英雄价格',
    default: 0,
  })
  heroPrice: number;

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

  @ApiProperty({
    type: Number,
  })
  @Column({ type: 'int', name: 'weaponPrice', comment: '武器标价', default: 0 })
  weaponPrice: number;

  @ApiProperty({ type: [AccountHero] })
  @Column({ type: 'simple-json', name: 'heroList', comment: '武将列表' })
  heroList: AccountHero[];

  @ApiProperty({
    type: [String],
  })
  @Column({
    type: 'simple-array',
    name: 'tag',
    comment: '标签',
  })
  tag: string[];

  @ApiProperty({
    type: [String],
  })
  @Column({
    type: 'simple-array',
    name: 'heroTag',
    comment: '武将标签',
  })
  heroTag: string[];

  @ApiProperty({ type: [AccountSkill] })
  @Column({ type: 'simple-json', name: 'skillList', comment: '战法列表' })
  skillList: AccountSkill[];

  @ApiProperty({
    type: [String],
  })
  @Column({
    type: 'simple-array',
    name: 'skillTag',
    comment: '战法标签',
  })
  skillTag: string[];

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
    name: 'skillScore',
    comment: '战法分数',
    default: 0,
  })
  skillScore: number;

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

  @ApiProperty({
    type: Number,
  })
  @Column({
    type: 'float',
    name: 'scoreRate',
    comment: '综合性价比',
    default: 0,
  })
  scoreRate: number;

  @ApiProperty({
    type: Number,
  })
  @Column({
    type: 'float',
    name: 'seasonScoreRate',
    comment: 'S赛季性价比',
    default: 0,
  })
  seasonScoreRate: number;

  @ApiProperty({
    type: Number,
  })
  @Column({
    type: 'int',
    name: 'status',
    comment: '状态（0已取回 1未上架 2在售 6已售出）',
    default: 0,
  })
  status: number;

  @ApiProperty({ type: Boolean })
  @Column({
    type: 'boolean',
    name: 'apprentice',
    comment: '试师',
    default: false,
  })
  apprentice: boolean;

  @ApiProperty({
    type: String,
  })
  @Column({ type: 'varchar', name: 'remark', comment: '备注', default: '' })
  remark: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  /**
   * 创建账号
   * @param meta 账号元数据
   * @param heroAll 所有英雄，为了计算分数
   * @param weaponAll 所有武器，为了获取武器价格
   */
  static create(meta: any, heroAll: Hero[], weaponAll: Weapon[]): Account {
    const account = new Account();
    const _meta = meta;
    const equip_desc_obj = JSON.parse(_meta.equip_desc);
    account.id = _meta.game_ordersn;
    account.meta = _meta;
    account.price = _meta.price;
    account.status = meta.status;
    account.heroList = delDuplication(
      equip_desc_obj.card.map((i: any) => new AccountHero(i)),
    );
    account.skillList = equip_desc_obj.skill.map(
      (i: any) => new AccountSkill(i),
    );
    account.weaponList = equip_desc_obj.gear.map(
      (i: any) => new AccountWeapon(i),
    );
    account.analyse(heroAll, weaponAll);
    return account;
  }

  analyse(heroAll: Hero[], weaponAll: Weapon[]) {
    this.computeHeroScore(heroAll);
    this.computeSkillScore();
    this.computeWeaponPrice(weaponAll);
    this.computeScore();
    this.computeTag(heroAll);
  }

  /**
   * 计算武将分数
   * @param heroAll
   */
  computeHeroScore(heroAll: Hero[]) {
    this.heroScore = 0;
    this.seasonScore = 0;
    this.heroTag = [];
    this.heroList.forEach((accountHero) => {
      const findHero = heroAll.find((h) => h.id === accountHero.id);
      if (findHero) {
        // 计算分数
        const num = findHero.score + findHero.score * accountHero.advanceNum;
        this.heroScore += num;
        if (findHero.season !== 'XP') {
          this.seasonScore += num;
        }
        // 添加标签
        if (
          num > 25 ||
          (accountHero.advanceNum === 5 && accountHero.score >= 3)
        ) {
          this.heroTag.push(`${accountHero.advanceNum}红${findHero.name}`);
        }
      }
    });
  }

  /**
   * 计算战法分数
   * @private
   */
  private computeSkillScore() {
    this.skillScore = 0;
    this.skillTag = [];
    this.skillList.forEach((skill) => {
      let num = 0;
      if (eightSkillId.includes(skill.id)) {
        num = 10;
        this.skillTag.push(skill.name);
      } else if (fiveSkillId.includes(skill.id)) {
        num = 5;
      } else if (threeSkillId.includes(skill.id)) {
        num = 3;
      }
      this.skillScore += num;
    });
    this.score += this.skillScore;
  }

  /**
   * 计算武器价格
   * @param weaponAll
   */
  computeWeaponPrice(weaponAll: Weapon[]) {
    this.weaponPrice = 0;
    // 计算武器价格
    this.weaponList.forEach((accountWeapon, index) => {
      const findWeapon = weaponAll.find((w) => {
        return w.id === accountWeapon.id;
      });
      if (findWeapon) {
        this.weaponList[index].price = findWeapon.price;
        this.weaponPrice += findWeapon.price * 100;
      }
    });
  }

  /**
   * 计算分数、价格、性价比
   */
  computeScore() {
    this.score = 0;
    this.score += this.heroScore;
    if (this.intermediaryPrice) {
      this.heroPrice = this.intermediaryPrice - this.weaponPrice;
    } else {
      this.heroPrice = this.price - this.weaponPrice;
    }
    this.seasonScoreRate = (this.seasonScore / this.heroPrice) * 100000;
    this.scoreRate = (this.heroScore / this.heroPrice) * 100000;
  }

  // 生成tag
  computeTag(heroAll: Hero[]) {
    this.tag = [];
    let sevenHeroNum = 0;
    this.heroList.forEach((hero) => {
      const findHero = heroAll.find((h) => h.id === hero.id);
      if (findHero && findHero.score >= 7) {
        sevenHeroNum++;
      }
    });
    if (sevenHeroNum >= 9) {
      this.tag.push('S赛季核心全');
    }
  }

  /**
   * 改价，中介报价
   * @private
   * @param price
   */
  public updatePrice(price: number) {
    this.intermediaryPrice = price;
    this.computeScore();
  }
}
