import { concurrency, color, httpLinkChecker } from '@lzwme/fe-utils';
import { config } from './config.js';
import { logger } from './utils.js';

export function siteUrlVerify() {
  const now = Date.now();
  const needVPNKeywords = ['vercel.app', 'openai.com', 'bing.com'];
  const isGitHubCi = (process.env.GITHUB_CI || process.env.SYNC) != null;

  const tasks = Object.entries(config.siteInfo).map(([url, item], idx) => async () => {
    if (Number(item.hide) === 1) return true;

    if (!isGitHubCi) {
      // if (item.needVPN) return true;
      if (needVPNKeywords.some(key => url.includes(key))) return true;
      if (item.star! >= 3) return true;
    }

    if (item.needVerify != null && item.needVerify < 0) return true;

    logger.debug(`[urlVerify][${idx}] start for`, color.green(url));
    const startTime = Date.now();

    // 先做 gh-proxy 文件访问测试
    if (!item.hide && (item.needVerify || 0) < config.urlCheckMaxTry) {
      const r = await checkGHProxy(url, idx);

      item.update = now;
      if (r.code) {
        item.invalid = 1;
      } else {
        (['errmsg', 'needVerify', 'invalid'] as const).forEach(k => item[k] && delete item[k]);
        return r;
      }
    }

    const r = await httpLinkChecker(url, {
      verify: body => /<body/i.test(body) || /<\/body>/i.test(body),
      reqOptions: { timeout: 10_000, rejectUnauthorized: false },
    });

    if (r.code) {
      // 30x 为正常
      if (r.redirected || String(r.code).startsWith('30')) r.code = 0;

      // ignore TSL error
      if (r.errmsg.includes('network socket disconnected before secure TLS connection')) {
        r.code = 0;
        r.body = '';
      }

      if (String(r.errmsg).startsWith('<html><script>')) r.code = 0;
    }

    if (r.code) {
      if (r.redirected) {
        delete item.needVerify;
        item.desc = `Redirect to: ${r.url}`;
        if (!config.siteInfo[r.url]) config.siteInfo[r.url] = {};
        logger.debug(`[urlVerify][${color.cyan(url)}]`, color.greenBright(item.desc), r);
      } else {
        if (!item.needVerify || item.needVerify > 0) item.needVerify = (item.needVerify || 0) + 1;
        item.errmsg = `[error][${r.statusCode || r.code}]${r.errmsg}`.slice(0, 200);

        const errKeys = ['404'];
        if (item.needVerify >= config.urlCheckMaxTry) {
          if (r.statusCode == 404 || errKeys.some(k => r.errmsg?.includes(k))) {
            delete config.siteInfo[url];
          } else {
            item.hide = 1;
          }
        }

        logger.warn(
          `[urlVerify][${idx}][${color.yellow(url)}]`,
          r.statusCode,
          r.errmsg.slice(0, 300),
          r.url == url ? '' : color.cyan(r.url)
        );
      }
    } else {
      if ('needVerify' in item) {
        if (item.needVerify && item.needVerify > 0) delete item.needVerify;
      }

      (['errmsg', 'invalid'] as const).forEach(k => item[k] && delete item[k]);

      if (!item.title && r.body) {
        const title = r.body.match(/<title>(.*)<\/title>/)?.[1];
        if (title) item.title = title;
        if (item.title === item.desc) delete item.desc;
      }
    }

    const timeCost = Date.now() - startTime;

    if (timeCost > 5000 && !r.code) logger.warn(`[urlVerify][${idx}][slow]`, color.magenta(url), color.red(timeCost));
    else logger.debug(`[urlVerify][${idx}]done!`, color.green(url), color.cyan(timeCost));
    return r;
  });

  return concurrency(tasks, 6);
}

async function checkGHProxy(url: string, idx: number) {
  url = `${url.replace(/\/$/, '')}/https://raw.githubusercontent.com/lzwme/blog-examples/blob/main/examples/ghproxy-sites/README.md`;

  const r = await httpLinkChecker(url, {
    reqOptions: { timeout: 10_000, rejectUnauthorized: false },
    verify: body => {
      const t = body.includes('ChatGPT');
      if (!t) console.log('代理测试失败！', color.red(url), body.slice(0, 100));
      return t;
    },
  });
  const valid = r.code == 0;

  if (!valid) {
    logger.warn(`[GHProxy][${idx}] 检测失败！`, r.code, r.errmsg, r.statusCode, color.red(url));
  } else {
    logger.debug(`[GHProxy][${idx}] 检测通过！`, color.green(url));
  }

  return r;
}
