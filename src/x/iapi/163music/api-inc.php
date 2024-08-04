<?php

require_once 'FileCache.class.php';

$CACHE = new FileCache(['md5' => false, 'suffix' => '.json']);

/** 允许 CROS */
function allow_cros($origin = '')
{
    if (!$origin) {
        $origin = '*';
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            $origin = $_SERVER['HTTP_ORIGIN'];
        } else if (isset($_SERVER['HTTP_REFERER'])) {
            preg_match('/https?:\/\/[a-z0-1\.\-]+/i', $_SERVER['HTTP_REFERER'], $match);
            if ($match) {
                $origin = $match[0];
            }
        }
    }

    header("Access-Control-Allow-Origin:" . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With, Token");
    header('cache-control: no-cache');
    header('Content-Type:application/json; charset=utf-8');
}

function tryGetReqParam($keys, $default = null)
{
    $keysList = is_string($keys) ? array($keys) : $keys;
    foreach ($keysList as $key => $value) {
        if ($value && isset($_REQUEST[(string) $value])) {
            return $_REQUEST[$value];
        }
    }

    return $default;
}

/** 获取排行榜分类列表 */
function get_toplist_cate($maxAge = 6 * 3600)
{
    global $CACHE;
    $cacheKey = 'music_toplist';
    $rel = ['code' => 100, 'data' => []];

    if ($maxAge) {
        $cacheInfo = $CACHE->getCacheInfo($cacheKey);

        if ($cacheInfo) {
            $rel = $cacheInfo['data'];

            if ($cacheInfo['valid']) {
                return $rel;
            }
        }
    }

    $html = file_get_contents('https://music.163.com/discover/toplist');
    preg_match_all('/<p class="name"><a href="\/discover\/toplist\?id=(\d+)" class="s-fc0">([^<]+)</im', $html, $match);

    if ($match && $match[1]) {
        $list = [];
        foreach ($match[1] as $idx => $id) {
            $list[$idx] = ['id' => $id, 'name' => $match[2][$idx]];
        }

        $rel = array('code' => 200, 'data' => $list);
        $CACHE->set($cacheKey, $rel, $maxAge);
    }

    return $rel;
}

/** 获取播放列表（支持缓存） */
function get_playlist($id, $maxAge = 3600)
{
    $rel = array('code' => -1, 'errmsg' => "获取榜单信息失败", 'id' => $id);

    global $CACHE;
    $cacheKey = "playlist_$id";

    if ($maxAge) {
        $maxAge = (int) $maxAge;
        if ($maxAge < 60) {
            $maxAge = 3600;
        }

        $cacheInfo = $CACHE->getCacheInfo($cacheKey);

        if ($cacheInfo) {
            $rel = $cacheInfo['data'];

            if ($cacheInfo['valid']) {
                return $rel;
            }
        }
    }

    $rel = get_playlist_byid($id) ?? $rel;

    if ($maxAge && ($rel['code'] == 200 || !$rel['code'])) {
        $CACHE->set($cacheKey, $rel, $maxAge);
    }

    return $rel;
}

/**
 * 从 html 页面正则提取榜单播放列表数据（接口获取失败的降级方案）
 */
function get_playlist_from_html($id = 3778678)
{
    $hothtml = file_get_contents('https://music.163.com/playlist?id=' . $id);
    preg_match('/<textarea id="song-list-pre-data" style="display:none;">(.*)<\/textarea/i', $hothtml, $match);

    if ($match && $match[1]) {
        preg_match('/<h2 class="f-ff2">(.*)</', $hothtml, $titleMatch);

        $rel = array(
            'code' => 200,
            'result' => array(
                'tracks' => json_decode($match[1], true),
                'creator' => array(),
                'name' => $titleMatch[1] ?: '',
                'id' => $id,
            ),
        );

        return $rel;
    }
}

/** 获取播放列表数据（热歌榜每1小时更新一次） */
function get_playlist_byid($id = 3778678, $times = 0)
{
    $str = file_get_contents("https://music.163.com/api/playlist/detail?id=$id");
    $rel = json_decode($str, true);

    if ($rel['code'] != 200) {
        if ($times < 3) {
            usleep(200);
            return get_playlist_byid($id, $times + 1);
        }

        $rel = get_playlist_from_html($id);
    }

    return $rel;
}

/** 获取指定歌曲评论信息 */
function get_music_comments($id, $toJson = true)
{
    $rel = file_get_contents('https://music.163.com/api/v1/resource/comments/R_SO_4_' . $id);
    return $toJson ? json_decode($rel, true) : $rel;
}

/** 批量获取指定歌曲播放 url 地址 */
function get_music_play_urls($ids, $br = 320000, $toJson = false)
{
    $url = "https://music.163.com/api/song/enhance/player/url?ids=[{$ids}]&br={$br}";
    $rel = file_get_contents($url);
    return $toJson ? json_decode($rel, true) : $rel;
}

/** 获取歌曲歌词 */
function get_music_lyric($id, $toJson = false)
{
    $url = "https://music.163.com/api/song/lyric?lv=1&kv=1&tv=-1&id={$id}";
    $rel = file_get_contents($url);
    return $toJson ? json_decode($rel, true) : $rel;
}

/** 获取歌曲详情 */
function get_music_detail($ids, $toJson = false)
{
    $url = "https://music.163.com/api/song/detail/?ids=%5B{$ids}%5D";
    $rel = file_get_contents($url);
    return $toJson ? json_decode($rel, true) : $rel;
}

/** 获取指定 mv 详情 */
function get_mv_detail($id, $toJson = false)
{
    $url = "https://music.163.com/api/mv/detail?id={$id}&type=mp4";
    $rel = file_get_contents($url);
    return $toJson ? json_decode($rel, true) : $rel;
}

function music_search($keyword, $offset = 0, $toJson = false)
{
    $url = "https://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s={$keyword}&type=1&offset={$offset}&total=true&limit=2";
    $rel = file_get_contents($url);
    return $toJson ? json_decode($rel, true) : $rel;
}

/** 获取热歌榜随机歌曲 */
function get_hot_rand($includeComments = true)
{
    $rel = get_playlist(3778678);
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
