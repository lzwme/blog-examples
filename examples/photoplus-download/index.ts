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
    create_time: number;
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
  let qs: string[] = [];
  for (let [key, value] of Object.entries(params)) {
    qs.push(`${key}=${value == null || value === '' ? '' : encodeURIComponent(value as never)}`);
  }
  return qs.join('&');
}

function parseParams(params: IParams = {}) {
  const genc = (t: IParams) => {
    // 创建一个新的字符串，用于存放排好序的键值对
    // key按字典序
    // 先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    let keys = Object.keys(t).sort();
    let i = '';
    for (const key of keys) {
      if (null !== t[key]) {
        i += (i.includes('=') ? '&' : '') + key + '=' + JSON.stringify(t[key]);
      }
    }

    return i;
  };

  params._t = Date.now();
  let o = genc({ ...params }).replace(/\"/g, '');
  params._s = md5(o + 'laxiaoheiwu');

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
    // body: null,
    method: 'GET',
  }).then(d => d.json());

  logger.info('get list from url', url);

  return res as { result: IListReust; success: boolean };
}

export async function photoplusDl(options: PPDLOptions) {
  options = {
    ...options,
    saveDir: 'img',
  };
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
      for (const item of res.result.pics_array) {
        cacheInfo.list[item.id] = item;
      }

      mkdirp(options.saveDir);
      writeFileSync(cacheUrlFile, JSON.stringify(cacheInfo, null, 2), 'utf-8');
    }
  }

  const list = Object.values(cacheInfo.list);

  if (!list.length) {
    logger.error('未获取到任何图片地址');
  } else {
    logger.info('获取 url 列表下载完毕！total:', list.length);

    const { default: glob } = await import('fast-glob');
    const existFiles = await glob('**.{jpeg,jpg}', { cwd: options.saveDir });
    const existFilesSet = new Set(existFiles.map(d => basename(d)));
    const savePath = resolve(options.saveDir, String(options.params.activityNo));
    let dlCount = 0;

    console.log(existFilesSet);

    const taskList = list.map(item => {
      const url = item.origin_img;
      return async () => {
        const filename = `${md5(item.pic_hash)}.jpg`;
        const filepath = resolve(savePath, filename);
        if (existFilesSet.has(filename) || existsSync(filepath)) {
          console.log('文件已存在：', filename);
          return;
        }

        logger.info(`[${dlCount}/${list.length}] start download:`, color.gray(url));
        await download({
          url: `https:${url}`,
          filepath,
        });
        dlCount++;
      };
    });

    await concurrency(taskList);

    logger.info(`下载完毕！图片总数： ${list.length}，本次下载： ${dlCount}`);
  }

  return cacheInfo;
}

// photoplusDl({ params: { activityNo: 52991069 } });
