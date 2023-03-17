import { Request } from "@lzwme/fe-utils";

/**
 * 获取 bilibili 视频字幕
 *
 * @see https://github.com/sorrycc/url-system/blob/master/src/urlToContent/bilibili.ts
 * @see https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/info.md
 */

export async function getBilibiliCC(url: string, option: { cookie?: string; session?: string } = {}) {
  const req = Request.getInstance();
  const result = { title: '', content: '', errmsg: '' };
  const match = String(url).match(/^https:\/\/www\.bilibili\.com\/video\/([^\/]+)\/?/);

  if (!match) {
    result.errmsg = `输入的 URL 地址不合法: ${url}`;
    return result;
  }

  const bvid = match[1];
  const infoUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
  const { data } = await req.get<{
    code: number;
    message: string;
    ttl: number;
    data: {
      bvid: string;
      aid: string;
      videos: number;
      tid: number;
      tname: string;
      subtitle: { allow_submit: boolean; list: {subtitle_url: string }[] };
      title: string;
    }
  }>(infoUrl, {}, { cookie: option.cookie || `SESSDATA=${option.session || ''}` });
  // console.log(data);

  if (data.code) {
    result.errmsg = data.message || String(data.code);
  } else {
    result.title = data.data.title;

    const list = data.data.subtitle.list;
    if (list.length) {
      const { data: subTitleData } = await req.get<{ body: { from: string; content: string }[] }>(list[0].subtitle_url);
      result.content = subTitleData.body.map(d => `${d.from}: ${d.content}`).join('\n');
    } else {
      result.errmsg = `subtitle 字幕信息是空的，请确认填写了正确的 cookie 参数: ${infoUrl}`;
    }
  }

  return result;
}

// getBilibiliCC('https://www.bilibili.com/video/BV1MY4y1R7EN/?spm_id_from=333.1007.tianma.2-2-5.click', { cookie });
// getBilibiliCC(`https://www.bilibili.com/video/BV1Hv4y1a7SV/?spm_id_from=333.1073.high_energy.content.click`, {
//   session: process.env.BILI_SESSION // 718b5c65%2C1694588951%2C03663%2A3 x
// });
