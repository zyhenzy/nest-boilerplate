import { Hero } from '../../hero/entity/hero.entity';

export class AccountHero extends Hero {
  advanceNum: number; // 进阶

  constructor(meta: any) {
    super();
    this.id = meta.hero_id;
    this.name = meta.name;
    this.country = meta.country;
    this.season = meta.season;
    this.advanceNum = meta.advance_num;
  }
}
