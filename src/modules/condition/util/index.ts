import { Condition } from '../entity/condition.entity';
import {
  ACCOUNT_URL,
  ApprenticeCode,
  BASE_ACCOUNT_PARAMS,
  BASE_LIST_PARAMS,
  TOKEN_URL,
} from '../config';
import { cloneDeep } from 'lodash';
import * as fs from 'fs-extra';
import axios from 'axios';
import { sleep } from '../../../utils';

const getCookies = () => {
  const data = fs.readFileSync(TOKEN_URL, 'utf8');
  return data.toString();
};

/**
 * 请求账号列表
 * @param condition
 */
export const fetchAccountList = async (condition: Condition) => {
  const accountList = [];
  let firstRequest = true;
  let lastPage = false;
  const option: any = cloneDeep(BASE_LIST_PARAMS);
  option.params.page = 1;
  option.params.price_min = condition.priceMin;
  option.params.price_max = condition.priceMax;
  option.params.pass_fair_show =
    condition.passFairShow !== '2' ? condition.passFairShow : undefined;
  option.params.card__hero_id = condition.cardHeroId.join(',');
  option.params.skill_id = condition.skillId.join(',');
  option.params.card__advance_num = condition.advanceNum;
  option.headers.cookie = getCookies();
  if (condition.apprentice) {
    // 如果试师，则条件加上试师编码
    option.params.game_compete_serverid = ApprenticeCode.join(',');
    console.log('-----------试师区服为：----------');
    console.log(option.params.game_compete_serverid);
  }
  while (!lastPage) {
    const res = await axios.get(ACCOUNT_URL, option);
    const resObj = res.data;
    if (resObj.status === 2) {
      console.error('session过期');
      break;
    }
    if (resObj.status === 3) {
      console.error('请输入验证码');
      break;
    }
    if (firstRequest) {
      firstRequest = false;
      console.log(`共${resObj.pager.total_pages}页数据`);
    }
    console.log(
      `当前第${resObj.pager.cur_page}页，当前页${resObj.result.length}条数据`,
    );
    accountList.push(...resObj.result);
    if (resObj.paging.is_last_page) {
      lastPage = true;
      break;
    }
    option.params.page++;
    await sleep(5000);
  }
  return Promise.resolve(accountList);
};

/**
 * 获取账号详情
 * @param game_ordersn
 */
export const fetchAccountDetail = async (game_ordersn: string) => {
  const option = cloneDeep(BASE_ACCOUNT_PARAMS);
  option.data.ordersn = game_ordersn;
  const res = await axios(option);
  if (res.data.status === 1) {
    return res.data.equip;
  } else {
    throw new Error('获取账号详情失败');
  }
};

export const getMdJson = (markdown: string): any[] => {
  const jsonObjects: any[] = [];
  const jsonRegex = /```json([\s\S]*?)```/g; // Matches JSON blocks in Markdown

  let match;
  while ((match = jsonRegex.exec(markdown)) !== null) {
    try {
      const jsonObject = JSON.parse(match[1].trim());
      jsonObjects.push(jsonObject);
    } catch (error) {
      console.error('Invalid JSON found in Markdown:', match[1]);
    }
  }

  return jsonObjects;
};