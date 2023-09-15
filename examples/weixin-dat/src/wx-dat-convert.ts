import { sync } from 'fast-glob';
import { basename, dirname, resolve } from 'path';
import { existsSync, promises } from 'fs';
import { concurrency, dateFormat, getLogger, md5 } from '@lzwme/fe-utils';
import { scanWeChatFiles } from './scanWeChatFiles.js';
import { datConvert, getDatType } from './utils.js';

interface WDCOptions {
  /** 自动检测 */
  autoDetect?: boolean;
  /** dat 源文件目录 */
  src?: string;
  /** 转换后的输出目录。默认与 src 相同 */
  dest?: string;
  /** 按文件后缀过滤。默认为 .dat */
  ext?: string;
  /** 按文件大小过滤。0 表示不过滤 */
  minFileSize?: number;
  /** 是否过滤缩略图。默认为 true */
  ignoreThumb?: boolean;
  /** 是否过滤相同的文件（名称不同） */
  ignoreSameFile?: boolean;
  debug?: boolean;
  /** 并行处理任务数。默认为 50 */
  parallel?: number;
}

export class WxDatConvert {
  private logger = getLogger('wx-dat-convert');
  private options: WDCOptions = {};
  private cache = {
    /** 所有文件的 md5 值 */
    filesMd5: {} as { [md5: string]: string[] },
  };

  getDatFiles(srcDir: string, destDir?: string, ext = '.dat') {
    srcDir = resolve(srcDir);
    if (destDir) destDir = resolve(destDir);
    if (srcDir === destDir) destDir = '';

    this.logger.info('源文件目录:', srcDir);
    this.logger.info('输出文件目录:', destDir);

    const datList = sync(`**/*${ext}`, { cwd: srcDir, absolute: false });
    return datList.map(filepath => {
      filepath = resolve(srcDir, filepath);
      const item = {
        src: filepath,
        dest: destDir ? filepath.replace(srcDir, destDir) : filepath,
      };
      return item;
    });
  }
  async convert(filepath: string, destpath: string) {
    const content = await promises.readFile(filepath);
    const { ext, v } = getDatType(content, filepath);
    const fileMd5 = md5(content, false);
    const stats = await promises.stat(filepath);
    const result = { src: filepath, dest: destpath.replace(/\.dat$/, '.' + ext), md5: fileMd5, stats, ignored: true };

    if (this.options.ignoreThumb && filepath.includes('_thumb.') || filepath.includes('Thumb')) return result;

    if (!this.cache.filesMd5[fileMd5]) {
      this.cache.filesMd5[fileMd5] = [filepath];
    } else {
      this.cache.filesMd5[fileMd5].push(filepath);
      if (this.options.ignoreSameFile) {
        this.logger.info('文件重复，忽略:', this.cache.filesMd5[fileMd5]);
        return result;
      }
    }

    const destDir = dirname(result.dest);
    const destName = `${dateFormat('yyyy-MM-dd_hhmmss', result.stats.atime)}_${basename(result.dest)}`;

    result.dest = resolve(destDir, destName);

    this.logger.debug('ext:', ext, v);
    if (!existsSync(destDir)) await promises.mkdir(destDir, { recursive: true });
    if (existsSync(result.dest)) {
      this.logger.info('文件已存在：', result.dest);
    } else  {
      const { converted } = datConvert(content, filepath);
      if (converted) {
        await promises.writeFile(result.dest, converted);
        this.logger.info('写入文件：', result.dest);
      }
    }
    result.ignored = !existsSync(result.dest);
    return result;
  }
  async start(options: WDCOptions = { src: process.cwd() }) {
    options = {
      src: process.cwd(),
      dest: './output',
      ext: '.dat',
      ignoreThumb: true,
      minFileSize: 10 * 1024 * 1024,
      ...options,
    };

    if ('auto' in options) options.autoDetect = true;
    if (typeof options.ext === 'boolean') options.ext = '';
    options = Object.assign(this.options, options);

    if (options.debug) this.logger.updateOptions({ levelType: 'debug', debug: true });
    this.logger.info('start. options', options);

    let fileList: { src: string; dest: string }[] = [];

    if (options.autoDetect) {
      const info = await scanWeChatFiles();
      info?.forEach(item => {
        item.files.forEach(d => fileList.push({ src: d, dest: resolve(options.dest!, basename(d)) }));
      });
    } else {
      fileList = this.getDatFiles(options.src!, options.dest, options.ext);
    }

    if (!fileList.length) {
      this.logger.info('没有发现需要处理的文件，请确认！SrcDir:', options.src);
      return;
    }
    this.logger.debug(fileList);

    const result = await concurrency(
      fileList.map(d => () => this.convert(d.src, d.dest)),
      Math.max(1, this.options.parallel || 50)
    );

    const successCount = result.filter(n => false === n.result?.ignored).length;
    const ignoredCount = result.filter(n => true === n.result?.ignored).length;
    const failedCount = result.filter(n => n.error).length;

    this.logger.debug(result);
    this.logger.info(`处理完成！文件总数：${result.length}，成功：${successCount}, 忽略：${ignoredCount}, 失败：${failedCount}`);
    return result;
  }
}

if (module === require.main) {
  import('yargs-parser').then(yp => new WxDatConvert().start(yp.default(process.argv.slice(2)) as WDCOptions));
}
