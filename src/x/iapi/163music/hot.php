<?php
// USEAGE:
// 获取随机热榜歌曲与热评（默认）：https://lzw.me/x/iapi/163music/hot.php
// 获取随机热榜歌曲与热评（包含多条热评）： https://lzw.me/x/iapi/163music/hot.php?hotcomments=1
// 获取热榜列表： https://lzw.me/x/iapi/163music/hot.php?type=playlist
// 获取指定歌曲评论： https://lzw.me/x/iapi/163music/hot.php?type=comment&id=123456
// 获取任意 id 的榜单： https://lzw.me/x/iapi/163music/hot.php?type=toplist&id=123456[&interval=3600]

include_once('./api-inc.php');

allow_cros();

$id = isset($_REQUEST['id']) ? $_REQUEST['id'] : '';
$type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 'musichot';

if ($type == 'playlist') {
    print_r(json_encode(get_hot_playlist()));
} else if ($type == 'comment' && $id) {
    print_r(get_music_comments($id, false));
} else if ($type == 'toplist' && $id) {
    $info = get_toplist_from_html($id, false, isset($_REQUEST['interval']) ? $_REQUEST['interval'] : 0);
    print_r($info);
} else {
    get_music_hot(isset($_REQUEST['hotcomments']));
}

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
}

function get_hot_rand($includeComments)
{
    $rel = get_hot_playlist();

    $arr = $rel['result']['tracks'];
    $music = $arr[array_rand($arr, 1)];

    $hotComments = get_music_comments($music['id'])['hotComments'];
    $comments = $hotComments[array_rand($hotComments, 1)];
    $data = array(
        'code' => 200,
        'name' => $music['name'],
        'id' => $music['id'],
        'url' => 'https://music.163.com/song/media/outer/url?id=' . $music['id'] . '.mp3',
        'picurl' => str_replace('http:', 'https:', $music['album']['picUrl']),
        'artistsname' => $music['artists'][0]['name'],
        'avatarurl' => str_replace('http:', 'https:', $comments['user']['avatarUrl']),
        'nickname' => $comments['user']['nickname'],
        'content' => $comments['content'],
    );

    if ($includeComments) {
        $data['hotComments'] = $hotComments;
    }

    return $data;
}
