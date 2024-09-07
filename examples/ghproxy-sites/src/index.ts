/*
 * @Author: renxia
 * @Date: 2023-04-06 13:25:28
 * @LastEditors: renxia
 * @LastEditTime: 2024-09-09 14:57:06
 * @Description:
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import parser from 'yargs-parser';
import { gitCommit, logger } from './utils.js';
import { siteUrlVerify } from './siteUrlVerify.js';
import { config, initConfig, saveConfig, type SiteInfo } from './config.js';
import { dateFormat } from '@lzwme/fe-utils';

function formatSiteList() {
  const list = Object.entries(config.siteInfo)
    .filter(([_url, info]) => {
      Object.entries(info).forEach(([key, value]) => {
        if (value === 0 || value === false) delete info[key as keyof SiteInfo];
      });
      return !info.hide;
    })
    .sort((a, b) => {
      for (const key of ['invalid', 'needVerify'] as const) {
        if ('needVerify' == key) {
          if (a[1].needVerify! > 2 || b[1].needVerify! > 2) return a[1].needVerify! > 2 ? 1 : -1;
        } else if (a[1][key] !== b[1][key]) return a[1][key] ? 1 : -1;
      }

      if (a[1].star !== b[1].star) return (b[1].star || 1) - (a[1].star || 1);

      return a[0] > b[0] ? 1 : -1;
    });

  const mdContent = list
    .map(([url, info]) => {
      return [
        '',
        info.invalid ? '❌' : (Number(info.needVerify) > 0 ? '⚠️' : '✅'),
        url, info.title,
        info.errmsg ? `\`${info.errmsg}\`` : info.desc,
        dateFormat('yyyy-MM-dd hh:mm:ss', info.update || Date.now()),
        '',
      ].join(' | ').trim();
    });
    mdContent.unshift(`| 状态 | 链接 | 标题 | 描述 | 更新时间 |\n|:-:| :-:|:-:|:-:|:-:|`);

    return { list, mdContent: mdContent.join('\n') };
}

async function updateReadme() {
  const rdFile = resolve(config.rootDir, 'README.md');
  const { list, mdContent } = formatSiteList();
  const content = readFileSync(rdFile, 'utf8');
  const updated = content.replace(/站点列表\([\s\S]+\n\n## /g, `站点列表(${list.length})：\n\n${mdContent}\n\n## `);

  if (updated !== content) writeFileSync(rdFile, updated, 'utf8');
  else logger.log('[UPDATE-READE] No Chagned');

  return list.length;
}

export async function start() {
  const argv = parser(process.argv.slice(2));
  logger.debug('argv', argv);
  initConfig(argv);

  if (argv.url) {
    await siteUrlVerify();
    saveConfig();
  }

  const total = await updateReadme();
  if (config.ci || argv.ci || argv.commit) gitCommit();

  return total;
}

start().then(total => {
  logger.info(`done! Total: ${total} / ${Object.keys(config.siteInfo).length}`);
  process.nextTick(() => process.exit());
});
