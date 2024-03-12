import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { NLogger } from '@lzwme/fe-utils';
import { glob } from 'fast-glob';

export const logger = new NLogger('[FACE-FIND]');

export const SUPPORT_IMAGE_EXT = ['bmp', 'jpeg', 'png', 'gif'];

export async function getImages(directoryPath: string | string[], ext: string[], minSize: number = 0) {
  const images: string[] = [];

  if (typeof directoryPath === 'string') directoryPath = [directoryPath];
  for (const dir of directoryPath) {
    const list = await glob(`**/*.{${ext.join(',')}}`, { cwd: dir, absolute: true, stats: true, caseSensitiveMatch: false });
    list.forEach(item => {
      if (item.stats!.size >= minSize) images.push(item.path);
    });
    // images = images.concat(files); // 元素多时 concat 性能好
  }

  return images;
}

export async function getImageBuffer(imagePath: string, quality = 0.3, ext?: string) {
  try {
    if (!ext) ext = extname(imagePath);
    ext = ext.slice(1).toLocaleLowerCase();

    let buffer = readFileSync(imagePath);
    // if (!ext || SUPPORT_IMAGE_EXT.includes(ext)) return buffer;

    if (ext === 'heic') {
      const { default: heicConvert } = await import('heic-convert');
      const data = await heicConvert({ buffer, format: 'JPEG', quality });
      buffer = Buffer.from(data);
    }

    const { default: sharp } = await import('sharp');
    const s = sharp(buffer).heif({ compression: 'hevc' });
    const metadata = await s.metadata();
    if (!SUPPORT_IMAGE_EXT.includes(ext)) buffer = await s.jpeg().toBuffer();

    return { buffer, metadata };
  } catch (error) {
    console.log(imagePath, error);
  }
}
