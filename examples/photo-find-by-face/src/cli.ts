import { resolve } from 'node:path';
import { program } from 'commander';
import { cyanBright, cyan, magenta, green } from 'console-log-colors';
import { AnyObject, PackageJson, readJsonFileSync } from '@lzwme/fe-utils';
import { logger } from './helper';
import { PhotoFaceFind } from './face';

interface CliOptions extends AnyObject {
  silent?: boolean;
  distanceThreshold?: number;
}

const pkg = readJsonFileSync<PackageJson>(resolve(__dirname, '../package.json'));

process.on('unhandledRejection', (r, p) => {
  console.log('[退出][unhandledRejection]', r, p);
  process.exit();
});
process.on('SIGINT', signal => {
  logger.info('[SIGINT]强制退出', signal);
  process.exit();
});

function getOptions() {
  const options = program.opts<CliOptions>();
  if (options.debug) {
    logger.updateOptions({ levelType: 'debug' });
  } else if (options.silent) {
    logger.updateOptions({ levelType: 'silent' });
    options.progress = false;
  }
  return options;
}

program
  .version(pkg.version, '-v, --version')
  .description(cyanBright(pkg.description))
  // .argument('<m3u8Urls...>', 'm3u8 url。也可以是本地 txt 文件，指定一组 m3u8，适用于批量下载的场景')
  .option('--silent', `开启静默模式。`)
  .option('--debug', `开启调试模式。`)
  .option('-f, --image-file <name>', `指定包含人脸的一张照片`)
  .option('-d, --dirs <...dirs>', `指定要查找相似图片的一个或多个目录`)
  .option('-D, --distanceThreshold <value>', '相似度容差。0~1 之间', '0.5')
  .action(async (urls: string[]) => {
    const options = getOptions();
    logger.debug(urls, options);

    if (!options.imageFile) return logger.warn('请指定要查找的图片');
    if (!options.dirs?.length) return logger.warn('请指定要查找的图片目录');

    const pff = new PhotoFaceFind({
      distanceThreshold: options.distanceThreshold,
    });
    await pff.loadModels();
    const similarFaces = await pff.searchSimilarFaces({
      imageFile: options.imageFile,
      directoryPath: options.dirs,
      onprogress: opt => {
        if (opt.type === 'start') return logger.info(`图片总数：${cyan(opt.total)} 开始搜索图片...`);
        if (opt.type === 'match-start') return logger.debug(`[${opt.current}/${opt.total}]开始匹配图片`, opt.filePath);

        if (opt.type === 'matched') {
          if (opt.distance! < 0.001) {
            logger.log(` - 相同图片：[${opt.current}][face: ${opt.matched}][distance: ${opt.distance}]`, magenta(opt.filePath));
          } else logger.log(` - 匹配到图片：[${opt.current}][face: ${opt.matched}][distance: ${opt.distance}]`, cyan(opt.filePath));
        }
      },
    });

    console.log(` - ${similarFaces.map(d => d.filePath).join('\n - ')}`);
    logger.info(`查找完成！匹配到 ${green(similarFaces.length)} 张相似照片`);
  });

program.parse(process.argv);
