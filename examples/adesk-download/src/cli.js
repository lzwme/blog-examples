#!/usr/bin/env node

import { readJsonFileSync, color } from '@lzwme/fe-utils';
import { Option, program } from 'commander';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AdeskDownload } from './AdeskDownload.js';

const pkg = readJsonFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../package.json'));

program
  .version(pkg.version, '-v, --version')
  .description(color.yellow(pkg.description) + ` [version@${color.cyanBright(pkg.version)}]`)
  .option('-t, --type <cate...>', '指定要下载的分类')
  .addOption(new Option('-o, --order <order>', `排序类型`).choices(['hot', 'new', 'favs']), 'hot')
  .option('-l, --limit <port>', '单一分类最多下载的数量', '1000')
  .option('-d, --downloadDir <dir>', '指定图片保存的目录', 'download')
  // .option('--debug', `开启调试模式。`, false)
  .action(opts => {
    new AdeskDownload(opts).start();
  });

program.parse(process.argv);
