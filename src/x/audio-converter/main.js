function audioConvert(audioFileData, targetFormat) {
  try {
    targetFormat = targetFormat.toLowerCase();
    let reader = new FileReader();

    return new Promise(resolve => {
      if (!audioFileData.type.includes('audio')) {
        return resolve({ errmsg: '请选择音频文件，当前文件类型为：' + audioFileData.type });
      }

      let srcFormat = audioFileData.type.split('audio/')[1];
      if (srcFormat === 'mpeg') srcFormat = 'mp3';

      if (srcFormat === targetFormat) {
        return resolve({ errmsg: `目标文件与源文件类型相同，无需转换` });
      }

      reader.onload = function (event) {
        let contentType = 'audio/' + targetFormat;
        let data = event.target.result.split(',');
        let b64Data = data[1];
        let blob = getBlobFromBase64Data(b64Data, contentType);
        let blobUrl = URL.createObjectURL(blob);

        const convertedAudio = {
          name: audioFileData.name.substring(0, audioFileData.name.lastIndexOf('.')),
          format: targetFormat,
          srcFormat,
          data: blobUrl,
        };
        resolve(convertedAudio);
      };
      reader.readAsDataURL(audioFileData);
    });
  } catch (e) {
    console.log('Error occurred while converting : ', e);
    alert(e.message);
  }
}

function getBlobFromBase64Data(b64Data, contentType, sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

function downloadAudio(convertedAudioDataObj) {
  let a = document.createElement('a');
  a.href = convertedAudioDataObj.data;
  a.download = convertedAudioDataObj.name + '.' + convertedAudioDataObj.format;
  a.click();
}

const audioTypes = ['mp3', 'ogg', 'aac', 'wav', 'wma', 'flac', 'ape', 'm4a'];
const el = {
  sourceType: document.querySelector('.source'),
  targetType: document.getElementById('atTarget'),
  inputFile: document.getElementById('inputFile'),
  download: document.getElementById('download'),
};
let convertedAudioData;

function init() {
  h5CommInit(['bg']);

  el.targetType.innerHTML = audioTypes.map(d => `<option value="${d}">${d}</option>`);
  el.targetType.selectedIndex = 0;
  el.inputFile.setAttribute('accept', audioTypes.join(','));

  el.inputFile.addEventListener('change', ev => {
    let sourceAudioFile = ev.target.files[0];
    let targetFormat = el.targetType.value;

    if (!sourceAudioFile) return;

    audioConvert(sourceAudioFile, targetFormat).then(info => {
      if (!info || info.errmsg) {
        if (info) alert(info.errmsg);
        el.download.setAttribute('disabled', true);
      } else if (info.data) {
        convertedAudioData = info;
        el.download.removeAttribute('disabled');
        el.sourceType.innerText = info.srcFormat;
      }
    });
  });

  el.download.addEventListener('click', () => {
    if (convertedAudioData) downloadAudio(convertedAudioData);
  });
}

init();
