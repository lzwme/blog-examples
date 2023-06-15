import tinify from 'tinify';
import fg from 'fast-glob';
import { existsSync, promises, statSync } from 'fs';
import { color, getLogger, concurrency, mkdirp } from '@lzwme/fe-utils';
import { dirname, resolve } from 'path';

export const logger = getLogger('[TINIFY]');

async function doCompress(fileSrc, fileOut = fileSrc, sStat = statSync(fileSrc)) {
  if (!sStat) sStat = await promises.stat(fileSrc);
  mkdirp(dirname(fileOut));
  const source = tinify.fromFile(fileSrc);
  await source.toFile(fileOut);
  const oStat = await promises.stat(fileOut);

  return { oSize: oStat.size, sSize: sStat.size, rate: +((sStat.size - oStat.size) / sStat.size) * 100 || 0 };
}

function formatOptions(options) {
  if (!options.ext) options.ext = ['png', 'jpg', 'jpeg', 'webp'];
  options.ext = options.ext.map(d => (String(d).startsWith('.') ? String(d).slice(1) : d));

  options.parallel = Math.max(+options.parallel || 6, 1);
  options.src = resolve(process.cwd(), options.src || process.cwd());
  options.dest = resolve(process.cwd(), options.dest || options.src);

  logger.debug('options formated:', options);
  return options;
}

export async function hanlder(options) {
  options = formatOptions(options);

  tinify.key = options.key;

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
  const taskList = fileList.map(filepath => {
    filepath = resolve(filepath);

    return async () => {
      const stat = await promises.stat(filepath);

      if (minSize && stat.size < minSize) return;

      const destPath = srcStat.isFile()
        ? options.dest
        : options.src === options.dest
        ? filepath
        : String(filepath).replace(options.src, options.dest);

      if (existsSync(destPath)) {
        const oStat = await promises.stat(destPath);
        if (oStat.isFile() && Date.now() - oStat.mtime.getTime() < ignoreMtime) return;
      }

      logger.info(`[${info.total + 1}] compressing for:`, color.cyan(filepath));
      const { oSize, sSize, rate } = await doCompress(filepath, destPath, stat);

      info.total++;
      info.totalSize += sSize;
      info.totalOSize += oSize;

      logger.info(
        '  done!',
        color.magentaBright(Number(oSize / 1024).toFixed(2) + 'KB'),
        '/',
        color.blueBright(Number(sSize / 1024).toFixed(2) + 'KB'),
        color.greenBright(`-${rate.toFixed(2)}%`)
      );
    };
  });

  logger.info(color.cyanBright(`Total: ${fileList.length}, Size Limit: ${minSize}, Pattern: ${pattern}`));
  const r = await concurrency(taskList, Math.min(taskList.length, +options.parallel || 6));
  logger.debug('all result', r);

  const totalRate = +Number(((info.totalSize - info.totalOSize) / info.totalSize) * 100).toFixed(2) || 0;
  logger.info(`处理完成！共处理文件数: ${color.greenBright(info.total)}个, 压缩率: ${color.greenBright(totalRate)}%`, info);
  return info;
}
