import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJsonFileSync } from '@lzwme/fe-utils';
import { config as dConfig } from 'dotenv';
import { writeFileSync } from 'node:fs';
import { logger, ghReq, fixSiteUrl } from './utils.js';

type BoolLike = boolean | 0 | 1 | 9;

export interface SiteInfo {
  /** github 仓库 */
  repo?: string;
  /** 推荐等级(1-3) */
  star?: number;
  /** 需人工验证。-1 已确认，且无需程序检测；大于等于 3 则显示为 ？ 状态 */
  needVerify?: number;
  /** 已失效 */
  invalid?: BoolLike | string;
  /** 不展示（失效超过30天等） */
  hide?: BoolLike;
  title?: string;
  /** 描述信息 */
  desc?: string;
  /** 程序检测到的错误信息 */
  errmsg?: string;
  /** 类别 */
  type?: string | string[];
  update?: number;
}

const rootDir = resolve(fileURLToPath(import.meta.url), '../..');

export const config = {
  rootDir,
  ci: Boolean(process.env.CI || process.env.SYNC),
  siteInfoFile: resolve(rootDir, 'site.json'),
  debug: false,
  isOnlyNew: false,
  urlCheckMaxTry: 7,
  gptDemoRepos: new Map<string, SiteInfo>([
    // [`lvwzhen/teach-anything`, {}],
    // [`ddiu8081/chatgpt-demo`, {}],
    // [`ourongxing/chatgpt-vercel`, {}],
    // [`cogentapps/chat-with-gpt`, { needKey: true, needVPN: true }],
    // [`Yidadaa/ChatGPT-Next-Web`, { needKey: 1, needPwd: 1 }],
    // [`yesmore/QA`, {}],
  ]),
  /** github 仓库禁止列表: hide=1、[siteInfo].repoBlockList */
  repoBlockMap: new Map<string, string>([]),
  /** 站点禁止列表: hide=1 */
  siteBlockList: new Set([]) as Set<string>,
  /** 站点信息 */
  siteInfo: {} as { [url: string]: SiteInfo },
};

export function initConfig(argv: Record<string, unknown>) {
  dConfig();
  config.debug = Boolean(argv.debug || process.env.DEBUG);
  config.isOnlyNew = Boolean(argv.onlyNew);

  type T = Pick<typeof config, 'siteInfo'>;
  const info = readJsonFileSync<T>(config.siteInfoFile);
  Object.assign(config.siteInfo, info.siteInfo);

  for (const [url, info] of Object.entries(config.siteInfo)) {
    let fixedUrl = fixSiteUrl(url);
    if (fixedUrl !== url) {
      delete config.siteInfo[url];
      config.siteInfo[fixedUrl] = info;
    }

    if (info.hide) {
      config.siteBlockList.add(url);
      if (info.repo) config.repoBlockMap.set(info.repo, url);
    }
  }

  logger.updateOptions({ levelType: config.debug ? 'debug' : 'log' });
  logger.debug('config:', config);

  return config;
}

export function saveConfig() {
  const info = {
    siteInfo: config.siteInfo,
  };
  writeFileSync(config.siteInfoFile, JSON.stringify(info, null, 2), 'utf8');
}
