h5CommInit();

function playM3u8(url) {
  if (Hls.isSupported()) {
    video.volume = 1.0;
    var hls = new Hls();
    var m3u8Url = decodeURIComponent(url);
    hls.loadSource(m3u8Url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  } else {
    alert('不支持您使用的浏览器，请更换其他浏览器再试');
  }
}

const video = document.getElementById('player');
const urlParams = h5Utils.getUrlParams();
const uri = urlParams.url;

video.addEventListener('loadedmetadata', function () {
    video.play();
});

if (uri != null) {
  $('.s-input').val(uri);
  if (urlParams.autoplay !== '0') playM3u8(uri);

  if (self !== window.top) {
    $('header,footer,.logo,.input-div,.am-text-right,.am-alert-secondary').remove();
    $('#player,.am-container,body,html').css({
      height: '100%',
      width: '100%',
      margin: '0',
      padding: '0',
    });
    $('.am-container').removeClass('am-container');

    setTimeout(function () {
      $('html,body').animate(
        {
          scrollTop: $('.input-div').offset().top - 20,
        },
        200
      );
    }, 3000);
  }
}

$('#str-post button.play').click(function (ev) {
  ev.preventDefault();

  $('html,body').animate(
    {
      scrollTop: $('.input-div').offset().top - 20,
    },
    200
  );

  let url = $('input[name=url]').val();
  let m3u8Str = $('#m3u8Content').val();

  if (m3u8Str) {
    const m = /EXT-X-KEY: *METHOD=AES-128,URI="\//.exec(m3u8Str);
    if (m) {
      if (url.startsWith('http')) {
        m3u8Str = m3u8Str.replace(m[0], `EXT-X-KEY:METHOD=AES-128,URI="${new URL(url).origin}/`);
      } else {
        return alert('您输入的 M3U8 内容为加密资源，请同时输入来源页面 URL 地址尝试获取解密信息');
      }
    }

    url = URL.createObjectURL(new Blob([m3u8Str], { type: 'text/plain;charset=utf-8' }));
  }

  if (!url) return alert('请输入 m3u8 的 url 或者内容');
  playM3u8(url);
});

let vedioRotate = 0;
$('#str-post button.rotate').click(function (ev) {
  ev.preventDefault();
  vedioRotate += 90;
  if (vedioRotate === 360) vedioRotate = 0;

  $('#player').css({
    transform: `rotate(${vedioRotate}deg)`,
  });
});

$('#vedioSelect').on('change', ev => {
  console.log(ev.target.files);
  const file = ev.target.files[0];
  if (!file) return;
  const url = window.URL.createObjectURL(ev.target.files[0]);
  if (file.name.endsWith('.m3u8')) {
    playM3u8(url);
  } else {
    video.src = url;
  }
  video.onload = () => window.URL.revokeObjectURL(url);
});
