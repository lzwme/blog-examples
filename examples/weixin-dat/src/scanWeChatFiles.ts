import { sync } from 'fast-glob';
import { existsSync, promises } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';

async function getWeChatFilesFromMac(fileTypes: string[]) {
  if (process.platform !== 'darwin') throw new Error('不支持的系统类型:' + process.platform);

  const result: { userInfo: string[]; files: string[] }[] = [];
  const xinWeChat = resolve(
    process.env.HOME || '',
    './Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/'
  );
  if (!existsSync(xinWeChat)) return result;

  const list = (await promises.readdir(xinWeChat)).map(d => resolve(xinWeChat, d));
  const accountDirs: string[] = [];
  for (const d of list) {
    (await promises.readdir(d)).forEach(n => {
      const npath = resolve(d, n);
      if (n.length === 32 && existsSync(resolve(npath, 'Account/userinfo.data'))) {
        accountDirs.push(npath);
      }
    });
  }

  for (const accountDir of accountDirs) {
    const userInfo = (await promises.readFile(resolve(accountDir, 'Account/userinfo.data'), 'utf8'))
      .split('�')
      .map(d => d.slice(2).trim())
      .filter(Boolean);
    const files = sync(`**/*.{${fileTypes.join(',')}}`, {
      cwd: resolve(accountDir, 'Message'),
      absolute: true,
    });

    if (userInfo.length || files.length) result.push({ userInfo, files });
  }

  return result;
}

async function getWeChatFilesFromWin(fileTypes: string[], baseDir?: string) {
  const result: { userInfo: string[]; files: string[] }[] = [];

  if (!baseDir) {
    // 尝试查找默认的微信文件所在位置
    const dirs = [resolve(homedir(), 'WeChat Files'), 'D:\\', 'E:\\', 'F:\\', 'G:\\'].filter(d => existsSync(d));
    for (const dir of dirs) {
      const list = sync('**/FileStorage', { cwd: dir, absolute: true, suppressErrors: true, deep: 5, onlyDirectories: true });

      if (list.length) {
        for (const d of list) {
          const accInfoFile = resolve(d, '../config/AccInfo.dat');
          if (existsSync(accInfoFile)) {
            const userInfo = (await promises.readFile(accInfoFile, 'utf8'))
              .split('�')
              .map(d => d.slice(2).trim())
              .filter(Boolean);
            const files = sync(`**/*.{${fileTypes.join(',')}}`, {
              cwd: d,
              absolute: true,
            });

            if (userInfo.length || files.length) result.push({ userInfo, files });
          }
        }
      }
    }
  }

  return result;
}

export function scanWeChatFiles(fileTypes: string[] = [], baseDir?: string) {
  if (!fileTypes.length) fileTypes = `dat,jpg,png,gif,bmp,pdf,doc,docx,xls,xlsx,ppt,pptx,avi`.split(',');

  return process.platform === 'win32' ? getWeChatFilesFromWin(fileTypes) : getWeChatFilesFromMac(fileTypes);
}
