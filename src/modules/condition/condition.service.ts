import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Condition } from './entity/condition.entity';
import { ConditionVO } from './vo/condition.vo';
import { fetchAccountDetail, fetchAccountList } from './util';
import * as fs from 'fs-extra';
import { TOKEN_URL } from './config';
import { sleep } from '../../utils';
import { AccountService } from '../account/account.service';
import { HeroService } from '../hero/hero.service';
import { WeaponService } from '../weapon/weapon.service';
import { IconService } from '../icon/icon.service';

@Injectable()
export class ConditionService {
  constructor(
    @InjectRepository(Condition)
    private readonly conditionRepository: Repository<Condition>,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly heroService: HeroService,
    private readonly weaponService: WeaponService,
    private readonly iconService: IconService,
  ) {}

  async create(condition: Condition): Promise<Condition> {
    return await this.conditionRepository.save(condition);
  }

  async findAll(): Promise<ConditionVO[]> {
    const conditions = await this.conditionRepository.find({
      order: {
        createdAt: 'ASC',
      },
    });

    const conditionVOs: ConditionVO[] = [];
    for (const condition of conditions) {
      const heroNames = await this.heroService.findNamesByIds(
        condition.cardHeroId,
      );
      const conditionVO = new ConditionVO();
      Object.assign(conditionVO, condition);
      conditionVO.heroNames = condition.cardHeroId.map((id) => heroNames[id]);
      conditionVOs.push(conditionVO);
    }

    return conditionVOs;
  }

  async findOne(id: string): Promise<Condition | null> {
    return await this.conditionRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updatedCondition: Condition,
  ): Promise<Condition | null> {
    await this.conditionRepository.update(id, updatedCondition);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.conditionRepository.delete(id);
  }

  async setCookie(cookie: string): Promise<void> {
    fs.writeFileSync(TOKEN_URL, cookie, {
      flag: 'w',
    });
  }

  // 执行条件
  async perform(condition: Condition) {
    console.log(`-----开始分析-----`);
    const heroAll = await this.heroService.findAll();
    const weaponAll = await this.weaponService.findAll();
    const iconAll = await this.iconService.findAll();
    const accountList = await fetchAccountList(condition); // 1. 获取账号列表
    await sleep(5000);
    for (let i = 0; i < accountList.length; i++) {
      console.log(`正在获取第 ${i + 1} 个账号详情`);
      const account = accountList[i];
      const accountMeta = await fetchAccountDetail(account.game_ordersn); // 2. 获取账号详情
      await this.accountService.insertAccount(
        accountMeta,
        condition,
        heroAll,
        weaponAll,
        iconAll,
      ); // 3. 插入账号
      await sleep(5000);
    }
    console.log(`-----分析结束-----`);
  }

  // 刷新条件，重新获取执行已有账号的信息
  async refresh(conditionId: string) {
    const condition = await this.conditionRepository
      .createQueryBuilder('condition')
      .leftJoinAndSelect('condition.accounts', 'account')
      .where('condition.id = :conditionId', { conditionId })
      .getOne();
    if (!condition) {
      return;
    }
    const accountIds = condition.accounts.map((account) => account.id);
    const heroAll = await this.heroService.findAll();
    const weaponAll = await this.weaponService.findAll();
    const iconAll = await this.iconService.findAll();
    console.log(`该条件下的账号共有 ${accountIds.length} 个，开始刷新`);
    await sleep(5000);
    for (let i = 0; i < accountIds.length; i++) {
      console.log(`正在刷新第 ${i + 1} 个账号详情`);
      const accountId = accountIds[i];
      const accountMeta = await fetchAccountDetail(accountId); // 2. 获取账号详情
      await this.accountService.insertAccount(
        accountMeta,
        condition,
        heroAll,
        weaponAll,
        iconAll,
      ); // 3. 插入账号
      await sleep(5000);
    }
    console.log(`-----分析结束-----`);
  }
}
