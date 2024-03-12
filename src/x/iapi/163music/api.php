<?php
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
    $id = $temp[1] ?: $url;
}

$result = '';

switch ($type) {
    case 'hotlist':
        $result = json_encode(get_hot_playlist(), true);
        break;
    case 'toplist':
        $result = get_toplist_from_html($id, false, tryGetReqParam('interval', 3600));
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

        $result = json_encode($result);
        break;

    default:
        $result = '{ "code": 404 }';
        break;
}

header('Content-Type:application/json; charset=utf-8');
echo $result;
