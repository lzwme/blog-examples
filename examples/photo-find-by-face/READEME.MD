# PFBF

> Searching for photos through facial recognition.


首先，我们需要安装所需的依赖项：

```bash
npm install faceapi
npm install express
npm install react
npm install antd
```

接下来，我们将创建一个 React 应用程序，用于实现功能点 3 和功能点 4：

```jsx
import React from 'react';
import { Table } from 'antd';
import { request } from 'axios';

interface Image {
  md5: string;
  url: string;
}

interface MatchResult {
  sameFaces: string[];
}

const App: React.FC = () => {
  const [images, setImages] = React.useState<Image[]>([]);

  const handleUpload = (e: React.DragEvent<HTMLInputElement, React.FormInput>) => {
    const files = (e.dataTransfer as any).files;
    if (files) {
      const reader = new FileReader();
      reader.onload = (e: Event) => {
        const base64Data = e.target?.result;
        const image = new Image();
        image.src = base64Data;
        image.onload = () => {
          const md5 = '';
          // 计算图片的 md5 值
          // ...
          const url = '/api/upload';
          request(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: new FormData(),
            file: image,
          });
        };
      };
    }
  };

  const handleFind = (md5: string) => {
    request('/api/find', {
      method: 'GET',
      params: { md5 },
    });
  };

  const handleCompare = (md5: string) => {
    request('/api/compare', {
      method: 'GET',
      params: { md5 },
    });
  };

  return (
    <div>
      <h1>Face Match</h1>
      <input type="file" ondragover={handleUpload} />
      <Table columns={[
        {
          title: 'MD5',
          dataIndex: 'md5',
          key: 'md5',
        },
        {
          title: 'URL',
          dataIndex: 'url',
          key: 'url',
        },
      ]} dataSource={images} />
      <button onClick={() => handleCompare(images[0].md5)}>Compare</button>
      <button onClick={() => handleFind(images[0].md5)}>Find</button>
    </div>
  );
};

export default App;
```
