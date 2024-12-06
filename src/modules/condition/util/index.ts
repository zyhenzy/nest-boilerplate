import { Condition } from '../entity/condition.entity';
import {
  ACCOUNT_URL,
  ApprenticeCode,
  BASE_LIST_PARAMS,
  TOKEN_URL,
} from '../config';
import { cloneDeep } from 'lodash';
import * as fs from 'fs-extra';
import axios from 'axios';

/**
 * 睡眠函数
 * @param delayTime
 */
export const sleep = (delayTime = 1000) => {
  const realDelayTime = delayTime + Math.random() * 5000;
  return new Promise((resolve) => setTimeout(resolve, realDelayTime));
};

const getCookies = () => {
  const data = fs.readFileSync(TOKEN_URL, 'utf8');
  const cookie = data.toString();
  return cookie;
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
