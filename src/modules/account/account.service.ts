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
    console.log('condition id 为：');
    console.log(conditionId);
    const data = await this.accountRepository
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
    return data;
  }
}
