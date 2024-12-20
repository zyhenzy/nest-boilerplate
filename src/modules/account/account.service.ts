import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entity/account.entity';
import { Condition } from '../condition/entity/condition.entity';
import { Hero } from '../hero/entity/hero.entity';
import { Weapon } from '../weapon/entity/weapon.entity';
import { ConditionService } from '../condition/condition.service';
import { fetchAccountDetail } from '../condition/util';
import { HeroService } from '../hero/hero.service';
import { WeaponService } from '../weapon/weapon.service';
import { InsertAccountDto } from './dto/insert-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly conditionService: ConditionService,
    private readonly heroService: HeroService,
    private readonly weaponService: WeaponService,
  ) {}

  async create(insertAccount: InsertAccountDto): Promise<Account | null> {
    const condition = this.conditionService.findOne(insertAccount.conditionId);
    const heroAll = await this.heroService.findAll();
    const weaponAll = await this.weaponService.findAll();
    const accountMeta = await fetchAccountDetail(insertAccount.game_ordersn);
    if (condition) {
      return this.insertAccount(accountMeta, condition, heroAll, weaponAll);
    } else {
      throw new Error('Condition not found'); // 如果 condition 为空，抛出错误
    }
  }

  /**
   * 根据账号元数据，插入账号
   * @param accountMeta
   * @param condition
   * @param heroAll
   * @param weaponAll
   */
  async insertAccount(
    accountMeta: any,
    condition: Condition,
    heroAll: Hero[],
    weaponAll: Weapon[],
  ): Promise<Account> {
    const accountOld = await this.accountRepository.findOneBy({
      id: accountMeta.game_ordersn,
    });
    const account = Account.create(
      accountMeta,
      heroAll,
      weaponAll,
      accountOld?.intermediaryPrice || 0,
    );
    account.conditions = [condition];
    return this.accountRepository.save(account);
  }

  async findByCondition(conditionId: string): Promise<Account[]> {
    return await this.accountRepository
      .createQueryBuilder('account')
      .innerJoin(
        'account.conditions',
        'condition',
        'condition.id = :conditionId',
        {
          conditionId,
        },
      )
      .getMany();
  }

  /**
   * 修改中介价格
   * @param id
   * @param price
   */
  async updatePrice(id: string, price: number) {
    const account = await this.accountRepository.findOneBy({ id });
    if (account) {
      account.updatePrice(price * 100);
      return await this.accountRepository.save(account);
    }
  }
}
