import { copyFileSync, existsSync, promises, readdirSync, rmSync, rmdirSync, statSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { exec } from 'node:child_process';
import { concurrency, dateFormat, mkdirp } from '@lzwme/fe-utils';
import glob from 'fast-glob';
import minimist from 'minimist';

interface Options {
  src?: string;
  destDir?: string;
  mode?: 'copy' | 'mv' | 'mv-shell';
  overwide?: boolean;
  /** 目录分类最小文件数 */
  cateMin?: number;
  dryRun?: boolean;
}
/** 将指定目录的文件，按修改日期为目录分类整理 */
async function classifyFilesByDate(options: Options) {
  options = { src: process.cwd(), destDir: 'dest', mode: 'copy', cateMin: 10, ...options };

  let srcList = await glob('**/*', { absolute: true, cwd: options.src, onlyFiles: true });
  const destList = await glob('**/*', { absolute: true, cwd: options.destDir, onlyFiles: true });
  const destFileSet = new Set((destList.map(d => basename(d))));
  const statInfo = {
    total: srcList.length,
    count: 0,
    date: {} as Record<string, { total: number; list: { src: string; dest: string }[] }>,
  };

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
      if (existsSync(destDateDir))  {
        if (options.mode === 'copy') {
          console.log('rmdir', destDateDir, readdirSync(destDateDir, 'utf8').length, info.total);
          rmdirSync(destDateDir, { recursive: true });
        } else continue;
      }

      const nDate = date.slice(0, -3);
      info.list.forEach(item => item.dest = resolve(options.destDir!, date.slice(0, 4), nDate, basename(item.dest)));
      if (!statInfo.date[nDate]) statInfo.date[nDate] = info;
      else {
        statInfo.date[nDate].total += info.total;
        statInfo.date[nDate].list.push(...info.list);
      }
      delete statInfo.date[date];
    }
  }
  console.log(statInfo, `文件总数：`, statInfo.total, `目录数：`, Object.keys(statInfo.date).length, options);

  // 开始复制或移动文件
  const fns = Object.values(statInfo.date).map(info => {
    return async () => {
      for (const item of info.list) {
        const { src: filepath, dest } = item;
        if (dest === filepath) continue;

        if (!existsSync(dest) || options.overwide) {
          mkdirp(dirname(dest));
          console.log(`[${statInfo.count++}] ${options.mode}: "${filepath}" "${dest}"`);

          if (options.mode === 'mv-shell') {
            await new Promise(resolve => {
              exec(`mv "${filepath}" "${dest}"`, { shell: process.platform === 'win32' ? 'powershell' : '/bin/sh' }, () => resolve(true));
            });
          } else if (options.mode === 'copy') {
            await promises.copyFile(filepath, dest);
          } else if (options.mode === 'mv') {
            await promises.copyFile(filepath, dest);
            await promises.rm(filepath);
          }
        }
      }
    };
  });

  if (!options.dryRun) await concurrency(fns);

  return statInfo;
}

const argv = minimist(process.argv.slice(2));
classifyFilesByDate({ src: argv.src, destDir: argv.dest, mode: argv.mode || 'copy', dryRun: argv.dryRun, overwide: false, cateMin: +argv.cateMin || 10 });
