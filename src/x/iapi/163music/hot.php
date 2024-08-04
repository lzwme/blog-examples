<?php
// USEAGE:
// 获取随机热榜歌曲与热评（默认）：https://lzw.me/x/iapi/163music/hot.php
// 获取随机热榜歌曲与热评（包含多条热评）： https://lzw.me/x/iapi/163music/hot.php?hotcomments=1
// 获取热榜列表： https://lzw.me/x/iapi/163music/hot.php?type=playlist
// 获取指定歌曲评论： https://lzw.me/x/iapi/163music/hot.php?type=comment&id=123456

include_once './api-inc.php';

allow_cros();

$id = isset($_REQUEST['id']) ? $_REQUEST['id'] : '3778678';
$type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 'musichot';
$result = '';

if ($type == 'playlist' || $type === 'hotlist') {
    if (!id) {
        $id = 3778678;
    }

    $result = get_playlist($id, tryGetReqParam('interval', 3600));
} else if ($type == 'comment' && $id) {
    $result = get_music_comments($id, false);
} else {
    get_music_hot(isset($_REQUEST['hotcomments']));
}

header('Content-Type:application/json; charset=utf-8');
echo is_array($result) ? json_encode($result) : $result;

function get_music_hot($includeComments)
{
    $format = isset($_GET['format']) ? $_GET['format'] : 'json';
    $music = get_hot_rand($includeComments);

    if ($format == 'text') {
        $result = $music['content'] . PHP_EOL;
        $result .= '来自@' . $music['nickname'];
        $result .= '在「' . $music['name'] . '」' . PHP_EOL;
        $result .= '歌曲下方的评论' . PHP_EOL;
        print_r($result);
    } else {
        $result = json_encode(array(
            'code' => $music['code'],
            'data' => $music,
        ));
        print_r($result);
    }
    die();
}
