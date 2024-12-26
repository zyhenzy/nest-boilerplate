import { Injectable, Inject, forwardRef } from '@nestjs/common';
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
    @Inject(forwardRef(() => ConditionService))
    private readonly conditionService: ConditionService,
    private readonly heroService: HeroService,
    private readonly weaponService: WeaponService,
  ) {}

  async create(insertAccount: InsertAccountDto): Promise<Account | null> {
    const condition = await this.conditionService.findOne(
      insertAccount.conditionId,
    );
    const heroAll = await this.heroService.findAll();
    const weaponAll = await this.weaponService.findAll();
    const accountMeta = await fetchAccountDetail(insertAccount.game_ordersn);
    if (condition) {
      return this.insertAccount(accountMeta, condition, heroAll, weaponAll);
    } else {
      throw new Error('Condition not found'); // 如果 condition 为空，抛出错误
    }
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

  async updateApprentice(id: string, apprentice: boolean): Promise<Account> {
    const account = await this.accountRepository.findOneBy({ id });
    if (account) {
      account.apprentice = apprentice;
      return await this.accountRepository.save(account);
    } else {
      throw new Error('Account not found');
    }
  }

  /**
   * 修改账号备注
   * @param id
   * @param remark
   */
  async updateRemark(id: string, remark: string): Promise<Account | null> {
    const account = await this.accountRepository.findOneBy({ id });
    if (account) {
      account.remark = remark;
      return await this.accountRepository.save(account);
    } else {
      throw new Error('Account not found');
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
    const account = Account.create(accountMeta, heroAll, weaponAll);
    const existingAccount = await this.accountRepository.findOne({
      where: { id: account.id },
      relations: ['conditions'],
    });
    if (existingAccount) {
      account.conditions = [...existingAccount.conditions, condition];
      account.intermediaryPrice = existingAccount?.intermediaryPrice || 0;
      account.analyse(heroAll, weaponAll);
    } else {
      account.conditions = [condition];
    }
    return this.accountRepository.save(account);
  }
}
