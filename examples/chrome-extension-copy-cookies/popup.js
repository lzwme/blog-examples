const $container = document.getElementById('container');
const $tip = document.getElementById('tip');
const $urlInput = document.getElementById('url');
const $reGetBtn = document.getElementById('reGet');
const $detailList = document.getElementById('detailList');
let currentTabUrl = '';

async function copy(refresh = true) {
  if (refresh) await getCookies($urlInput.value.trim());
  const content = $container.textContent;

  if (content) {
    navigator.clipboard.writeText(content);
    $tip.textContent = '(已复制到剪切板)';
  } else {
    $tip.textContent = '未获取到 cookies';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!$container) return;

  $container.onclick = () => copy(false);
  $reGetBtn.onclick = copy;

  chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function (tabs) {
    currentTabUrl = tabs[0].url;
    $urlInput.value = new URL(currentTabUrl).host;
    getCookies();
  });

  $urlInput.addEventListener(
    'keyup',
    ev => {
      if (ev.key === 'Enter') copy(true);
    },
    false
  );
});

function getCookies(url = currentTabUrl) {
  if (!url) url = currentTabUrl;
  if (!url.startsWith('http')) url = 'https://' + url;
  const domain = new URL(url).host;

  $urlInput.value = domain;

  return new Promise(resolve => {
    chrome.cookies.getAll(
      {
        domain,
      },
      cookies => {
        const result = { cookies, str: cookies.map(c => c.name + '=' + c.value).join(';') };
        $container.textContent = result.str;
        updateDetialList(result.cookies);
        console.log('getCookies', url, result);
        resolve(result);
      }
    );
  });
}

function updateDetialList(cookies) {
  if (!cookies?.length) {
    $detailList.innerHTML = '';
    $detailList.style.display = 'none';
    return;
  }

  const tbody = cookies
    .map(
      d => `<tr><td class="domain">${d.domain}</td><td class="name">${d.name}</td><td class="value" title="${d.value}">${d.value}</td></tr>`
    )
    .join('');

  $detailList.innerHTML = `<table><thead><tr><th>domain</th><th>name</th><th>value</th></tr></thead><tbody>${tbody}</tbody></table>`;
  $detailList.style.display = 'block';
}
