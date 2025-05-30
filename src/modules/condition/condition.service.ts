import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Condition } from './entity/condition.entity';
import { ConditionVO } from './vo/condition.vo';
import { fetchAccountDetail, fetchAccountList, getMdJson } from './util';
import * as fs from 'fs-extra';
import { DeepSeekKey, SystemPrompt, TOKEN_URL } from './config';
import { sleep } from '../../utils';
import { AccountService } from '../account/account.service';
import { HeroService } from '../hero/hero.service';
import { WeaponService } from '../weapon/weapon.service';
import { IconService } from '../icon/icon.service';
import OpenAI from 'openai';
import axios from 'axios';
import { JSONInsertDto } from './dto/cookie.dto';

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

  // AI解读中介信息（deepSeek版本，需要花钱...）
  // async interpretIntermediaryInfo(conditionId: string, info: string) {
  //   const openai = new OpenAI({
  //     baseURL: 'https://api.deepseek.com',
  //     apiKey: DeepSeekKey,
  //   });
  //   const completion = await openai.chat.completions.create({
  //     messages: [
  //       { role: 'system', content: SystemPrompt },
  //       { role: 'user', content: info },
  //     ],
  //     model: 'deepseek-chat',
  //   });
  //   console.log('deepSeek response:', completion);
  //   console.log(completion.choices[0].message.content);
  //   const obj = getMdJson(completion.choices[0].message.content as string);
  //   console.log('解析的JSON为：', obj);
  // }

  async interpretIntermediaryInfo(conditionId: string, info: string) {
    const _info = info.replace(/[\r\n]/g, '');
    const url = 'http://127.0.0.1:11434/api/generate';
    const data = {
      model: 'deepseek-coder:1.3b',
      system: SystemPrompt,
      prompt:
        '给你一段类似这样的文本：7000议价出，14红徐晃蜀骑 13红核弹 11红撸铁 鬼吕网红 。SS5273https://stzb.cbg.163.com/cgi/mweb/equip/1/202505200102116-1-PVPNPIDL9NHDXO ，帮我提去成{id:202505200102116-1-PVPNPIDL9NHDXO,price:7000}这种结构化的JSON,文本如下：' +
        _info,
      stream: false,
    };
    console.log('模型入参为：');
    console.log(data);
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const qwenRes = response.data.response;
    console.log(response.data);
    const obj = getMdJson(qwenRes);
    console.log('----------------解析的JSON为---------------', obj);
    const jsonInsertDto = {
      id: conditionId,
      idAndPriceList: obj,
    };
    await this.insertJSON(jsonInsertDto);
    // const openai = new OpenAI({
    //   baseURL: 'https://api.deepseek.com',
    //   apiKey: DeepSeekKey,
    // });
    // const completion = await openai.chat.completions.create({
    //   messages: [
    //     { role: 'system', content: SystemPrompt },
    //     { role: 'user', content: info },
    //   ],
    //   model: 'deepseek-chat',
    // });
    // console.log('deepSeek response:', completion);
    // console.log(completion.choices[0].message.content);
    // const obj = getMdJson(completion.choices[0].message.content as string);
  }

  // 插入JSON格式的账号信息（中介发布账号信息）
  async insertJSON(jsonInsertDto: JSONInsertDto) {
    const condition = await this.conditionRepository.findOne({
      where: { id: jsonInsertDto.id },
    });
    if (!condition) {
      return console.error('未找到对应的检索条件');
    }
    const heroAll = await this.heroService.findAll();
    const weaponAll = await this.weaponService.findAll();
    const iconAll = await this.iconService.findAll();
    for (let i = 0; i < jsonInsertDto.idAndPriceList.length; i++) {
      console.log(`正在获取第 ${i + 1} 个账号详情`);
      const idAndPrice = jsonInsertDto.idAndPriceList[i];
      const accountMeta = await fetchAccountDetail(idAndPrice.id); // 2. 获取账号详情
      await this.accountService.insertAccount(
        accountMeta,
        condition,
        heroAll,
        weaponAll,
        iconAll,
      ); // 3. 插入账号
      await this.accountService.updatePrice(idAndPrice.id, idAndPrice.price); // 4. 录入中介价格
      await sleep(5000);
    }
    console.log(`录入结束`);
  }
}
