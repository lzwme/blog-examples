import { ALL_FILE_TYPE } from './constants.js';

export function getExt(filename: string) {
  const [, ext] = String(filename).match(/\.([^.]+)$/) || [];
  return ext;
}

export function getDatType(content: Buffer, filepath = '') {
  const [c1, c2, c3] = content;
  const v: number[] = [0, 0, 0];

  for (let [head, ext] of Object.entries(ALL_FILE_TYPE)) {
    v[0] = c1 ^ parseInt(head.slice(0, 2), 16);
    v[1] = c2 ^ parseInt(head.slice(2, 4), 16);
    v[2] = c3 ^ parseInt(head.slice(4, 6), 16);

    if (v[0] === v[1] && v[1] === v[2]) {
      const fext = getExt(filepath);
      if (fext && ['zip', 'mp4', 'doc'].includes(ext)) {
        ext = fext as any;
      }

      return { ext, v };
    }
  }

  const errmsg = `不支持的文件类型：${filepath}`;
  return { errmsg, ext: '', v };
}

export function datConvert(content: Buffer, filepath = '') {
  let { ext, v, errmsg } = getDatType(content, filepath);
  const fext = getExt(filepath);

  if (!ext) ext = fext;
  if (!ext && errmsg) return { ext, converted: null, errmsg };

  const converted = fext === ext ? content : content.map(d => d ^ v[0]);
  return { converted, ext };
}

export function formatByteSize(byteSize: number | string, decimal = 2, toFixed = false) {
  let formated = +byteSize;
  if (byteSize === '' || byteSize == null || Number.isNaN(formated)) {
    return typeof byteSize === 'string' ? byteSize : '';
  }

  const neg = formated < 0 ? '-' : '';
  if (neg) formated = -formated;
  if (formated < 1) return neg + formated + 'B';

  const base = 1024;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let idx = 0;

  while (idx < units.length && formated > base) {
    formated /= base;
    idx++;
  }

  return neg + (decimal > 0 ? (toFixed ? formated.toFixed(decimal) : +formated.toFixed(decimal)) : formated) + units[idx];
}

export async function sha256(message: string | ArrayBuffer) {
  if (!crypto.subtle) {
    return '';
  }
  if (typeof message === 'string') message = new TextEncoder().encode(message).buffer as ArrayBuffer;
  const hash = await crypto.subtle.digest('SHA-256', message);
  return Array.prototype.map.call(new Uint8Array(hash), x => ('00' + x.toString(16)).slice(-2)).join('');
}

export interface ITask<T> {
  (): T;
}

export function concurrency<T, E = T | Error>(taskList: ITask<Promise<T>>[], maxDegreeOfParalellism = 5) {
  const total = taskList.length;
  let idx = 0;
  const resut: { index: number; result: T; error: E }[] = [];
  const onFinish = (index: number, result: T, error?: E) => {
    resut.push({ index, result, error: error as never });
    return next();
  };
  const next = (): Promise<void> => {
    if (idx >= total) return Promise.resolve();
    const index = idx++;
    return taskList[index]()
      .then(r => onFinish(index, r))
      .catch(error => onFinish(index, null as never as T, error));
  };
  const size = Math.max(1, Math.min(maxDegreeOfParalellism, total));
  const queue: Promise<void>[] = [];
  for (let i = 0; i < size; i++) queue.push(next());

  return Promise.allSettled(queue).then(() => resut.sort((a, b) => a.index - b.index));
}
