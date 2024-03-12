/*
 * @Author: renxia
 * @Date: 2024-03-13 18:30:54
 * @LastEditors: renxia
 * @LastEditTime: 2024-03-15 13:40:03
 * @Description:
 */

import React, { useState } from 'react';
import { Button } from 'antd';
import { PhotoGallery } from './components';
import './App.css';

interface Image {
  md5: string;
  distance: number;
  src: string;
  alt: string;
  title?: string;
  filepath: string;
  width: number;
  height: number;
}
interface InfoItem {
  data?: InfoItem[];
  msg?: string;
  // ==== type OnProgressOption ===
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
}

// const req = new ReqFetch();
const App: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [msg, setMsg] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [matched, setMatched] = useState<number>(0);
  const [curImsg, setCurImsg] = useState<string>('');

  const handlerFind = async (e?: React.ChangeEvent<HTMLInputElement>) => {
    const file = e ? e.target?.files?.[0] : document.querySelector<HTMLInputElement>('input[name=file]')?.files?.[0];
    console.log('ttt', file);

    if (file) {
      const fileName = file.name;
      const extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
      console.log('file', file);

      if (!['.jpg', '.png', '.bmp', '.heic'].includes(extension)) {
        console.log('不支持的格式', extension, fileName);
        return;
      }

      if (file.type.includes('image')) {
        const imgUrl = URL.createObjectURL(new Blob([await file.arrayBuffer()], { type: file.type || `image/${extension}` }));
        setCurImsg(imgUrl);
      } else setCurImsg('');

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/find', {
        method: 'POST',
        body: formData,
      });
      const reader = res.body?.getReader();

      while (reader) {
        const { value, done } = await reader.read();
        const chars = new TextDecoder().decode(value).trim().split('\n');

        chars.forEach(d => {
          try {
            const info = JSON.parse(d) as InfoItem;
            console.log(info);

            switch (info.type) {
              case 'start':
                setMsg(`图片总数：${info.total}`);
                setTotal(info.total);
                break;
              case 'match-start':
                setMsg(`[${info.current}/${info.total}][匹配图片][${info.filepath}]`);
                break;
              case 'matched':
                if (!images.some(i => i.md5 === info.md5)) {
                  images.push({
                    ...(info as Required<InfoItem>),
                    src: `/api/getimg?thumbnail=1&md5=${info.md5}`,
                    alt: info.filepath!,
                    title: info.filepath!.split(/\/|\\/).at(-1),
                    width: info.width || 200,
                    height: info.height || 300,
                  });

                  setMatched(info.matched!);
                  setTotal(info.total);
                  setMsg(`[相似图片][${info.filepath}] 已匹配到 ${info.matched} 张图片`);
                  setImages(images.sort((a, b) => a.distance - b.distance).concat([]));
                }
                break;
              case 'end':
                info.data?.forEach(d => {
                  if (!images.some(i => i.md5 === d.md5)) {
                    images.push({
                      ...(d as Required<InfoItem>),
                      src: `/api/getimg?thumbnail=1&md5=${d.md5}`,
                      alt: d.filepath!,
                      title: d.filepath!.split(/\/|\\/).at(-1),
                      width: d.width || 200,
                      height: d.height || 300,
                    });
                  }
                });

                setMatched(info.matched!);
                setTotal(info.total);
                setMsg(info.msg || '匹配完成');
                if (!info.data) setImages([]);
                else setImages(images.sort((a, b) => a.distance - b.distance).concat([]));
                break;
            }
          } catch {
            console.log(d);
          }
        });

        if (done) {
          console.log('done');
          break;
        }
      }
    }
  };

  const handleReset = () => {
    setImages([]);
    setMsg('');
    setMatched(0);
    setTotal(0);
  };

  // const viewImage = (md5: string) => {
  //   window.open(`/api/getimg?md5=${md5}`);
  // };

  return (
    <div className="main-container">
      <h1>Face Match</h1>
      <input name='file' type="file" onChange={handlerFind} />
      <Button onClick={() => handlerFind()}>重试</Button>
      <Button onClick={() => handleReset()}>重置</Button>
      <div className="img-preview">{curImsg && <img src={curImsg} width={200} />}</div>

      <div className="msg">
        目录图片总数: {matched}/{total} {msg}
      </div>

      <div className="photo-gallery">
        <PhotoGallery photos={images} />
      </div>

      {/* <div className="img-list">
        {images.map(item => {
          return (
            <div key={item.md5} className="img-item">
              <img src={`/api/getimg?thumbnail=1&md5=${item.md5}`} alt={item.md5} onClick={() => viewImage(item.md5)} />
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default App;
