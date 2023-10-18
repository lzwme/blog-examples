import { JSDOM } from 'jsdom';
import { Request, color, concurrency, download, getLogger, mkdirp } from '@lzwme/fe-utils';
import { basename, extname, resolve } from 'path';
import { existsSync, readdirSync, renameSync } from 'fs';
import { fileTypeFromFile } from 'file-type';

const argv = process.argv.slice(2);
const albumIndex = `http://class.pc139.zgyey.com/177416/classindex/albumindex_p1.html`;
const cookie = argv[0] || '';
const req = new Request(cookie);
const logger = getLogger('[DL-ZGYEY]');

async function getHtmlDom(url) {
  const r = await req.get(url);
  const dom = new JSDOM(r.buffer.toString());
  return { r, dom, doc: dom.window.document };
}
async function getAlbumPageList() {
  const { doc, r } = await getHtmlDom(albumIndex);
  const pageTxt = doc.querySelector('.scott .page').innerHTML;
  const totalPages = Number(/(\d+)页/.exec(pageTxt)?.[1]);
  if (!pageTxt) logger.error('获取页面信息失败，请检查 cookie 是否正确！', r.data);
  else logger.info('取得相册列表信息：', pageTxt);
  return new Array(totalPages).fill('').map((_d, idx) => albumIndex.replace('p1', `p${idx + 1}`));
}
async function geAlbumList(url) {
  const { doc } = await getHtmlDom(url);
  const u = new URL(url);
  return [...doc.querySelectorAll('.pcontent ul li')].map(li => ({
    url: u.origin + li.querySelector('a').href,
    title: li.querySelector('a').getAttribute('title'),
    count: +li.querySelector('p em').innerHTML,
    date: li.querySelectorAll('p')[1].innerHTML.replace('上传时间：', '').trim(),
  }));
}
async function getAlbumImgList(url = '', page = 1) {
  const { doc } = await getHtmlDom(url);
  const totalPage = Number(/(\d+)页/.exec(doc.querySelector('.scott span').innerHTML)?.[1]);
  const imgs = [...doc.querySelectorAll('#content2 img')].map(d => d.src.split('!')[0]);

  while (page < totalPage) {
    const nextUrl = url.replace(url.endsWith(`_p${page}.html`) ? `_p${page}.html` : '.html', `_p${page + 1}.html`);
    const { doc } = await getHtmlDom(nextUrl);
    imgs.push(...[...doc.querySelectorAll('#content2 img')].map(d => d.src.split('!')[0]));
    page++;
  }
  return imgs;
}
async function start() {
  const failedList = [];
  let albumIdx = 0;
  const pagelist = await getAlbumPageList();

  for (const purl of pagelist) {
    const albumList = await geAlbumList(purl);

    for (const info of albumList) {
      const saveDir = `cache/${info.date}_${info.title}`;
      logger.info(`开始下载相册[${++albumIdx}]: ${color.green(info.title)} 数量: ${color.cyan(info.count)} 创建日期: ${color.magenta(info.date)}`);

      if (existsSync(saveDir)) {
        const list = readdirSync(saveDir);
        if (list.length === info.count) {
          logger.info(' > 该相册已全部下载');
          continue;
        } else logger.info(' > 本地已下载数量：', color.cyan(list.length));
      } else mkdirp(saveDir);

      let idx = 0;
      const imgs = await getAlbumImgList(info.url);
      logger.info(' > 获取到该相册图片列表数量', imgs.length);
      const fns = imgs.map(imgsrc => {
        return async () => {
          let filepath = basename(imgsrc);
          if (!filepath.includes('.')) filepath += '.jpg';
          filepath = resolve(saveDir, filepath);
          idx++;
          if (!existsSync(filepath) && existsSync(filepath.replace('.jpg', '.webp'))) {
            try {
              logger.info(` - 开始下载[${albumIdx}][${info.date}][${color.magenta(`${idx}/${info.count}`)}]`, imgsrc);
              await download({ url: imgsrc, filepath, segmentSize: 500 });
              const ext = extname(filepath);
              const fileType = await fileTypeFromFile(filepath);
              if (ext.toLowerCase() !== fileType.ext) {
                if (['webp', 'jpg'].includes(fileType.ext)) renameSync(filepath, filepath.replace(`.${ext}`, `.${fileType.ext}`));
                else logger.warn('存在非 webp、jpg 格式的类型');
              }
            } catch (err) {
              logger.error(` > [${albumIdx}][${info.date}][${color.magenta(`${idx}/${info.count}`)}]下载失败，请手动下载或稍后重试！`, imgsrc, saveDir, err.message || err);
              failedList.push({ url: imgs, info });
            }
          }
        };
      });
      await concurrency(fns, 8);
    }
  }

  logger.info('下载完毕！以下图片失败，请稍后重试或手动下载：', failedList.length, failedList);
}

start();
