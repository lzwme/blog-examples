//时间位移，0表示今天，1表示昨天，以此类推
let offset = 0;
const host = 'https://lzw.me/x/iapi/60s/?cors=1';

const config = {
  api: {
    t60s: `${host}&type=60s`,
    bing: `${host}&type=bing`,
    weibo: `${host}&type=weibo`,
    bili: `${host}&type=bili`,
  },
};

get_day_news(offset);

//获取新闻
function get_day_news(offset) {
  NProgress.start();
  // 获取壁纸
  axios
    .get(config.api.bing)
    .then(function (response) {
      document.getElementById('bing').src = response.data.data.image_url;
    })
    .catch(function (error) {
      Notiflix.Notify.failure(`获取壁纸数据失败\uD83D\uDE1E，请点击跳转至问题反馈`, function () {
        window.open('https://github.com/lzwme/blog-examples/issues/new');
      });
      NProgress.done();
      console.log(error);
    });

  axios
    .get(`${config.api.t60s}&offset=${offset}`)
    .then(function (response) {
      console.log(response.data);

      load_day_news(response.data);
      //保存当前时间(12月24日，农历腊月初二，星期六！)
      if (offset === 0) {
        localStorage.setItem('current_time', response.data.data.updated);
      }
    })
    .catch(function (error) {
      Notiflix.Notify.failure(`获取壁纸数据失败\uD83D\uDE1E，请点击跳转至问题反馈`, function () {
        window.open('https://github.com/lzwme/blog-examples/issues/new');
      });
      NProgress.done();
      console.log(error);
    });
}

//加载新闻
function load_day_news(data) {
  //切换按钮文字
  btn_text = document.getElementsByClassName('switch_btn')[0].innerText;
  try {
    NProgress.done();
    if (data.data) {
      data = data.data;
      document.getElementById('date').innerHTML = data.topic || '60s读世界！';

      if (String(data.tip).includes('【微语】')) {
        document.getElementById('weiyu').innerHTML = data.tip.replace('【微语】', '');
      } else {
        load_yiyan();
      }

      // 清空原有的新闻
      document.getElementById('news').innerHTML = '';

      for (let i = 0; i < data.news.length; i++) {
        // 将其变成 li 并插入ol
        const li = document.createElement('li');
        let n = String(data['news'][i]).replace(/^\d+(.|、) /, '');
        if (btn_text !== '切换至微博热搜') {
          li.innerHTML = `<a href=${data['urls'][i]} target='_blank'>${n}</a>`;
        } else {
          li.innerHTML = n;
        }

        document.getElementById('news').appendChild(li);
      }

      Notiflix.Notify.success(`更新成功`, {
        showOnlyTheLastOne: false,
      });
    } else {
      console.log(data);
      Notiflix.Notify.failure(`[data]加载新闻失败 \uD83D\uDE1E`);
    }
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(`[error]加载新闻失败 \uD83D\uDE1E`);
  }
}

// 打开新窗口
function bing_click() {
  window.open(document.getElementById('bing').src.split('_1920x1080.jpg')[0] + '_UHD.jpg');
}

//后一天
function after() {
  if (offset === 0) {
    Notiflix.Notify.success('当前已经是最新的了');
  } else {
    offset -= 1;
    direction = 'before';
    get_day_news(offset);
  }
}

//前一天
function before() {
  if (offset === 4) {
    Notiflix.Notify.warning('之后没有了');
  } else {
    offset += 1;
    direction = 'after';
    get_day_news(offset);
  }
}

//切换新闻
function change_origin() {
  const current_time = localStorage.getItem('current_time');
  const btn_text = document.getElementsByClassName('switch_btn')[0].innerText;
  const news_data = {
    topic: '微博热搜',
    tip: '',
    time: current_time,
    news: [],
    urls: [],
  };

  if (btn_text === '切换至微博热搜') {
    NProgress.start();
    axios
      .get(config.api.weibo)
      .then(function ({ data }) {
        for (const item of data.data) {
          news_data.news.push(item.word || item.note);
          news_data.urls.push(`https://s.weibo.com/weibo?q=${encodeURIComponent(item.word_scheme || item.word || item.note)}`);
        }

        data.data = news_data;
        load_day_news(data);
      })
      .catch(function (error) {
        Notiflix.Notify.failure(`微博热搜获取失败\uD83D\uDE1E，请点击跳转至问题反馈`, function () {
          window.open('https://github.com/lzwme/blog-examples/issues/new');
        });
        NProgress.done();
        console.log(error);
      });

    document.getElementById('news_title').innerText = '微博热搜';
    document.getElementsByClassName('before_btn')[0].style.display = 'none';
    document.getElementsByClassName('after_btn')[0].style.display = 'none';
    document.getElementsByClassName('switch_btn')[0].innerText = '切换至B站热搜';
  } else if (btn_text === '切换至B站热搜') {
    axios
      .get(config.api.bili)
      .then(function ({ data }) {
        news_data.topic = 'B站热搜';

        for (const item of data.data) {
          news_data.news.push(item.show_name || item.keyword);
          news_data.urls.push(`https://search.bilibili.com/all?keyword=${encodeURIComponent(item.keyword || item.show_name)}`);
        }

        data['data'] = news_data;
        load_day_news(data);
      })
      .catch(function (error) {
        Notiflix.Notify.failure(`B站热搜获取失败\uD83D\uDE1E，请点击跳转至问题反馈`, function () {
          window.open('https://github.com/lzwme/blog-examples/issues/new');
        });
        NProgress.done();
        console.log(error);
      });
    document.getElementById('news_title').innerText = 'B站热搜';
    document.getElementsByClassName('before_btn')[0].style.display = 'none';
    document.getElementsByClassName('after_btn')[0].style.display = 'none';
    document.getElementsByClassName('switch_btn')[0].innerText = '切换至每日早报';
  } else if (btn_text === '切换至每日早报') {
    location.reload();
  }
}

function load_yiyan() {
  axios
    .get('https://x.lzw.me/?c=k')
    .then(function (response) {
      data = response.data;
      document.getElementById('weiyu').innerHTML = response.data['hitokoto'];
    })
    .catch(function (error) {
      Notiflix.Notify.failure(`获取一言失败 \uD83D\uDE1E`);
      console.log(error);
    });
}

//字符串格式的日期格式化'yyyy-mm-dd'或者'mm-dd'
function str_to_date(str) {
  const dateRegex = /(\d{4})年?(\d{1,2})月(\d{1,2})日?/;
  const matches = str.match(dateRegex);
  if (matches) {
    return `${matches[1]}-${matches[2]}-${matches[3]}`;
  } else {
    // 如果没有年份，则默认为今年
    const year = new Date().getFullYear();
    const matches = str.match(/(\d{1,2})月(\d{1,2})日?/);
    if (matches) {
      return `${year}-${matches[1]}-${matches[2]}`;
    }
  }
  return str;
}
