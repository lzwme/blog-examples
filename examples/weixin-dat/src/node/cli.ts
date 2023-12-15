/*
 * @Author: renxia
 * @Date: 2023-12-15 10:01:43
 * @LastEditors: renxia
 * @LastEditTime: 2023-12-15 10:16:56
 * @Description:
 */
import { program } from 'commander';
import { WxDatConvert, type WDCOptions } from './wx-dat-convert';

program
  .description('微信 dat 文件批量解密工具')
  .option('-s, --src <path>', 'dat 源文件或目录')
  .option('-d, --dest <path>', '转换后的输出目录。默认为当前路径下的 dat 目录', 'dat')
  .option('--ext [ext]', '制定按文件后缀过滤，默认为 dat。若不指定值则按后缀过滤，处理 src 下的所有文件')
  .option('--minFileSize <size>', '按文件大小过滤。0 表示不过滤。默认为 10 * 1024 * 1024')
  .option('--no-ignore-thumb', '是否不过滤缩虑图。默认过滤')
  .option('--no-ignore-same-file', '是否不过滤相同的文件（名称不同）。默认过滤')
  .option('--parallel <num>', '并行处理任务数。默认为 50', '50')
  .option('--debug', '调试模式')
  .action((options: WDCOptions) => {
    if (options.src) {
      new WxDatConvert().start(options);
    } else {
      program.help();
    }
  })
  .parse();
