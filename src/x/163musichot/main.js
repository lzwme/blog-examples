h5CommInit();

const el = {
  mp3: $('#mp3'),
  pl: $('#pl'),
  nextComment: $('#nextComment'),
  yh: $('#yh'),
  bf: $('#bfBtn'),
  img: $('#img'),
  toplistContain: document.getElementById('toplistContain'),
  /** 看歌词按钮 */
  lrcBtn: $('#lrcBtn'),
  hotBtn: $('#hotBtn'),
  lrc: document.getElementById('lrc'),
  lrcUpdate: $('#lrcUpdate'),
};

const urlParams = h5Utils.getUrlParams();
const cache = {
  playList: new Map(),
  data: new Map(),
  /** 歌单 ID */
  pid: +(urlParams.pid || urlParams.ca) || 3778678,
};
let hotList;
let dataJson;

$(async function () {
  initEvets();
  if (cache.pid) await getHotList(true, cache.pid).catch(e => console.log(e));
  const mid = +urlParams.id;
  if (mid) playMp3(mid);
  else Nextone();
});

function initEvets() {
  const audio = el.mp3[0];
  audio.onended = () => Nextone();
  audio.addEventListener('timeupdate', updateLyric);
  audio.addEventListener('error', ev => {
    console.log(ev.message || ev);
    if (dataJson) h5Utils.toast(`[${dataJson.name}] 播放异常`, { icon: 'error' });
    Nextone();
  });
  audio.addEventListener('pause', () => {
    el.bf.html('播放');
    el.img.removeClass('play-rotate').addClass('pause');
  });
  audio.addEventListener('play', () => {
    el.bf.html('暂停');
    el.img.addClass('play-rotate').removeClass('pause');
  });

  el.nextComment.on('click', function () {
    if (dataJson) {
      if (dataJson.hotComments) {
        updateComment();
      } else {
        $.getJSON('../iapi/163music/hot.php?type=comment&id=' + dataJson.id).then(function (d) {
          if (dataJson && d.hotComments) {
            dataJson.hotComments = d.hotComments;
            updateComment();
          }
        });
      }
    }
  });

  el.lrcBtn.on('click', async function () {
    if (el.lrc.style.display === 'block') {
      el.lrc.style.display = 'none';
    } else {
      const lrc = await getLrc();
      if (lrc) el.lrc.style.display = 'block';
    }
  });

  el.toplistContain.addEventListener(
    'click',
    ev => {
      const list = el.toplistContain.querySelector('ul');
      const id = ev.target.getAttribute('data-id');

      if (id) {
        playMp3(id);
      } else {
        if (ev.target.classList.value.includes('on')) {
          // list.style.maxHeight = '50px';
          el.toplistContain.style.display = 'none';
          ev.target.classList.replace('on', 'off');
        } else if (ev.target.classList.value.includes('off')) {
          list.style.maxHeight = '80vh';
          el.toplistContain.style.display = 'block';
          ev.target.classList.replace('off', 'on');
        }
      }
    },
    false
  );
}

/** 播放音乐 */
function bf() {
  const audio = el.mp3[0];
  if (audio !== null) {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }
}

async function Nextone(json) {
  if (!json || !json.data) {
    if (hotList) {
      const idx = Math.ceil(Math.random() * hotList.result.tracks.length);
      const item = hotList.result.tracks[idx] || hotList.result.tracks[idx - 1];
      return playMp3(item.id);
    }

    // var url = "https://api.uomg.com/api/comments.163?format=json";
    var url = '../iapi/163music/hot.php?hotcomments&t=' + Date.now();
    json = await $.getJSON(url);
  }

  Object.entries(json.data).forEach(d => {
    json[d[0]] = String(d[1]).replace(/^http:/, 'https:');
  });

  $('#title').html(json.data.name + '(' + json.data.artistsname + ')');
  el.mp3.attr('src', json.data.url);
  el.mp3.attr('controls', 'controls');
  el.img.attr('src', String(json.data.picurl).replace('http:', 'https:'));
  // $("#img2").attr("src", json.data.avatarurl);
  el.yh.html('来自网易云用户「@' + json.data.nickname + '」的评论：');
  el.pl.html(json.data.content);

  const u = new URL(location.href);
  u.searchParams.set('id', json.data.id);
  history.pushState(null, '', u.toString());

  dataJson = json.data;
  cache.data.set(json.data.id, json.data);
  $('#header').css({ display: 'flex' });

  await getLrc();
}

