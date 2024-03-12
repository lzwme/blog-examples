// process.env.TF_CPP_MIN_LOG_LEVEL = '2';
import { existsSync, promises, statSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { node as tfNode, dispose as tfDispose } from '@tensorflow/tfjs-node';
import * as faceapi from '@vladmandic/face-api';
import { color, concurrency, md5, mkdirp, readJsonFileSync, LRUCache, isEmptyObject } from '@lzwme/fe-utils';
import { getImageBuffer, getImages, logger } from './helper';

export interface IPhotoFaceFindConfig {
  /** minimum confidence threshold */
  minConfidence?: number;
  /** 匹配度距离 */
  distanceThreshold?: number;
  /** 缓存目录 */
  cacheDir?: string;
  /** 图片后缀。默认 jpg, jpeg, png, heic  */
  extensions?: string[];
  /** 图片大小最小值。小于该值的图片将被忽略。默认为 1024 * 100 (100KB) */
  minSize?: number;
}
type CacheItem = { descriptors: number[][]; filepath: string; size?: number; width?: number; height?: number; md5?: string };

interface IPhotoFaceFindParams {
  /** 包含人脸的目标照片。可选，当为空时则只执行对目录图片的预处理缓存 */
  imageFile?: string | Buffer | Float32Array[];
  /** 要查找的图片目录 */
  directoryPath: string | string[];
  /** 最多找到多少张后即返回 */
  maxMatchedCount?: number;
  onprogress?(option: OnProgressOption): unknown;
}

type OnProgressOption = {
  type: 'start' | 'match-start' | 'matched' | 'end';
  /** 图片总数 */
  total: number;
  /** 当前匹配图片的绝对路径 */
  filepath?: string;
  /** filepath md5 值 */
  md5?: string;
  /** 相似度距离 */
  distance?: number;
  /** 已匹配成功的文件数 */
  matched?: number;
  /** 当前匹配的文件次序（已处理文件数） */
  current?: number;
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
  /** 文件大小 */
  size?: number;
};

export class PhotoFaceFind {
  private lru = new LRUCache<string, Record<string, CacheItem>>({ max: 1000 });
  // @ts-expect-error
  private optionsSSDMobileNet: faceapi.FaceDetectionOptions;
  constructor(private config: IPhotoFaceFindConfig = {}) {
    this.updateConfig(config);
  }
  updateConfig(config: IPhotoFaceFindConfig) {
    this.config = config = {
      cacheDir: './cache',
      minConfidence: 0.1,
      ...this.config,
      ...config,
    };

    if (!config.extensions?.length) config.extensions = ['jpg', 'jpeg', 'png', 'heic'];
    else config.extensions = config.extensions.map(ext => ext.toLowerCase().replace(/^\./, ''));
    config.minSize = Number(config.minSize) || 1024 * 100;

    if (config.distanceThreshold !== 0) {
      config.distanceThreshold = Math.min(1, Math.max(Number(config.distanceThreshold) || 0.5, 0));
    }

    this.optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence: config.minConfidence, maxResults: 1 });
  }
  async loadModels() {
    const modelPath = resolve(dirname(require.resolve('@vladmandic/face-api/package.json')), 'model');
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
      faceapi.nets.faceExpressionNet.loadFromDisk(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
    ]);
    return this;
  }
  /** 检测图片中的人脸并返回描述符 */
  private async detectAndDescribeFace(buffer: string | Buffer | undefined) {
    try {
      if (typeof buffer === 'string') {
        const d = await getImageBuffer(buffer);
        buffer = d?.buffer;
      }
      if (!Buffer.isBuffer(buffer)) return [];

      const tensor = tfNode.decodeImage(buffer, 3) as unknown as faceapi.TNetInput;
      const faces = await faceapi
        .detectAllFaces(tensor, this.optionsSSDMobileNet)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors();

      tfDispose(tensor as never);
      return faces.map(face => face.descriptor);
    } catch (error) {
      logger.error(`图片提取面部信息失败！`, typeof buffer === 'string' ? buffer : '', (error as Error).message);
      return [];
    }
  }
  /** 获取图片 face 描述符及 metadata 信息 */
  async getImgFaceInfo(imagePath: string, filepathMd5 = md5(imagePath, false)) {
    imagePath = resolve(imagePath);

    const { cacheFilePath, cacheInfo } = await this.getCacheInfo(filepathMd5);

    if (!existsSync(imagePath)) {
      if (cacheInfo[filepathMd5]) {
        delete cacheInfo[filepathMd5];
        if (Object.keys(cacheInfo).length === 0) {
          this.lru.delete(cacheFilePath);
          await promises.unlink(cacheFilePath);
        } else writeFileSync(cacheFilePath, JSON.stringify(cacheInfo));
      }
      return;
    }

    if (cacheInfo[filepathMd5]?.descriptors) {
      logger.debug(`从缓存文件读取`, color.cyan(cacheFilePath));
      return cacheInfo[filepathMd5];
    }

    const imgInfo = await getImageBuffer(imagePath);
    if (imgInfo) {
      // const fileMd5 = md5(buffer);
      const descriptors = await this.detectAndDescribeFace(imgInfo.buffer);

      logger.debug('写入缓存:', cacheFilePath);
      const { size, width, height } = imgInfo.metadata;
      cacheInfo[filepathMd5] = { descriptors: descriptors.map(d => [...d]), filepath: imagePath, size, width, height };
      mkdirp(dirname(cacheFilePath));
      await writeFileSync(cacheFilePath, JSON.stringify(cacheInfo));
      this.lru.set(cacheFilePath, cacheInfo);
      return cacheInfo[filepathMd5];
    }
  }
  /** 根据文件路径或路径的 md5 值查找缓存信息 */
  async getCacheInfo(imagePath: string) {
    const info = { cacheFilePath: '', cacheInfo: {} as Record<string, CacheItem> };
    if (!imagePath) return info;

    const filepathMd5 = imagePath.includes('.') ? md5(resolve(imagePath), false) : imagePath;
    info.cacheFilePath = resolve(this.config.cacheDir!, `${filepathMd5.slice(0, 2)}.json`);
    let cacheInfo = this.lru.get(info.cacheFilePath);

    if (!cacheInfo) {
      try {
        if (existsSync(info.cacheFilePath)) cacheInfo = readJsonFileSync(info.cacheFilePath);
      } catch (e) {
        console.error('读取缓存失败！', info.cacheFilePath, e);
        await promises.unlink(info.cacheFilePath);
      }
    }

    if (cacheInfo) info.cacheInfo = cacheInfo;

    return info;
  }
  async searchSimilarFaces({ imageFile, directoryPath, maxMatchedCount = 0, onprogress }: IPhotoFaceFindParams) {
    const res = {
      data: [] as {
        filepath: string;
        distance: number;
        matched: number;
        md5: string;
        width?: number;
        size?: number;
        height?: number;
      }[],
      matched: 0,
      total: 0,
      msg: '',
    };
    let queryFaceDescriptors: Float32Array[] = [];

    if (imageFile) {
      if (Buffer.isBuffer(imageFile)) queryFaceDescriptors = await this.detectAndDescribeFace(imageFile);
      else if (typeof imageFile === 'string') {
        if (existsSync(imageFile) && statSync(imageFile).isFile()) queryFaceDescriptors = await this.detectAndDescribeFace(imageFile);
      } else if (Array.isArray(imageFile)) queryFaceDescriptors = imageFile;
      else {
        logger.error('输入图片文件错误', imageFile);
        res.msg = '输入图片文件错误';
      }

      if (queryFaceDescriptors.length === 0) return res;
    } else {
      logger.log('启动预处理缓存：', directoryPath);
    }

    const files = await getImages(directoryPath, this.config.extensions!, this.config.minSize);
    res.total = files.length;
    let current = 0;
    const tasks = files.map(filepath => async () => {
      if (maxMatchedCount > 0 && res.data.length >= maxMatchedCount) return;
      logger.debug('开始匹配图片:', filepath);
      current++;
      const fileMd5 = md5(filepath, false);
      const pOpts: OnProgressOption = {
        filepath,
        total: res.total,
        current,
        matched: res.data.length,
        md5: fileMd5,
        type: 'match-start',
      };

      if (onprogress) await onprogress(pOpts);

      const fileFaceInfo = await this.getImgFaceInfo(filepath, fileMd5);
      if (!imageFile || !fileFaceInfo?.descriptors.length) return; // 仅预处理目录不匹配

      const { descriptors, width, size, height } = fileFaceInfo;
      let matchedCount = 0;
      let minDistance = 10;

      if (Array.isArray(descriptors)) {
        for (const queryFaceDescriptor of queryFaceDescriptors) {
          for (const descriptor of descriptors) {
            const distance = faceapi.euclideanDistance(queryFaceDescriptor, descriptor);
            if (distance < minDistance) minDistance = distance;
            if (distance < this.config.distanceThreshold!) {
              matchedCount++;
              logger.debug(` > 匹配到图片：`, distance, color.cyan(filepath));
            }
          }
        }

        if (matchedCount) {
          res.data.push({ filepath, distance: minDistance, matched: matchedCount, md5: fileMd5, width, size, height });

          if (onprogress) {
            await onprogress({ ...pOpts, width, size, height, matched: res.data.length, distance: minDistance, type: 'matched' });
          }
        }
      }
      logger.debug(' - 匹配图片结束', filepath, minDistance);
    });

    if (onprogress) await onprogress({ total: res.total, type: 'start' });
    const r = await concurrency<void, Error>(tasks);
    if (r.some(d => d.error)) console.error(r.filter(e => e.error));

    res.data = res.data.sort((a, b) => a.distance - b.distance);
    res.matched = res.data.length;
    return res;
  }
}
