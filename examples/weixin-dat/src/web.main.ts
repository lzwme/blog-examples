import { datConvert, formatByteSize, getExt, sha256 } from './utils.js';

type FileItem = { file: File; fullPath: string; blobUrl?: string };

// @ts-expect-error
const h5Utils = window.h5Utils;
const el = {
  input: document.querySelector<HTMLInputElement>('#datfiles')!,
  btn: document.getElementById('btn')!,
  result: document.querySelector('#result')!,
  stats: document.querySelector('#stats')!,
  reset: document.querySelector('#reset')!,
  preview: document.getElementById('preview')!,
};
const filesMap = new Map<string, FileItem>();
const preview = {
  currentKey: '',
  initEvents() {
    el.preview.querySelector('.preview-close')!.addEventListener('click', () => {
      preview.hide();
    });

    document.addEventListener('keydown', ev => {
      if (!preview.currentKey) return;

      if (ev.code == 'Escape' || ev.keyCode === 27) preview.hide();
      else if (ev.code === 'ArrowRight' || ev.keyCode === 39) preview.showNext();
      else if (ev.code === 'ArrowLeft' || ev.keyCode === 37) preview.showPrev();
    });

    el.preview.querySelector('.preview-pre')!.addEventListener('click', () => {
      preview.showPrev();
    });

    el.preview.querySelector('.preview-next')!.addEventListener('click', () => {
      preview.showNext();
    });
  },
  show(key: string) {
    el.preview.classList.remove('hide');
    const item = filesMap.get(key)!;
    this.currentKey = key;
    const aLink = el.result.querySelector(`[data-key="${key}"]`)!;
    el.preview.querySelector('.preview-main')!.innerHTML = aLink.children.item(0)!.outerHTML;
    el.preview.querySelector('.preview-footer .item-name')!.innerHTML = item.file.name;
    el.preview.querySelector('.preview-footer .item-size')!.innerHTML = formatByteSize(item.file.size);

    const itemPathEl = el.preview.querySelector('.preview-footer .item-path')!;
    if (item.fullPath) {
      itemPathEl.innerHTML = item.fullPath;
      itemPathEl.parentElement!.style.display = 'block';
    } else {
      itemPathEl.parentElement!.style.display = 'none';
    }
  },
  showPrev() {
    if (!preview.currentKey) return;
    const item = el.result.querySelector(`[data-key="${preview.currentKey}"]`)?.previousSibling;
    if (item) {
      preview.show((item as HTMLLinkElement).dataset.key!);
    } else {
      h5Utils.toast('没有了');
    }
  },
  showNext() {
    if (!preview.currentKey) return;
    const item = el.result.querySelector(`[data-key="${preview.currentKey}"]`)?.nextSibling;
    if (item) {
      preview.show((item as HTMLLinkElement).dataset.key!);
    } else {
      h5Utils.toast('没有了');
    }
  },
  hide() {
    el.preview.classList.add('hide');
    this.currentKey = '';
  },
};

async function handlerFileList(files: FileItem[]) {
  // files = files.filter(d => d.name.endsWith('.dat'));
  if (!files.length) return h5Utils.alert('请选择 .dat 文件');

  for (const item of files) {
    const rext = getExt(item.file.name);
    if (rext && ['db', '.ini'].includes(rext)) continue;

    const buffer = await item.file.arrayBuffer();
    const key = (await sha256(buffer)) || `${item.file.name}.${item.file.size}`;
    const oFile = filesMap.get(key);
    if (oFile) {
      // console.log('文件已存在', item.file, item.fullPath);
      h5Utils.toast(`文件已存在: ${item.fullPath || item.file.name}`);
      // document.querySelector(`a.r-item[data-name="${file.name}"]`)?.remove();
      continue;
    }

    const { converted, ext, errmsg } = datConvert(new Uint8Array(buffer) as any, item.file.name);
    if (!converted) {
      console.log(errmsg);
      continue;
    }

    const isImg = ['jpg', 'png', 'gif', 'jpeg', 'bmp', 'webp', 'tif'].includes(ext);
    const isVideo = ['mp4', 'mp3', 'avi', 'wav', 'rmvb'].includes(ext);
    const filename = item.file.name.replace(/\.dat$/, '') + (item.file.name.endsWith(ext) ? '' : `.${ext}`);
    const type = isImg ? `image/${ext}` : isVideo ? `video/${ext}` : '';
    const oUrl = URL.createObjectURL(new Blob([converted.buffer], { type }));
    let html = '';

    if (isImg) {
      html = `<img src="${oUrl}" alt="${filename}" />`;
    } else if (isVideo) {
      html = `<video controls alt="${filename}"><source src="${oUrl}"></video>`;
    } else {
      html = `<span>${filename}</span>`;
    }

    item.blobUrl = oUrl;
    filesMap.set(key, item);
    el.stats.innerHTML = [`总数：${filesMap.size}`].join('');

    el.result!.insertAdjacentHTML(
      'afterbegin',
      [
        `<a class="r-item"
        data-key="${key}"
        data-name="${item.file.name}"
        title="[${formatByteSize(item.file.size)}] ${item.fullPath || filename}"
        href="${oUrl}"
        download="${filename}">${html}<span class="download">下载</span></a>`,
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
  const files: FileItem[] = [];
  const scanDir = async (item: FileSystemEntry) => {
    if (item?.isDirectory) {
      item.filesystem.root.getDirectory;
      // @ts-ignore
      const reader = item.createReader() as FileSystemDirectoryReader;
      const entries: FileSystemEntry[] = [];

      await new Promise(rs => {
        const readEntries = () => {
          reader.readEntries(d => {
            if (d.length === 0) return rs(null);

            entries.push(...d);
            readEntries();
          });
        };
        readEntries();
      });

      for (const d of entries) await scanDir(d);
    } else {
      // @ts-ignore
      const file = await new Promise<File>(rs => item.file(f => rs(f)));
      files.push({ file, fullPath: item.fullPath });
    }
  };

  if (entry) await scanDir(entry);

  return files;
}

function init() {
  preview.initEvents();

  el.btn.addEventListener('click', async () => {
    const files = [...el.input!.files!].map(file => ({ file, fullPath: '' }));
    handlerFileList(files);
  });

  el.reset!.addEventListener('click', () => reset(), false);

  el.result.addEventListener(
    'click',
    ev => {
      let aLink = ev.target as HTMLLinkElement;
      if (!aLink.classList.contains('download')) {
        if (!aLink.classList.contains('r-item')) {
          aLink = aLink.parentElement as HTMLLinkElement;
        }

        if (aLink.classList.contains('r-item')) {
          ev.preventDefault();
          preview.show(aLink.dataset.key!);
        }
      }
      // console.log(ev, aLink.dataset);
    },
    false
  );

  document.addEventListener('dragover', e => e.preventDefault(), false);
  document.querySelector<HTMLElement>('.page-wrapper')!.addEventListener('drop', async e => {
    e.preventDefault();
    const files: FileItem[] = [];
    const items = [...e.dataTransfer!.items].map(d => d.webkitGetAsEntry());

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      if (item) {
        const flist = await scanFiles(item);
        files.push(...flist);
      }
    }

    // console.log(files);
    if (files.length > 0) handlerFileList(files);
    return false;
  });
}

init();