function copyComment() {
  var comment = document.getElementById('pl').innerText;
  if (!comment) return h5Utils.toast('没有内容', { icon: 'warning' });
  if (h5Utils.copy(comment)) h5Utils.toast('复制成功！');
  else h5Utils.toast('复制失败', { icon: 'error' });
}
function updateComment() {
  const hotComments = dataJson.hotComments;
  if (dataJson.commentIdx == null) dataJson.commentIdx = 0;
  else dataJson.commentIdx += 1;
  if (dataJson.commentIdx >= hotComments.length) dataJson.commentIdx = 0;

  const rndItem = hotComments[dataJson.commentIdx];
  el.yh.html('来自网易云用户「@' + rndItem.user.nickname + '」的评论：');
  el.pl.text(rndItem.content);
}

async function getHotList(isPreLoad, id = 3778678) {
  if (!hotList) {
    const d = await fetch(`../iapi/163music/api.php?type=toplist&id=${id}`).then(d => d.json());
    if (d.code !== 200) return h5Utils.alert(d.errmsg || '获取失败！');
    hotList = d;
    if (hotList.result.name) {
      el.hotBtn.text(hotList.result.name);
      el.hotBtn.attr('title', hotList.result.name);
    }
    if (isPreLoad) return hotList;
  }

  let htmllist = [];
  hotList.result.tracks.forEach((n, idx) => {
    htmllist.push(
      `<li>`,
      `<span class="left">`,
      `<span class="idx">${idx + 1}</span>`,
      n.ablum ? `<img src="${n.ablum.picUrl}">` : '',
      `<span class="tilte">${n.name} - <span class="author">${n.artists ? n.artists.map(m => m.name).join(',') : ''}</span></span>`,
      `</span>`,
      `<span class="play" data-id="${n.id}">播放</span>`,
      `</li>`
    );
  });

  el.toplistContain.style.display = 'block';
  el.toplistContain.innerHTML = `<div class="expand on">收起/展开</div><ul class="toplist-info">${htmllist.join('')}</ul>`;
  return hotList;
}

async function playMp3(id) {
  if (!hotList) await getHotList(true);
  const item = hotList.result.tracks.find(d => d.id == id) || hotList.result.tracks[0];

  dataJson = cache.data.get(id);
  if (!dataJson) {
    const comments = await $.getJSON(`../iapi/163music/hot.php?type=comment&id=${id}`);
    const comment = comments.hotComments[0];
    dataJson = {
      id,
      commentIdx: 0,
      hotComments: comments.hotComments,
      name: item.name,
      url: `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
      picurl: item.album.picUrl,
      artistsname: item.artists[0].name,
      nickname: comment ? comment.user.nickname : '',
      avatarurl: comment ? comment.user.avatarUrl : '',
      content: comment ? comment.content : '',
    };

    cache.data.set(id, dataJson);
  }

  Nextone({ data: dataJson });
  updateComment();
  return true;
}

async function getLrc() {
  const data = dataJson;
  if (!data) return;

  if (!data.lrc) {
    const d = await $.getJSON('../iapi/163music/api.php?type=lrc&id=' + data.id);
    if (d.lrc) {
      data.lrc = d.lrc;
      data.lrc.list = [];
      String(data.lrc.lyric)
        .split('\n')
        .forEach(line => {
          const r = line.match(/\[([\d:.]+)\](.+)/);
          if (r) {
            const [_a, timeStr, text] = r.map(d => d.trim());
            const [min, sec] = timeStr.split(':').map(d => +d);
            const time = Number((min * 60 + sec).toFixed(3));
            data.lrc.list.push({ text, time });
          }
        });

      el.lrc.innerHTML = data.lrc.lyric || '暂无歌词';
    }
  }

  return data.lrc;
}

// 播放歌曲的函数
function updateLyric() {
  if (!dataJson || !dataJson.lrc) return;

  var currentTime = this.currentTime; // 获取当前歌曲播放时间
  var currentLyricIndex = -1;
  const lyrics = dataJson.lrc.list;

  // 查找当前歌词索引
  for (var i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      currentLyricIndex = i;
    } else {
      break; // 找到当前时间对应的歌词后退出循环
    }
  }

  // 显示当前歌词
  const lyricText = [currentLyricIndex - 1, currentLyricIndex, currentLyricIndex + 1]
    .filter(i => lyrics[i])
    .map(i => `<div class="lyric-line ${i == currentLyricIndex ? 'current' : ''}">${lyrics[i].text}</div>`)
    .join('');

  if (el.lrcUpdate.html() !== lyricText) el.lrcUpdate.html(lyricText);
}
