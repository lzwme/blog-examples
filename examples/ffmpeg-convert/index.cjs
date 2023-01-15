const path = require('node:path');
const fs = require('node:fs');
const { execSync, getLogger } = require('@lzwme/fe-utils');
const glob = require('fast-glob');
const argv = require('yargs-parser')(process.argv.slice(2));
const logger = getLogger('FFMPEG-CONVERTER');

async function ffmpegBatchConvert(options = argv) {
  if (options.debug) {
    logger.updateOptions({ levelType: 'debug' });
  }

  logger.debug('参数：', options);

  const result = { code: 0, msg: '', converted: 0, failed: 0, total: 0 };
  const src = options.src || process.cwd();
  const srcType = options.srcType || 'mp3';
  const targetType = options.targetType || options['target'];

  if (!targetType) {
    result.msg = '请指定要转换的目标文件类型';
    return result;
  }

  const fileList = await glob(`**/*.${srcType}`, { absolute: true, cwd: src });

  const inArgs = options.inArg ? [options.inArg] : ['-y'];
  const outArgs = options.outArg ? [options.outArg] : [];

  // GPU 硬件解码参数
  if (!inArgs.some(d => d.includes('-hwaccel'))) {
    if (process.platform === 'darwin') {
      inArgs.push('-hwaccel videotoolbox');
    } else {
      // TODO: get hwaccel
    }
  }

  if (!outArgs.some(d => d.includes('-c:v'))) {
    if (process.platform === 'darwin') {
      outArgs.push('-c:v h264_videotoolbox');
    } else {
      // TODO: get c:v
    }
  }

  result.total = fileList.length;
  result.data = fileList.map(d => {
    const targetFile = d.replace(new RegExp(`${srcType}$`), targetType);
    const r = { code: 0, msg: '', src: d, target: targetFile };

    if (fs.existsSync(targetFile) && !options.overwide) {
      r.msg = '文件已存在，忽略转换';
      return r;
    }

    const cmd = `ffmpeg ${inArgs.join(' ')} -i "${d}" ${outArgs.join(' ')} "${targetFile}"`;
    logger.info(' > Run cmd:', cmd);
    try {
      r.msg = execSync(cmd, options.silent ? 'pipe' : 'inherit').stderr || 'success';
      result.converted++;
    } catch (e) {
      result.failed++;
      r.msg = e.message || e;
    }

    return r;
  });

  logger.debug('Done!', result);

  return result;
}

module.exports = ffmpegBatchConvert;

if (module === require.main) ffmpegBatchConvert(argv);
