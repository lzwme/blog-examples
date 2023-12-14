/*
 * @Author: renxia
 * @Date: 2023-12-14 08:51:07
 * @LastEditors: renxia
 * @LastEditTime: 2023-12-14 09:45:19
 * @Description:
 */
import { color, download, getLogger, md5, mkdirp, concurrency } from '@lzwme/fe-utils';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

export const logger = getLogger('[photoplus-dl]');

type IParams = Record<string, string | number | boolean>;
type IListReust = {
  pics_total: number;
  pics_array: {
    id: number;
    pic_hash: string;
    pic_name: string;
    pic_type: number;
    pic_size: number;
    show_size: number;
    origin_img: string;
    create_time: string;
    width: number;
    height: number;
  }[];
};
export interface PPDLOptions {
  params: IParams & {
    activityNo: number;
    count?: number;
  };
  saveDir?: string;
}

function toQueryString(params: IParams) {
  const qs: string[] = [];
  for (let [key, value] of Object.entries(params)) {
    qs.push(`${key}=${value == null || value === '' ? '' : encodeURIComponent(value as never)}`);
  }
  return qs.join('&');
}

function parseParams(params: IParams = {}) {
  const genc = (t: IParams) => {
    const keys = Object.keys(t).sort();
    let i = '';
    for (const key of keys) {
      if (null !== t[key]) {
        i += (i.includes('=') ? '&' : '') + key + '=' + JSON.stringify(t[key]);
      }
    }

    return i;
  };

  params._t = Date.now();
  params._s = md5(genc({ ...params }).replace(/\"/g, '') + 'laxiaoheiwu');

  return params;
}

async function getActivityList(params: Record<string, string | number | boolean>) {
  params = {
    activityNo: 0,
    isNew: true,
    page: 1,
    count: 200,
    key: '',
    ppSign: 'live',
    picUpIndex: '',
    ...params,
  };

  const url = `https://live.photoplus.cn/pic/list?${toQueryString(parseParams(params))}`;
  const res = await fetch(url, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      'sec-ch-ua': '"Microsoft Edge";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      cookie: `beautiful_china_level=; phone_login=false; company_name=; user_id=71250099; isLogin=true; uniq_code=GrgsESwBeB; vip_year_type=1; can_see=1; activity_no=${params.activityNo}; year_type=0; home_guide=true; wx_login=true`,
      Referer: `https://live.photoplus.cn/live/pc/${params.activityNo}/`,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    method: 'GET',
  }).then(d => d.json() as Promise<{ result: IListReust; success: boolean }>);

  logger.info('get activity list from url', color.cyan(url));
  return res;
}

export async function photoplusDl(options: PPDLOptions) {
  if (!options.saveDir) options.saveDir = 'img';

  const cacheInfo = {
    now: Date.now(),
    list: {} as { [id: number]: IListReust['pics_array'][0] },
    total: 0,
  };
  const cacheUrlFile = resolve(options.saveDir, `${options.params.activityNo}-cache.json`);

  if (existsSync(cacheUrlFile)) {
    const r = JSON.parse(readFileSync(cacheUrlFile, 'utf8'));
    if (cacheInfo.now - r.now < 120_000) Object.assign(cacheInfo, r);
  }

  if (!cacheInfo.total) {
    logger.info('开始获取图片列表', options.params);
    const res = await getActivityList(options.params);

    if (res.success === false) {
      logger.error(res);
      return false;
    }

    if (res.result?.pics_total) {
      cacheInfo.total = res.result.pics_total;
      for (const item of res.result.pics_array) cacheInfo.list[item.id] = item;
      mkdirp(options.saveDir);
      writeFileSync(cacheUrlFile, JSON.stringify(cacheInfo, null, 2), 'utf-8');
    }
  }

  const list = Object.values(cacheInfo.list);

  if (!list.length) {
    logger.error('未获取到任何图片地址');
  } else {
    logger.info('获取 url 列表完毕！包含图片总数:', list.length, '相册图片总数：', cacheInfo.total);

    const { default: glob } = await import('fast-glob');
    const existFiles = await glob('**.{jpeg,jpg}', { cwd: options.saveDir });
    const existFilesSet = new Set(existFiles.map(d => basename(d)));
    const savePath = resolve(options.saveDir, String(options.params.activityNo));
    let dlCount = 0;
    const taskList = list.map(item => async () => {
      const url = item.origin_img.replace(/^\/\//, 'https://');
      const filename = `${(item.create_time || '').replace(/[^\d]/g, '')}-${item.pic_name}`.toLowerCase(); // `${md5(item.pic_hash)}.jpg`;
      const filepath = resolve(savePath, filename);
      if (existFilesSet.has(filename) || existsSync(filepath)) {
        logger.info(`[${dlCount}/${list.length}] 文件已存在：`, color.greenBright(filename));
      } else {
        await download({ url, filepath });
        logger.info(`[${dlCount}/${list.length}] 已下载:`, color.green(filename), color.gray(url));
      }

      dlCount++;
    });

    await concurrency(taskList);
    logger.info(`下载完毕！图片总数： ${list.length}，本次下载： ${dlCount}`);
  }

  return cacheInfo;
}
