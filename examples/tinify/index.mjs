import tinify from 'tinify';
import { program } from 'commander';
import fg from 'fast-glob';
import { promises, statSync } from 'fs';
import { color, getLogger, concurrency } from '@lzwme/fe-utils';

const logger = getLogger('tinify');

async function doCompress(fileSrc, fileOut = fileSrc, sStat = statSync(fileSrc)) {
  if (!sStat) sStat = await promises.stat(fileSrc);

  const source = tinify.fromFile(fileSrc);
  await source.toFile(fileOut);
  const oStat = await promises.stat(fileOut);

  const rate = ((sStat.size - oStat.size) / sStat.size) * 100;

  return { oSize: oStat.size, sSize: sStat.size, rate };
}

async function hanlder(options) {
  tinify.key = options.key;
  if (!options.ext) options.ext = ['png', 'jpg', 'jpeg', 'webp'];

  options.ext = options.ext.map(d => (String(d).startsWith('.') ? String(d).slice(1) : d));

  if (!options.src) options.src = process.cwd();

  const srcStat = await promises.stat(options.src);
  const pattern = `**/*.{${options.ext.join(',')}}`;

  const fileList = srcStat.isFile() ? [options.src] : await fg(pattern, { absolute: true, cwd: options.src });
  const minSize = (options.minSize || 0) * 1024;
  const ignoreMtime = (+options.ignoreMtime || 600) * 1000;
  const info = {
    total: 0,
    totalSize: 0,
    totalOSize: 0,
  };

  logger.info(color.cyanBright(`Total: ${fileList.length}, Size Limit: ${minSize}, Pattern:${pattern}`));

  const taskList = fileList.map(filepath => {
    return async () => {
      if (minSize) {
        const stat = await promises.stat(filepath);
        if (stat.size < minSize) return;
        // N分钟内修改过不处理
        if (Date.now() - stat.mtime.getTime() < ignoreMtime) return;
      }

      logger.log(`[${info.total + 1}] compressing for:`, color.cyan(filepath));

      const { oSize, sSize, rate } = await doCompress(filepath);

      info.total++;
      info.totalSize += sSize;
      info.totalOSize += oSize;

      logger.log(
        '  done!',
        color.magentaBright(Number(oSize / 1024).toFixed(2) + 'KB'),
        '/',
        color.blueBright(Number(sSize / 1024).toFixed(2) + 'KB'),
        color.greenBright(`-${rate.toFixed(2)}%`)
      );
    };
  });

  await concurrency(taskList, +options.parallel || 6);

  const totalRate = Number(((info.totalSize - info.totalOSize) / info.totalSize) * 100).toFixed(2);
  logger.info(`处理完成！共处理文件数: ${color.greenBright(info.total)}个, 压缩率: ${color.greenBright(totalRate)}%`, info);
}

program
  .description(color.cyanBright('基于 tinypng.com API 调用的图片压缩'))
  .argument('<key>', 'Tinify key')
  .option('-k, --key <key>', `Tinify key`)
  .option('--debug', `开启调试模式。`)
  .option('-e, --ext <ext...>', `图片类型`, ['png', 'jpg', 'webp', 'jpeg'])
  .option('-s, --src <source>', `要处理的图片路径或目录`, process.cwd())
  .option('-m, --min-size <size>', `要处理的图片最小值(KB)`, 100)
  .option('-T, --ignore-mtime <time>', `要处理的图片需多久以内未修改过(秒)`, 600)
  // .option('-o, --out <output>', `处理后的输出路径。默认为原始路径`)
  .action(async key => {
    const options = program.opts();
    if (options.debug) logger.updateOptions({ levelType: 'debug' });
    logger.debug(options);
    if (key) options.key = key;

    options.key ? hanlder(options) : program.help();
  })
  .parse(process.argv);
