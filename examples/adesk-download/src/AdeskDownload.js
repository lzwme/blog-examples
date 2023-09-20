import { mkdirp, Request, color, sleep } from '@lzwme/fe-utils';
import fs from 'node:fs';
import path from 'node:path';

// https://www.jianshu.com/p/fb1d1ad58a0b
const api = {
  wallpaper: {
      album: 'https://service.picasso.adesk.com/v1/wallpaper/album',
      getList: id => `https://service.picasso.adesk.com/v1/album/${id}/wallpaper/`,
  },
  /** 获取手机壁纸类别 */
  category: 'https://service.picasso.adesk.com/v1/vertical/category',
  /** 不分类别获取壁纸接口 */
  vertical: 'https://service.picasso.adesk.com/v1/vertical/vertical',
  getCateDetailUrl: cateId => `https://service.picasso.adesk.com/v1/vertical/category/${cateId}/vertical`,
};
const req = new Request();

export class AdeskDownload {
  /** 已下载图片的总数量 */
  downloadedTotal = 0;
  category = [];
  config = {
    /** 指定要下载的分类 */
    type: [],
    /** 排序类型 */
    order: 'hot',
    /** 单一分类最多下载的数量 */
    limit: 1000,
    downloadDir: './download',
    sleep: -1,
  };
  constructor(config) {
    if (config) {
      if (config.type === 'string') config.type = [config.type];
      Object.assign(this.config, config);
      this.config.limit = Number(this.config.limit) || 1000;
      this.config.sleep = Number(this.config.sleep) || -1;
    }
    console.log('config:', this.config);
  }

  async start() {
    const category = await this.getCategory();
    const config = this.config;
    for (let item of category) {
      if (config.type.length && !config.type.includes(item.ename) && !config.type.includes(item.name)) continue;
      await this.download(api.getCateDetailUrl(item.id), item, 0);
    }
  }
  async getCategory() {
    const { data } = await req.get(api.category, { adult: false, first: 1 });

    this.category = data.res.category;
    console.log(`获取到分类(${this.category.length})：`, color.green(this.category.map(d => d.rname).join(', ')));
    return this.category;
  }
  async download(url, cateInfo, skip = 0) {
    if (!url) url = `//service.picasso.adesk.com/v1/vertical/category/4e4d610cdf714d2966000000/vertical`;
    const params = {
      limit: 30,
      skip: skip,
      first: 0,
      order: this.config.order || 'hot', // new \ favs
    };
    const data = await req
      .get(url, params)
      .then(res => res.data.res.vertical)
      .catch(err => console.log(err));

    if (!data.length) console.log(color.red('获取列表为空！'), skip, cateInfo.rname, params, url);
    if (!data.length || skip > this.config.limit) {
      console.log(color.green('下载完成！'), cateInfo.rname, skip, 'total:', this.downloadedTotal);
      return this.downloadedTotal;
    }

    console.log(color.cyanBright(`[${cateInfo.ename}][offset: ${skip}][total: ${data.length}]`));
    await this.downloadFile(data, cateInfo).catch(e => console.log(color.red('downloadFile error:'), e));

    return this.download(url, cateInfo, skip + 30);
  }
  async downloadFile(data, cateInfo = null) {
    const cate = cateInfo ? `${cateInfo.ename}` : data[0].cid;

    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      const dirPath = `${this.config.downloadDir}/${cate}`;
      const filename = `${item.id}.jpeg`;
      const filepath = path.resolve(dirPath, filename);

      if (fs.existsSync(filepath)) {
        console.log(color.cyan(`文件已存在`), cate, color.yellow(filepath));
      } else {
        mkdirp(dirPath);
        this.downloadedTotal++;
        await req
          .get(item.wp)
          .then(r => {
            if (r.response.statusCode === 200) {
              console.log(`[${this.downloadedTotal}] Download ${color.green(cate)}/${color.greenBright(filename)} Completed`);
              return fs.promises.writeFile(filepath, r.buffer);
            }
          })
          .catch(err => console.log(`[${this.downloadedTotal}] Download ${cate}/${filename} error:`, err));

        const sleepTime = this.config.sleep < 0 ? Math.ceil(Math.random() * 1000) : this.config.sleep;
        if (sleepTime > 0) await sleep(Math.ceil(Math.random() * 10) * 100 + 500);
      }
    }
  }
}
