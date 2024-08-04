<?php
/**
 * USEAGE:
 * 获取随机热榜歌曲与热评（默认）：https://lzw.me/x/iapi/163music/api.php?type=hot
 * 获取随机热榜歌曲与热评（包含多条热评）： https://lzw.me/x/iapi/163music/api.php?hotcomments=1
 * 获取榜单分类列表： https://lzw.me/x/iapi/163music/api.php?type=toplist
 * 获取指定榜单/歌单的音乐列表： https://lzw.me/x/iapi/163music/api.php?type=playlist&id=榜单id
 * 获取热榜列表： https://lzw.me/x/iapi/163music/api.php?type=playlist&id=3778678
 * 获取指定歌曲播放信息： https://lzw.me/x/iapi/163music/api.php?type=song&br=320000&id=歌曲id
 * 获取指定歌曲的歌词： https://lzw.me/x/iapi/163music/api.php?type=lrc&id=歌曲id
 * 获取指定歌曲的详情： https://lzw.me/x/iapi/163music/api.php?type=detail&id=歌曲id
 * 获取指定歌曲的热评： https://lzw.me/x/iapi/163music/api.php?type=comment&id=歌曲id
 * 获取指定歌曲的详情、歌词、热评： https://lzw.me/x/iapi/163music/api.php?type=all&br=320000&q=歌曲id
 * 获取指定 MV 信息： https://lzw.me/x/iapi/163music/api.php?type=mv&id=MV的id
 * 歌曲搜索： https://lzw.me/x/iapi/163music/api.php?type=search&q=歌曲关键字&offset=0
 *
 */

// error_reporting(0);
// error_reporting(E_ERROR | E_WARNING | E_PARSE);

include_once './api-inc.php';

allow_cros();

$id = tryGetReqParam('id');
$type = tryGetReqParam(array('type', 't'), 'mp3');
$br = tryGetReqParam('br', 320000); // 128000、192000、32000

if (!$id) {
    $url = isset($_REQUEST['url']) ? urldecode($_REQUEST['url']) : 'https://music.163.com/#/song?id=2013097125';
    $temp = explode('=', $url);
    $id = count($temp) == 2 ? $temp[1] : $url;
}

$result = '';

// 热播榜处理
if ($type === 'hotlist') {
    $type = 'playlist';
    if (!id) {
        $id = 3778678;
    }
}

switch ($type) {
    case 'toplist':
        // 排行榜列表 https://music.163.com/discover/toplist
        $result = get_toplist_cate();
        break;
    case 'playlist':
        // 按 id 获取播放列表
        $result = get_playlist($id, tryGetReqParam('interval', 3600));
        break;
    case 'mp3':
    case 'song':
        $result = get_music_play_urls($id, $br, false);
        break;
    case 'lyric':
    case 'lrc':
        $result = get_music_lyric($id, false);
        break;
    case 'detail':
        $result = get_music_detail($id, false);
        break;
    case 'mv':
        $result = get_mv_detail($id, false);
        break;
    case 'comment':
        $result = get_music_comments($id, false);
        break;
    case 'search':
        $keyword = tryGetReqParam(array('q', 's', 'keyword'), '');
        $offset = tryGetReqParam('offset', 0);
        music_search($keyword, $offset);
        break;
    case 'all':
        $result = array(
            'code' => 200,
            'mp3' => '',
            'detail' => '',
            'lyric' => '',
        );

        $info = get_music_play_urls($id, $br, true);
        if ($info['code'] !== 200) {
            $result['code'] = $info['code'];
        }
        if ($info['data']) {
            $result['mp3'] = $info['data'][0];
        }

        $info = get_music_lyric($id, true);
        if ($info['code'] !== 200) {
            $result['code'] = $info['code'];
        }
        if ($info['lrc']) {
            $result['lyric'] = $info;
        }

        $info = get_music_detail($id, true);
        if ($info['code'] !== 200) {
            $result['code'] = $info['code'];
        }
        if ($info['songs']) {
            $result['detail'] = $info['songs'][0];
        }

        $info = get_music_comments($id);
        $result['comment'] = $info ?? [];

        break;

    default:
        $result = '{ "code": 404 }';
        break;
}

header('Content-Type:application/json; charset=utf-8');
echo is_array($result) ? json_encode($result) : $result;
