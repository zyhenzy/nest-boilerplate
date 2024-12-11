import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ConditionService {
  constructor(
    @InjectRepository(Condition)
    private readonly conditionRepository: Repository<Condition>,
    private readonly accountService: AccountService, // 注入AccountService
    private readonly heroService: HeroService, // 注入 HeroService
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
    const accountList = await fetchAccountList(condition); // 1. 获取账号列表
    for (let i = 0; i < accountList.length; i++) {
      console.log(`正在获取第 ${i + 1} 个账号详情`);
      const account = accountList[i];
      const accountMeta = await fetchAccountDetail(account.game_ordersn); // 2. 获取账号详情
      await this.accountService.insertAccount(accountMeta, condition); // 3. 插入账号
      await sleep(5000);
    }
    console.log('账号列表为：');
    console.log(accountList);
  }
}
