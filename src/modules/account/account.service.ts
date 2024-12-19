import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entity/account.entity';
import { Condition } from '../condition/entity/condition.entity';
import { Hero } from '../hero/entity/hero.entity';
import { Weapon } from '../weapon/entity/weapon.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(account: Account): Promise<Account> {
    return this.accountRepository.save(account);
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
    const account = Account.create(accountMeta, heroAll, weaponAll);
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
