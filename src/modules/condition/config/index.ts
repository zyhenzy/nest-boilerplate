export const TOKEN_URL =
  '/Users/yingzhang/个人/boilerplate/nest-boilerplate/src/static/token.txt';

export const ACCOUNT_URL = 'https://stzb.cbg.163.com/cgi-bin/recommend.py'; // 账号列表url
export const ACCOUNT_DETAIL_URL =
  'https://stzb.cbg.163.com/cgi/api/get_equip_detail'; // 账号详情URL

// 账号列表参数
export const BASE_LIST_PARAMS = {
  method: 'get',
  headers: { cookie: '' },
  params: {
    client_type: 'h5',
    act: 'recommd_by_role',
    search_type: 'role',
    count: 15,
    view_loc: 'equip_list',
    tfid: 'f_kingkong',
    refer_sn: '0193288C-C2F2-9822-EDC6-348151B0412D',
    order_by: '',
    page: 1,
    exter: 'direct',
    page_session_id: '0193288D-5A16-23DA-5302-80028C202D2E',
    traffic_trace: {
      field_id: 'f_kingkong',
      content_id: '',
    },
  },
};

// 账号详情参数
export const BASE_ACCOUNT_PARAMS = {
  method: 'post',
  url: ACCOUNT_DETAIL_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    cookie: '',
  },
  data: {
    serverid: 1,
    ordersn: '',
    view_loc: 'search_cond|tag_key:{"is_from_ad_reco": 0, "tag": "user"}',
    exter: 'direct',
    page_session_id: '0186AFEE-4719-4AFE-5930-8277517B3DD8',
  },
};

export const ApprenticeCode = [
  42835, 42834, 42833, 42832, 42819, 42820, 42821, 42822, 42823, 42811, 42812,
  42813, 42814, 42815, 42803, 42804, 42793, 42794, 42795, 42796, 42797, 42798,
  42799, 42786, 42787, 42781, 42782, 42783, 42784, 42785, 42769, 42770, 42771,
  42772, 42747, 42748, 42749, 42750, 42751, 42752, 42753, 42754, 42737, 42738,
  42739, 42740, 42741, 42742, 42743, 42744, 42717, 42718, 42719, 42720, 42721,
  42708, 42709, 42710, 42711, 42712, 42713, 42700, 42699, 42698, 42697, 42689,
  42690, 42691, 42680, 42681, 42682, 42683, 42671, 42672, 42673, 42674, 42675,
  42676,
]; // 试师区code编码
