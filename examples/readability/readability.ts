import { Request } from '@lzwme/fe-utils';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

/** 根据 url 获取其页面内容 */
export async function getContentByUrl(url: string, params?: Record<string, unknown>) {
  const r = await Request.getInstance().get<string>(url, params);
  const doc = new JSDOM(r.buffer.toString('utf8'), { url, runScripts: 'dangerously' });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();
  // console.log(article);
  return article;
}

// getContent('https://zhuanlan.zhihu.com/p/262177354');
