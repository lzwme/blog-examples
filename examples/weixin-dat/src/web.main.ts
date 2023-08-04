import { datConvert, formatByteSize } from './utils.js';

const el = {
  input: document.querySelector<HTMLInputElement>('#datfiles')!,
  btn: document.getElementById('btn')!,
  result: document.querySelector('#result')!,
  stats: document.querySelector('#stats')!,
  reset: document.querySelector('#reset')!,
};
const filesMap = new Map<string, { file: File }>();

async function handlerFileList(files: File[]) {
  // files = files.filter(d => d.name.endsWith('.dat'));
  // @ts-ignore
  if (!files.length) return h5Utils.alert('请选择 .dat 文件');

  for (const file of files) {
    const oFile = filesMap.get(file.name);
    if (oFile?.file.size === file.size) {
      console.log('文件已存在', file.name);
      document.querySelector(`a.r-item[data-name="${file.name}"]`)?.remove();
      // continue;
    }

    const { converted, ext, errmsg } = datConvert(new Uint8Array(await file.arrayBuffer()) as any, file.name);
    if (!converted) {
      console.log(errmsg);
      continue;
    }

    const isImg = ['jpg', 'png', 'gif', 'jpeg', 'bmp', 'webp', 'tif'].includes(ext);
    const isVideo = ['mp4', 'mp3', 'avi', 'wav', 'rmvb'].includes(ext);
    const filename = file.name.replace(/\.dat$/, '') + '.' + ext;
    const type = isImg ? `image/${ext}` : isVideo ? `video/${ext}` : '';
    const oUrl = URL.createObjectURL(new Blob([converted.buffer], { type }));
    let html = '';

    if (isImg) {
      html = `<img src="${oUrl}" alt="${filename}" />`;
    } else if (isVideo) {
      html = `<video controls alt="${filename}"><source src="${oUrl}"></video>`;
    } else {
      html = `${filename}`;
    }

    filesMap.set(file.name, { file });
    el.stats.innerHTML = [`总数：${filesMap.size}`].join('');

    el.result?.insertAdjacentHTML(
      'afterbegin',
      [
        `<a class="r-item"
        data-name="${file.name}"
        title="[${formatByteSize(file.size)}] ${filename}"
        href="${oUrl}"
        download="${filename}">${html}</a>`,
      ].join('')
    );
  }
}

function reset() {
  el.stats.innerHTML = '';
  el.result.innerHTML = '';
  el.input.value = '';
  filesMap.clear();
}

async function scanFiles(entry: FileSystemEntry) {
  const files: File[] = [];
  const scanDir = async (item: FileSystemEntry) => {
    if (item?.isDirectory) {
      // @ts-ignore
      let reader = item.createReader();
      // @ts-ignore
      const entries = await new Promise<FileSystemEntry[]>(rs => reader.readEntries(d => rs(d)));

      for (const d of entries) await scanDir(d);
    } else {
      // @ts-ignore
      const file = await new Promise<File>(rs => item.file(f => rs(f)));
      files.push(file);
    }
  };

  if (entry) await scanDir(entry);

  return files;
}

function init() {
  el.btn.addEventListener('click', async () => {
    const files = [...el.input!.files!];
    handlerFileList(files);
  });

  el.reset!.addEventListener('click', () => reset(), false);

  document.addEventListener('dragover', e => e.preventDefault(), false);
  document.querySelector<HTMLElement>('.page-wrapper')!.addEventListener('drop', async e => {
    e.preventDefault();
    const files: File[] = [];
    const items = [...e.dataTransfer!.items].map(d => d.webkitGetAsEntry());

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      if (item) {
        const flist = await scanFiles(item);
        files.push(...flist);
      }
    }

    console.log(files);
    if (files.length > 0) handlerFileList(files);
    return false;
  });
}

init();
