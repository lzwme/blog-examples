const fs = require('fs');
const aes = require('aes-js');

function ncmtomp3(filepath, outputpath) {
  if (!filepath || !fs.existsSync(filepath)) {
    throw new Error('文件不存在！请指定 ncm 文件路径');
  }

  const file = fs.readFileSync(filepath);
  let globalOffset = 10;
  const keyLength = file.readUInt32LE(10);
  globalOffset += 4;

  const keyData = Buffer.alloc(keyLength);

  file.copy(keyData, 0, globalOffset, globalOffset + keyLength);
  globalOffset += keyLength;

  for (let i = 0; i < keyLength; i++) {
    keyData[i] ^= 0x64;
  }

  const coreKey = new Uint8Array([0x68, 0x7a, 0x48, 0x52, 0x41, 0x6d, 0x73, 0x6f, 0x35, 0x6b, 0x49, 0x6e, 0x62, 0x61, 0x78, 0x57]);

  const aesEcb = new aes.ModeOfOperation.ecb(coreKey);

  const decodedKeyData = aes.padding.pkcs7.strip(aesEcb.decrypt(keyData));

  const trimKeyData = decodedKeyData.slice(17);
  // console.log(1, Buffer.from(decodedKeyData).toString('ascii'));

  const metaLength = file.readUInt32LE(globalOffset);
  globalOffset += 4;
  // console.log('meta length: ', metaLength);
  const metaData = Buffer.alloc(metaLength);
  file.copy(metaData, 0, globalOffset, globalOffset + metaLength);
  globalOffset += metaLength;
  for (let i = 0; i < metaLength; i++) {
    metaData[i] ^= 0x63;
  }

  const base64decode = Buffer.from(Buffer.from(metaData.slice(22)).toString('ascii'), 'base64');

  const metaKey = new Uint8Array([0x23, 0x31, 0x34, 0x6c, 0x6a, 0x6b, 0x5f, 0x21, 0x5c, 0x5d, 0x26, 0x30, 0x55, 0x3c, 0x27, 0x28]);
  const aseMeta = new aes.ModeOfOperation.ecb(metaKey);
  const meatArray = aes.padding.pkcs7.strip(aseMeta.decrypt(base64decode));
  const metaJson = Buffer.from(meatArray).toString('utf8');
  const meta = JSON.parse(metaJson.substr(6));
  // console.log(meta);

  // read crc32 check
  file.readUInt32LE(globalOffset);
  globalOffset += 4;
  globalOffset += 5;
  // read image length
  const imageLength = file.readUInt32LE(globalOffset);
  globalOffset += 4;
  // console.log('image length: %d', imageLength);
  const imageBuffer = Buffer.alloc(imageLength);
  file.copy(imageBuffer, 0, globalOffset, globalOffset + imageLength);
  globalOffset += imageLength;

  function buildKeyBox(key) {
    const keyLength = key.length;
    const box = Buffer.alloc(256);

    for (let i = 0; i < 256; i++) {
      box[i] = i;
    }

    let swap = 0;
    let c = 0;
    let lastByte = 0;
    let keyOffset = 0;

    for (let i = 0; i < 256; ++i) {
      swap = box[i];
      c = (swap + lastByte + key[keyOffset++]) & 0xff;
      if (keyOffset >= keyLength) {
        keyOffset = 0;
      }
      box[i] = box[c];
      box[c] = swap;
      lastByte = c;
    }

    return box;
  }

  const box = buildKeyBox(trimKeyData);

  let n = 0x8000;
  let fmusic = [];
  while (n > 1) {
    const buffer = Buffer.alloc(n);
    n = file.copy(buffer, 0, globalOffset, globalOffset + n);
    globalOffset += n;

    for (let i = 0; i < n; i++) {
      let j = (i + 1) & 0xff;
      buffer[i] ^= box[(box[j] + box[(box[j] + j) & 0xff]) & 0xff];
    }

    fmusic.push(buffer);
  }

  if (outputpath) {
    if (outputpath.endsWith('.ncm')) outputpath = outputpath.replace(/.ncm$/, '.mp3');
    else if (!outputpath.endsWith('.mp3')) outputpath += '.mp3';
    fs.writeFileSync(outputpath, Buffer.concat(fmusic));
    const imagepath = outputpath.replace(/.mp3$/, '.jpg');
    fs.writeFileSync(imagepath, imageBuffer);
  }

  return { buffer: Buffer.concat(fmusic), imageBuffer, meta, filepath, outputpath };
}

module.exports = ncmtomp3;

if (require.main === module) {
  const argv = process.argv.slice(2).filter(d => fs.existsSync(d));
  const convert = ncmfilepath => {
    try {
      if (!ncmfilepath.endsWith('.ncm')) return false;

      const info = ncmtomp3(ncmfilepath, ncmfilepath.replace(/.ncm$/, '.mp3'));
      console.log('已转换：', info.outputpath, info.meta);
      return true;
    } catch (e) {
      console.error('转换失败：', ncm, e.message);
    }
    return false;
  };

  if (argv.length) {
    for (let filepath of argv) {
      const stat = fs.statSync(filepath);
      if (stat.isDirectory()) {
        fs.readdirSync(filepath).forEach(d => convert(path.join(filepath, d)));
      } else {
        convert(filepath);
      }
    }
  } else console.log('请指定 ncm 文件路径');
}
