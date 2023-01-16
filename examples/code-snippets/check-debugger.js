// https://github.com/AepKill/devtools-detector （推荐）
// https://github.com/sindresorhus/devtools-detect (不能检测单独打开窗口的情况)
// https://www.zhihu.com/question/24188524


// 以下代码抓取并翻译自某加密站点 (jsjiami.com)
function isOpenDebugger() {
  const startTime = now();
  (function () { Function(arguments[0] + 'bugger')()})('de'); // 等同于 debugger，只是断点时会在独立 Tab 中显示
  // (function () {}.constructor('debugger')()); // 等同于 debugger
  // debugger;

  return now() - startTime > 10;
}

function die() {
  let add = (a, b) => a + b;
  let str = '';

  for (let i = 0; i < 1000000; i++) {
    str = add(s, i.toString());
    history.pushState(0x0, 0x0, str);
  }
}

function testDebuger() {
  if (isOpenDebugger()) {
      die();
      console.clear();
      location.replace('about:blank');
      return true;
  }
  return false;
}

let start = function() {
  while (testDebuger()) {
    testDebuger();
  }
};

// --------------------------------------------------
// ## 调试替换网页加载的 js 文件
//
// 方法1：Fiddler 等代理工具拦截并修改
// 方法2：chrome F12 打开控制台，源代码Tab -> 替换(左侧Tab) -> 选择本地文件夹。
//       在源 js 文件中随便修改，然后点保存。后续可在该文件夹中编辑该文件。
