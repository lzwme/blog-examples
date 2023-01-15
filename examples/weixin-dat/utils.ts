import { ALL_FILE_TYPE } from './constants';

export function getDatType(content: Buffer, filepath = '') {
  const [c1, c2, c3] = content;
  const v: number[] = [0, 0, 0];

  for (const [head, ext] of Object.entries(ALL_FILE_TYPE)) {
    v[0] = c1 ^ parseInt(head.slice(0, 2), 16);
    v[1] = c2 ^ parseInt(head.slice(2, 4), 16);
    v[2] = c3 ^ parseInt(head.slice(4, 6), 16);

    if (v[0] === v[1] && v[1] === v[2]) return { ext, v };
  }

  const errmsg = `不支持的文件类型：${filepath}`;
  throw new Error(errmsg);
}

export function datConvert(content: Buffer, desc = '') {
  const { ext, v } = getDatType(content, desc);
  const converted = desc.endsWith(ext) ? content : content.map(d => d ^ v[0]);
  return converted;
}
