import { program } from 'commander';
import { color, NLogger } from '@lzwme/fe-utils';
import fs from 'node:fs';
import aw from '@aspose/words';
import { extname, resolve } from 'node:path';

interface Options {
  srcDir?: string;
  destDir?: string;
  srcExt?: string;
  destExt?: string;
  force?: boolean;
}

const logger = new NLogger('[DC]');
const T = {
  stats: {
    count: 0,
  },
  convert(src: string, dest: string) {
    const doc = new aw.Document(src);
    doc.save(dest);
    logger.info(`${T.stats.count} 已转换：`, color.cyan(src), ' => ', color.green(dest));
    T.stats.count++;
    return doc;
  },
  handler(o: Required<Options>) {
    for (const filename of fs.readdirSync(o.srcDir)) {
      const filepath = resolve(o.srcDir, filename);
      const stat = fs.statSync(filepath);

      if (stat.isDirectory()) {
        T.handler({ ...o, srcDir: filepath, destDir: resolve(o.destDir, filename) });
      } else if (stat.isFile()) {
        const ext = extname(filename).slice(1);

        if (o.srcExt === ext) {
          const destPath = resolve(o.destDir, filename.replace(o.srcExt, o.destExt));
          if (!fs.existsSync(destPath) || o.force) T.convert(filepath, destPath);
          else logger.info(`跳过已存在的文件：${color.cyan(filepath)} => ${color.yellow(destPath)}`);
        }
      }
    }
  },
  start(option: Options) {
    const o = { srcDir: '.', destDir: '', srcExt: 'doc', destExt: 'docx', force: false, ...option };
    if (!o.destDir) o.destDir = o.srcDir;
    console.log(o);
    logger.info(`开始转换：${color.magenta(o.srcExt)} => ${color.green(o.destExt)} | ${color.blueBright(o.srcDir)}`);

    T.stats.count = 0;
    T.handler(o);
    logger.info(`处理完成！共转换了 ${color.green(T.stats.count)} 个文件`);
  },
};

program
  .option('-S, --srcDir <string>', '源文件夹路径')
  .option('-D, --destDir <string>', '转换结果保存的文件夹根路径')
  .option('--srcExt <string>', '源文件扩展名')
  .option('--destExt <string>', '要转换目标文件扩展名')
  .option('--debug', '调试模式')
  .option('-f, --force', '是否为强制模式。将覆盖已存在的文件')
  .action((option: Options) => {
    T.start(option);
  })
  .parse();
