import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Condition } from './entity/condition.entity';
import { fetchAccountList } from './util';
import * as fs from 'fs-extra';
import { TOKEN_URL } from './config';

@Injectable()
export class ConditionService {
  constructor(
    @InjectRepository(Condition)
    private readonly conditionRepository: Repository<Condition>,
  ) {}

  async create(condition: Condition): Promise<Condition> {
    return await this.conditionRepository.save(condition);
  }

  async findAll(): Promise<Condition[]> {
    return await this.conditionRepository.find({
      order: {
        createdAt: 'ASC',
      },
    });
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
    // @ts-ignore
    const params = {
      id: '067b7b9a-62ec-42c2-93f2-759274d4bacd',
      priceMin: 20000,
      priceMax: 20000000,
      passFairShow: '2',
      cardHeroId: ['100372', '100028'],
      skillId: [],
      advanceNum: 2,
      apprentice: false,
      remark: '',
      createdAt: '2024-06-28T03:07:01.060Z',
      updatedAt: '2024-06-28T09:13:45.530Z',
    } as Condition;
    console.log(`-----开始分析-----`);
    const accountList = await fetchAccountList(params); // 1. 获取账号列表
    console.log('账号列表为：');
    console.log(accountList);
  }
}
