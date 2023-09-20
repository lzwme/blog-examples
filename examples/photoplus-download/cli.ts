import { resolve } from 'path';
import { program } from 'commander';
import { logger, photoplusDl } from './index.js';

program
  .argument('activityNo', '活动ID或活动URL地址')
  .option('-d, --save-dir', '图片下载保存的路径', resolve('img'))
  .option('--count', '获取图片的总数。默认为 2000', '2000')
  .action((activityNo, option) => {
    activityNo = Number(String(activityNo).match(/\d{7,}/)?.[0]);
    if (!activityNo) return logger.error('活动ID不正确，请检查');

    photoplusDl({
      saveDir: option.saveDir,
      params: {
        activityNo,
        count: +option.count || 2000,
      },
    });
  })
  .parse();
