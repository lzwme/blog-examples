import { copyFileSync, existsSync, mkdir, promises, readdirSync, rmSync, rmdirSync, statSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { exec } from 'node:child_process';
import { color, concurrency, dateFormat, getLogger, mkdirp } from '@lzwme/fe-utils';
import glob from 'fast-glob';
import minimist from 'minimist';

const logger = getLogger('[FILE-CATE]');

interface Options {
  src?: string;
  destDir?: string;
  mode?: 'copy' | 'mv' | 'mv-shell';
  overwide?: boolean;
  /** 目录分类最小文件数 */
  cateMin?: number;
  dryRun?: boolean;
}

async function cpOrMvFile(idx: number, filepath: string, destpath: string, mode: Options['mode'] = 'copy', overwide = false) {
  if (existsSync(destpath) && !overwide) return false;

  logger.info(`[${color.magenta(idx)}][${mode}]: "${color.gray(filepath)}" => "${color.green(destpath)}"`);
  mkdirp(dirname(destpath));

  if (mode === 'mv-shell') {
    await new Promise(resolve => {
      exec(`mv "${filepath}" "${destpath}"`, { shell: process.platform === 'win32' ? 'powershell' : '/bin/sh' }, () => resolve(true));
    });
  } else if (mode === 'copy') {
    await promises.copyFile(filepath, destpath);
  } else if (mode === 'mv') {
    await promises.copyFile(filepath, destpath);
    await promises.rm(filepath);
  }

  return true;
}

/** 将指定目录的文件，按修改日期为目录分类整理 */
async function classifyFilesByDate(options: Options) {
  options = { src: process.cwd(), destDir: 'dest', mode: 'copy', cateMin: 10, ...options };

  let srcList = await glob('**/*', { absolute: true, cwd: options.src, onlyFiles: true });
  const statInfo = {
    total: srcList.length,
    count: 0,
    date: {} as Record<string, { total: number; list: { src: string; dest: string }[] }>,
  };

  // 过滤已存在于目标目录中的同名文件
  const destList = await glob('**/*', { absolute: true, cwd: options.destDir, onlyFiles: true });
  const destFileSet = new Set((destList.map(d => basename(d))));
  srcList = srcList.filter(srcFile => !destFileSet.has(basename(srcFile)));

  for (const filepath of srcList) {
    const stat = statSync(filepath);
    if (stat.isFile()) {
      const date = dateFormat('yyyy-MM-dd', stat.mtime);
      const dest = resolve(options.destDir!, date.slice(0, 4), date, basename(filepath));
      if (dest !== filepath) {
        if (!statInfo.date[date]) statInfo.date[date] = { total: 0, list: [] };
        statInfo.date[date].total++;
        statInfo.date[date].list.push({ src: filepath, dest });
      }
    }
  }

  // 小于 5 个的图片目录按月归类
  for (const [date, info] of Object.entries(statInfo.date)) {
    if (info.total < options.cateMin!) {
      const destDateDir = resolve(options.destDir!, date.slice(0, 4), date);
      if (existsSync(destDateDir) && options.mode !== 'copy') continue;
      // if (existsSync(destDateDir)) {
      //   if (options.mode === 'copy') {
      //     logger.info('rmdir', destDateDir, readdirSync(destDateDir, 'utf8').length, info.total);
      //     rmdirSync(destDateDir, { recursive: true });
      //   } else continue;
      // }

      const nDate = date.slice(0, -3);
      info.list.forEach(item => (item.dest = resolve(options.destDir!, date.slice(0, 4), nDate, basename(item.dest))));
      if (!statInfo.date[nDate]) statInfo.date[nDate] = info;
      else {
        statInfo.date[nDate].total += info.total;
        statInfo.date[nDate].list.push(...info.list);
      }
      delete statInfo.date[date];
    }
  }
  logger.info(statInfo, `文件总数：`, statInfo.total, `目录数：`, Object.keys(statInfo.date).length, options);

  // 开始复制或移动文件
  const fns = Object.values(statInfo.date).map(info => {
    return async () => {
      for (const item of info.list) {
        const { src: filepath, dest } = item;
        if (dest === filepath) continue;

        if (!existsSync(dest) || options.overwide) {
          await cpOrMvFile(statInfo.count++, filepath, dest, options.mode, options.overwide);
        }
      }
    };
  });

  if (!options.dryRun) await concurrency(fns);

  return statInfo;
}

/** 将指定目录的文件，按指定的文件类型过滤并移动至指定的目录中 */
async function filterFileByext(options: Pick<Options, 'src' | 'destDir' | 'mode' | 'overwide'> & { ext?: string[] }) {
  options = { src: process.cwd(), destDir: 'dest', mode: 'copy', ...options };
  if (typeof options.ext === 'string') options.ext = [options.ext];
  if (!Array.isArray(options.ext) || options.ext.length === 0) return logger.error('请指定要归类的文件类型');
  const exts = options.ext
    .filter(Boolean)
    .map(d => d.replace(/^\./, ''))
    .join(',');
  const srcList = await glob(`**/*.${exts}`, { absolute: true, cwd: options.src, onlyFiles: true });
  let count = 0;

  console.log('文件数：', srcList.length, exts);

  if (srcList.length) {
    const fns = srcList.map(filepath => {
      return async () => {
        const destpath = resolve(options.destDir!, basename(filepath));
        await cpOrMvFile(count++, filepath, destpath, options.mode);
      };
    });

    await concurrency(fns);
    logger.info(`执行完成！文件总数： ${color.cyan(srcList.length)}， 处理文件数： ${count}`);
  }

  return count;
}

const argv = minimist(process.argv.slice(2));
if (argv.type === 'date') {
  classifyFilesByDate({
    src: argv.src,
    destDir: argv.dest,
    mode: argv.mode || 'copy',
    dryRun: argv.dryRun,
    overwide: false,
    cateMin: +argv.cateMin || 10,
  });
} else if (argv.type === 'ext') {
  filterFileByext({ src: argv.src, destDir: argv.dest, mode: argv.mode || 'copy', overwide: false, ext: argv.ext });
} else {
  logger.error('请指定 type 参数');
}
