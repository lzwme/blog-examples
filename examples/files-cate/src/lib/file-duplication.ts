/*
 * @Author: renxia
 * @Date: 2023-11-03 13:55:18
 * @LastEditors: renxia
 * @LastEditTime: 2023-11-03 15:15:03
 * @Description:
 */

import fs, { unlinkSync } from 'node:fs';
import path from 'node:path';
import glob from 'fast-glob';
import { color, md5 } from '@lzwme/fe-utils';

interface FileDuplicationOptions {
  /** glob 语法 */
  source: string;
  cwd?: string;
  dryRun?: boolean;
  debug?: boolean;
}

/**
 * 文件去重
 * @param params
 */
export async function fileDuplication(params: FileDuplicationOptions) {
  params = {
    ...params,
  };
  if (!params.cwd) params.cwd = process.cwd();

  const statInfo = {
    code: 0,
    data: {} as { [md5: string]: string[] },
    /** 重复文件数（删除文件数） */
    dcount: 0,
  };

  const fileList = await glob(params.source || '**/*', { cwd: params.cwd || process.cwd(), absolute: true });
  // console.log('fileList', fileList);

  for (const file of fileList) {
    const fileMd5 = md5(file, true);
    if (!statInfo.data[fileMd5]) {
      statInfo.data[fileMd5] = [file];
    } else {
      statInfo.dcount++;
      statInfo.data[fileMd5].push(file);
      console.log(`${ params.dryRun ? '[drynRun]' : '' }存在重复文件:\n -`, statInfo.data[fileMd5].join('\n - '));
      if (params.dryRun !== true) {
        console.log(' > 删除重复文件：', color.red(file));
        unlinkSync(file);
      }
    }
  }

  // const dList = Object.values(statInfo.data).filter(d => d.length > 1);
  // if (dList.length) console.log(`全部重复的文件：`, dList);
  console.log(`文件总数： ${fileList.length}, 重复文件数：${statInfo.dcount}`);

  return statInfo;
}

/** 删除指定路径下所有的空目录 */
export function rmEmptyDir(dir: string) {
  if (fs.statSync(dir).isDirectory() === false) return;

  let files = fs.readdirSync(dir);

  if (files.length > 0) {
    for (const filename of files) {
      const filepath = path.resolve(dir, filename);
      if (fs.statSync(filepath).isDirectory()) rmEmptyDir(filepath);
    }

    files = fs.readdirSync(dir);
  }

  if (files.length === 0) return fs.rmdirSync(dir);
}
