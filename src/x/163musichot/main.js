$(async function () {
  const API = `../iapi/163music/api.php`;

  const el = {
    mp3: $('#mp3'),
    pl: $('#pl'),
    nextComment: $('#nextComment'),
    copyComment: $('#copyComment'),
    yh: $('#yh'),
    bfBtn: $('#bfBtn'),
    nextTone: $('#nextTone'),
    img: $('#img'),
    playlistContain: document.getElementById('playlistContain'),
    /** 看歌词按钮 */
    lrcBtn: $('#lrcBtn'),
    hotBtn: $('#hotBtn'),
    lrc: document.getElementById('lrc'),
    lrcUpdate: $('#lrcUpdate'),
  };
  const storage = {
    data: {
      /** 最新播放的歌单缓存信息 */
      pInfo: {
        id: 3778678,
        name: '热歌榜',
      },
    },
    init() {
      const s = localStorage.getItem('163musichot');
      if (s) Object.assign(storage.data, JSON.parse(s));
    },
    save() {
      localStorage.setItem('163musichot', JSON.stringify(storage.data));
    },
  };
  const cache = {
    /** 榜单信息 */
    topList: [],
    /** 当前榜单的播放列表 */
    playList: new Map(), // [id, playlist]
    /** 音乐缓存信息 [id, info] */
    data: new Map(),
    /** 当前播放的音乐信息 */
    currentInfo: {
      id: 0,
      hotComments: '',
      commentIdx: 0,
      hotComments: [],
      name: '',
      url: '',
      picurl: '',
      artistsname: '',
      currentComment: {
        nickname: '',
        avatarurl: '',
        /** 当前的评论内容 */
        content: '',
      },
      /** 歌词信息 */
      lrc: {
        list: [],
      },
    },
  };

  /** 榜单相关 */
  const topList = {
    /** 获取全部榜单 */
    async getTopList() {
      const d = await fetch(`${API}?type=toplist`).then(d => d.json());
      if (d.data) cache.topList = d.data;
      else if (d.errmsg) h5Utils.toast(`获取榜单列表失败！`);
      return cache.topList;
    },
    /** 获取播放列表 */
    async getPlayList(id, useCache = true) {
      if (!id) id = storage.data.pInfo.id || 3778678;

      if (useCache && cache.playList.has(id)) return cache.playList.get(id);

      const pName = id === storage.data.pInfo.id ? storage.data.pInfo.name : id;
      const d = await fetch(`${API}?type=playlist&id=${id}`).then(d => d.json());
      if (d.code !== 200) return h5Utils.alert(`[${pName}] ${d.errmsg || '获取失败！'}`);

      cache.playList.set(id, d.result);
      storage.data.pInfo = {
        id: d.result.id,
        name: d.result.name,
      };
      el.hotBtn.text(storage.data.pInfo.name);

      if (cache.topList.find(a => a.id === d.result.id)) {
        cache.topList.push(storage.data.pInfo);
      }

      return d.result;
    },
  };

  const play = {
    async init() {
      h5CommInit();
      storage.init();
      this.initEvets();

      const urlParams = h5Utils.getUrlParams();
      const pid = +(urlParams.pid || urlParams.ca) || storage.data.pInfo.id || 3778678;
      await topList.getPlayList(pid);

      const mid = +urlParams.id;
      if (mid) this.playMp3(mid);
      else this.nextTone();
    },
    initEvets() {
      el.bfBtn.on('click', () => this.bf());

      const audio = el.mp3[0];
      audio.onended = () => this.nextTone();
      audio.addEventListener('timeupdate', () => this.updateLyric(audio.currentTime));
      audio.addEventListener('error', ev => {
        console.log(ev.message || ev);
        if (cache.currentInfo) h5Utils.toast(`[${cache.currentInfo.name}] 播放异常`, { icon: 'error' });
        this.nextTone();
      });
      audio.addEventListener('pause', () => {
        el.bfBtn.html('播放');
        el.img.removeClass('play-rotate').addClass('pause');
      });
      audio.addEventListener('play', () => {
        el.bfBtn.html('暂停');
        el.img.addClass('play-rotate').removeClass('pause');
      });

      el.nextComment.on('click', () => {
        const currentInfo = cache.currentInfo;
        if (!cache.currentInfo) return;

        if (currentInfo.hotComments) {
          this.updateComment();
        } else {
          $.getJSON(`${API}?type=comment&id=${currentInfo.id}`).then(function (d) {
            if (d.hotComments) {
              currentInfo.hotComments = d.hotComments;
              this.updateComment();
            }
          });
        }
      });

      el.copyComment.on('click', () => {
        this.copyComment();
      });

      el.lrcBtn.on('click', async () => {
        if (el.lrc.style.display === 'block') {
          el.lrc.style.display = 'none';
        } else {
          const lrc = await this.getLrc();
          if (lrc) el.lrc.style.display = 'block';
        }
      });

      // 下一首
      el.nextTone.on('click', () => {
        this.nextTone();
      });

      el.hotBtn.on('click', async function () {
        // 选择分类
        const toplist = await topList.getTopList();
        const pid = storage.data.pInfo.id;
        if (toplist.length) {
          const r = await h5Utils.alert({
            icon: '',
            title: '请选择榜单',
            html: `<ol class="toplist-cate">${toplist
              .map(d => `<li data-id="${d.id}" ${pid == d.id ? 'class="current"' : ''}>${d.name}</li>`)
              .join('')}</ol>`,
            confirmButtonText: '确定',
            showConfirmButton: true,
          });
        }

        const playList = await topList.getPlayList();
        if (!playList) return;

        const htmllist = [`<div class="expand on">收起/展开</div><ul class="playlist-info">`];
        playList.tracks.forEach((n, idx) => {
          htmllist.push(
            `<li data-id="${n.id}"${cache.currentInfo.id === n.id ? 'class="current"' : ''}>`,
            `<span class="left">`,
            `<span class="idx">${idx + 1}</span>`,
            n.ablum ? `<img src="${n.ablum.picUrl}">` : '',
            `<span class="tilte">${n.name} - <span class="author">${n.artists ? n.artists.map(m => m.name).join(',') : ''}</span></span>`,
            `</span>`,
            `<span class="play" data-id="${n.id}">播放</span>`,
            `</li>`
          );
        });

        htmllist.push('</ul>');
        el.playlistContain.innerHTML = htmllist.join('');
        el.playlistContain.style.display = 'block';
      });

      el.playlistContain.addEventListener(
        'click',
        ev => {
          const list = el.playlistContain.querySelector('ul');
          const id = ev.target.getAttribute('data-id');

          if (id) {
            this.playMp3(id);
          } else {
            if (el.playlistContain.style.display === 'block') {
              // list.style.maxHeight = '50px';
              el.playlistContain.style.display = 'none';
              ev.target.classList.replace('on', 'off');
            } else {
              list.style.maxHeight = '80vh';
              el.playlistContain.style.display = 'block';
              ev.target.classList.replace('off', 'on');
            }
          }
        },
        false
      );

      $(document).on('click', '.toplist-cate li', ev => {
        const id = $(ev.target).data('id');
        const item = cache.topList.find(d => d.id == id);
        if (item) {
          storage.data.pInfo = item;
          el.hotBtn.text(storage.data.pInfo.name);
          storage.save();
          $('.toplist-cate li.current').removeClass('current');
          $(ev.target).addClass('current');
        }
      });

      $(document).on('keydown', (ev) => {
        console.log(ev.key, ev.code);
        switch(ev.key) {
          case 'ArrowDown':
            el.nextComment.click();
            break;
          case 'c':
            play.copyComment();
            break;
          case 'n':
            play.nextTone();
            break;
          case 'p':
          case ' ':
            el.bfBtn.click();
            break;
          case 'l':
            el.lrcBtn.click();
            break;
          case 'h':
          case 't':
            el.hotBtn.click();
            break;
          case 'Escape':
            if (el.playlistContain.style.display === 'block') {
              el.playlistContain.style.display = 'none';
            }
            break;
        }
      });
    },

    /** 播放音乐 */
    bf() {
      const audio = el.mp3[0];
      if (audio !== null) {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      }
    },
    async nextTone() {
      const playList = await topList.getPlayList();

      if (playList?.tracks?.length > 0) {
        const idx = Math.ceil(Math.random() * playList.tracks.length);
        const item = playList.tracks[idx] || playList.tracks[idx - 1];
        return this.playMp3(item.id);
      }
      // var url = `https://api.uomg.com/api/comments.163?format=json&t=${Date.now()}`;
    },
    copyComment() {
      const comment = document.getElementById('pl').innerText;
      if (!comment) return h5Utils.toast('没有内容', { icon: 'warning' });
      if (h5Utils.copy(comment)) h5Utils.toast('评论内容复制成功！');
      else h5Utils.toast('评论内容复制失败', { icon: 'error' });
    },
    updateComment() {
      const hotComments = cache.currentInfo.hotComments;
      if (cache.currentInfo.commentIdx == null) cache.currentInfo.commentIdx = 0;
      else cache.currentInfo.commentIdx += 1;
      if (cache.currentInfo.commentIdx >= hotComments.length) cache.currentInfo.commentIdx = 0;

      const rndItem = hotComments[cache.currentInfo.commentIdx];
      el.yh.html('来自网易云用户「@' + rndItem.user.nickname + '」的评论：');
      el.pl.text(rndItem.content);
    },

    async playMp3(id) {
      let info = cache.data.get(id);

      if (!info) {
        let item;
        // const playList = await topList.getPlayList();
        // let item = playList.tracks.find(d => d.id == id) || playList.tracks[0];

        if (!item) {
          const r = await $.getJSON(`${API}?type=all&id=${id}`);
          if (r.code !== 200) {
            h5Utils.toast(`获取歌曲信息失败！`, { icon: 'error' });
            return this.nextTone();
          }

          item = {
            ...r.detail,
            url: r.mp3.url,
            comment: r.comment,
            lrc: r.lyric?.lrc,
          };
        }

        const comments = item.comment || (await $.getJSON(`${API}?type=comment&id=${id}`));
        const comment = comments.hotComments[0];

        info = {
          id,
          commentIdx: 0,
          hotComments: comments.hotComments,
          name: item.name,
          url: item.url || `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
          picurl: item.album.picUrl,
          artistsname: item.artists[0].name,
          currentComment: {
            nickname: comment ? comment.user.nickname : '',
            avatarurl: comment ? comment.user.avatarUrl : '',
            content: comment ? comment.content : '',
          },
          lrc: item.lrc,
        };

        cache.data.set(id, info);
      }
      cache.currentInfo = info;

      const currentInfo = info || cache.currentInfo;
      Object.entries(currentInfo).forEach(d => {
        if (typeof d[1] === 'string') currentInfo[d[0]] = d[1].replace(/^http:/, 'https:');
      });

      $('#title').html(currentInfo.name + '(' + currentInfo.artistsname + ')');
      el.mp3.attr('src', currentInfo.url);
      el.mp3.attr('controls', 'controls');
      el.img.attr('src', String(currentInfo.picurl).replace('http:', 'https:'));
      // $("#img2").attr("src", currentInfo.avatarurl);
      el.yh.html('来自网易云用户「@' + currentInfo.nickname + '」的评论：');
      el.pl.html(currentInfo.content);

      const u = new URL(location.href);
      u.searchParams.set('id', currentInfo.id);
      history.pushState(null, '', u.toString());

      $('#header').css({ display: 'flex' });

      // 播放列表，设置当前歌曲状态
      if ($(`#playlistContain`).length) {
        $(`#playlistContain li.current`).removeClass('current');
        $(`#playlistContain li[data-id="${currentInfo.id}"]`).addClass('current');
      }

      this.updateComment();
      this.getLrc();

      return true;
    },
    async getLrc() {
      const data = cache.currentInfo;
      if (!data) return;

      if (!data.lrc) {
        const d = await $.getJSON(`${API}?type=lrc&id=${data.id}`);
        if (d.lrc) data.lrc = d.lrc;
      }

      if (data.lrc && !data.lrc.list) {
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

      return data.lrc;
    },
    // 播放歌曲的函数
    updateLyric(time) {
      if (!cache.currentInfo || !cache.currentInfo.lrc) return;

      const currentTime = time; // 获取当前歌曲播放时间
      let currentLyricIndex = -1;
      const lyrics = cache.currentInfo.lrc.list;

      // 查找当前歌词索引
      for (let i = 0; i < lyrics.length; i++) {
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
    },
  };

  play.init();
});
