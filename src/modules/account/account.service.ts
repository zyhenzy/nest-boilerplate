import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entity/account.entity';
import { Condition } from '../condition/entity/condition.entity';

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
   */
  async insertAccount(
    accountMeta: any,
    condition: Condition,
  ): Promise<Account> {
    const account = new Account();
    account.id = accountMeta.id;
    account.metadata = accountMeta;
    account.conditions = [condition]; // Associate with condition
    return this.accountRepository.save(account);
  }
}
