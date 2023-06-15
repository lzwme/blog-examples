#!/usr/bin/env node

import { program } from 'commander';
import { color } from '@lzwme/fe-utils';
import { hanlder, logger } from './index.mjs';

program
  .description(color.cyanBright('基于 tinify API 的图片批量压缩工具'))
  .argument('[key]', 'Tinify API key')
  .option('-k, --key <key>', `Tinify API key。可前往 https://tinify.cn/developers 获取 API key。一个免费 API key 月免费额度为 500 次，可注册多个账号以增加月免费可用额度。大量使用可注册为 Pro 付费会员。`)
  .option('--debug', `开启调试模式。`)
  .option('-e, --ext <ext...>', `图片类型`, ['png', 'jpg', 'webp', 'jpeg'])
  .option('-s, --src <source>', `要处理的图片路径或目录`, process.cwd())
  .option('-d, --dest <dest>', `处理后的图片输出路径或目录，默认与 src 相同（即覆盖源文件）`)
  .option('-m, --min-size <size>', `要处理的图片最小值(KB)`, 100)
  .option('-T, --ignore-mtime <time>', `要处理的图片需多久以内未修改过(秒)`, 600)
  .action(async key => {
    const options = program.opts();
    if (options.debug) logger.updateOptions({ levelType: 'debug' });
    logger.debug(options);
    if (key) options.key = key;
    if (options.key) {
      hanlder(options);
    } else {
      logger.warn('tinify API key 不能为空！');
      program.help();
    }
  })
  .parse(process.argv);
