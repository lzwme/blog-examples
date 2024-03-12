/*
 * @Author: renxia
 * @Date: 2024-03-13 10:56:16
 * @LastEditors: renxia
 * @LastEditTime: 2024-03-15 13:48:32
 * @Description:
 */
import { extname } from 'node:path';
import express from 'express';
import formidable from 'formidable';
import { findFreePort } from '@lzwme/fe-utils';
import { config as dotConfig } from 'dotenv';
import { PhotoFaceFind } from './face';
import { getImageBuffer, logger } from './helper';

dotConfig();

const CONFIG = {
  imageDir: process.env.IMAGE_DIR || './images',
};
const app = express();

app.use(express.static('./public'));

// routes
const PFBF = new PhotoFaceFind();
PFBF.loadModels();

app.all('*', function (_req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.post('/api/find', async (req: express.Request, res: express.Response) => {
  try {
    const form = formidable({ keepExtensions: true, maxFiles: 1, maxFieldsSize: 20 * 1024 * 1024, multiples: true });
    const [fields, files] = await form.parse(req);
    const fileInfo = files.file?.[0];
    console.log(fields, files);

    if (!fileInfo) return res.json({ error: '请上传文件', code: 100 });

    // SSE
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });

    const directoryPath = (req.query.dir as string) || CONFIG.imageDir;
    const imgInfo = await getImageBuffer(fileInfo.filepath, 0.3, extname(fileInfo.originalFilename!));
    const result = await PFBF.searchSimilarFaces({
      imageFile: imgInfo?.buffer,
      directoryPath,
      onprogress: opt => {
        logger.log(opt.type, opt);
        if (opt.type === 'matched') res.write(JSON.stringify(opt) + '\n');
      },
    });
    logger.log('similarFiles: ', result.data.length);

    // 返回成功消息
    res.end(JSON.stringify({ ...result, msg: 'Successfully processed', code: 0, type: 'end' }));
  } catch (error) {
    console.log(error);
    res.end({ msg: (error as Error).message || '文件接收处理失败！', code: 401 });
  }
});

app.get('/api/getimg', async (req: express.Request, res: express.Response) => {
  const md5 = req.query.md5 as string;
  if (!md5) return res.status(400).json({ msg: 'MD5 is required', code: 400 });

  const thumbnail = req.query.thumbnail as string;
  const info = await PFBF.getCacheInfo(md5);
  const cacheItem = info?.cacheInfo?.[md5];

  if (cacheItem) {
    const imgInfo = await getImageBuffer(cacheItem.filepath, 0.9);
    if (imgInfo) {
      const { buffer } = imgInfo;
      const ext = extname(cacheItem.filepath).slice(1).toLocaleLowerCase();
      res.type(`image/${['jpg', 'heic'].includes(ext) ? 'jpeg' : ext}`);
      // res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(cacheItem.filename)}`);
      res.set('control-cache', 'max-age: 86000');

      if (thumbnail === '1') {
        const {default:sharp} = await import('sharp');
        return sharp(buffer).resize(200).pipe(res);
      } else {
        return res.send(buffer);
      }
    }
  }

  res.status(404).json({ msg: 'Image not found', code: 404 });
});

app.get('/', (req, res) => {
  res.send(`
    <h2>With <code>"express"</code> npm package</h2>
    <form action="/api/find" enctype="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});

async function start() {
  const port = Number(process.env.PORT) || (await findFreePort(3000));
  // 启动服务器
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // 启动预处理
  await PFBF.loadModels();
  // PFBF.searchSimilarFaces({ directoryPath: CONFIG.imageDir });
}

start();
