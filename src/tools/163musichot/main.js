(function () {
  var _hmt = _hmt || [];
  var hm = document.createElement('script');
  hm.src = 'https://hm.baidu.com/hm.js?1c720b7315e37bbf488afd28e60002bf';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(hm, s);
})();

const el = {
  mp3: $('#mp3'),
  pl: $('#pl'),
  yh: $('#yh'),
  toplistContain: document.getElementById('toplistContain'),
};
var hotList;
var dataJson;

$(function () {
  var aud = document.getElementById('mp3');
  aud.onended = function () {
    Nextone();
  };

  el.pl.on('click', function () {
    if (dataJson) {
      if (dataJson.hotComments) {
        updateComment();
      } else {
        $.getJSON('../iapi/163music/hot.php?type=comment&id=' + dataJson.id).then(function (d) {
          if (d.hotComments) {
            dataJson.hotComments = d.hotComments;
            updateComment();
          }
        });
      }
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

  Nextone();
  $('#currentYear').text(new Date().getFullYear());
});

function bf() {
  var audio = document.getElementById('mp3');
  if (audio !== null) {
    if (audio.paused) {
      audio.play();
      $('#bf').html('暂停');
    } else {
      audio.pause();
      $('#bf').html('播放');
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
  $('#img').attr('src', json.data.picurl);
  // $("#img2").attr("src", json.data.avatarurl);
  el.yh.html('来自网易云用户「@' + json.data.nickname + '」的评论：');
  el.pl.html(json.data.content);

  dataJson = json.data;
}

function copyUrl2() {
  var Url2 = document.getElementById('pl').innerText;
  var oInput = document.createElement('input');
  oInput.value = Url2;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象
  document.execCommand('Copy'); // 执行浏览器复制命令
  oInput.style.display = 'none';
  alert('复制成功');
}
function updateComment() {
  var hotComments = dataJson.hotComments;
  if (dataJson.commentIdx == null) dataJson.commentIdx = 0;
  else dataJson.commentIdx += 1;
  if (dataJson.commentIdx >= hotComments.length) dataJson.commentIdx = 0;

  var rndItem = hotComments[dataJson.commentIdx];
  el.yh.html('来自网易云用户「@' + rndItem.user.nickname + '」的评论：');
  el.pl.text(rndItem.content);
}

async function getHotList() {
  if (!hotList) {
    const d = await fetch(`../iapi/163music/hot.php?type=playlist`).then(d => d.json());
    if (d.code !== 200) return alert(d.errmsg || '获取失败！');
    hotList = d;
  }

  let htmllist = [];
  hotList.result.tracks.forEach((n, idx) => {
    htmllist.push(
      `<li>`,
      `<span class="left">`,
      `<span class="idx">${idx}</span>`,
      n.ablum ? `<img src="${n.ablum.picUrl}">` : '',
      `<span class="tilte">${n.name} - <span class="author">${n.artists ? n.artists.map(m => m.name).join(',') : ''}</span></span>`,
      `</span>`,
      `<span class="play" data-id="${n.id}">播放</span>`,
      `</li>`
    );
  });

  el.toplistContain.style.display = 'block';
  el.toplistContain.innerHTML = `<div class="expand on">收起/展开</div><ul class="toplist-info">${htmllist.join('')}</ul>`;
}

async function playMp3(id) {
  const item = hotList.result.tracks.find(d => d.id == id);
  const comments = await $.getJSON(`../iapi/163music/hot.php?type=comment&id=${id}`);

  dataJson = {
    id,
    commentIdx: 0,
    hotComments: comments.hotComments,
    name: item.name,
    url: `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
    picurl: item.album.picUrl,
    artistsname: item.artists[0].name,
    nickname: comments.hotComments[0].user.nickname,
    avatarurl: comments.hotComments[0].user.avatarUrl,
    content: comments.hotComments[0].content,
  };

  Nextone({ data: dataJson });
  updateComment();
}
