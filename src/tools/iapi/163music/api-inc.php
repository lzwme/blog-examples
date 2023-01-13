<?php
/** 允许 CROS */
function allowCROS($origin = '')
{
    if (!$origin) {
        $origin = '*';
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            $origin = $_SERVER['HTTP_ORIGIN'];
        } else if (isset($_SERVER['HTTP_REFERER'])) {
            preg_match('/https?:\/\/[a-z0-1\.\-]/i', $_SERVER['HTTP_REFERER'], $match);
            if ($match) {
                $origin = $match;
            }
        }
    }

    header("Access-Control-Allow-Origin:" . $origin);
    header('cache-control: no-cache');
    header('Content-Type:application/json; charset=utf-8');
}

/**
 * 从 html 页面正则提取榜单列表数据（接口获取失败的降级方案）
 */
function get_toplist_from_html($id = 3778678, $toJson = true, $cacheInterval = 0)
{
    $rel = array('code' => -1, 'errmsg' => "获取榜单信息失败", 'id' => $id);
    $cacheFile = "./#cache/$id.json";

    if ($cacheInterval) {
        $cacheInterval = (int) $cacheInterval;
        if ($cacheInterval < 60) {
            $cacheInterval = 3600;
        }
    }

    if ($cacheInterval && is_file($cacheFile) && time() - filemtime($cacheFile) < $cacheInterval) {
        $rel = file_get_contents($cacheFile);
    } else {
        $hothtml = file_get_contents('https://music.163.com/discover/toplist?id=' . $id);
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

            if ($cacheInterval) {
                if (!is_dir(dirname($cacheFile))) {
                    mkdir(dirname($cacheFile), 755, true);
                }

                file_put_contents($cacheFile, json_encode($rel));
            }

        }
    }

    if ($toJson) {
        if (is_string($rel)) {
            $rel = json_decode($rel, true);
        }
    } else if (!is_string($rel)) {
        $rel = json_encode($rel);
    }

    return $rel;
}

/** 获取热歌榜（热歌榜每日更新） */
function get_hot_playlist($times = 0)
{
    $id = 3778678;
    $cacheFile = "./#cache/$id.json";
    $interval = 12 * 3600;

    if (is_file($cacheFile) && time() - filemtime($cacheFile) < $interval) {
        return json_decode(file_get_contents($cacheFile), true);
    }

    $str = file_get_contents("https://music.163.com/api/playlist/detail?id=$id");
    $rel = json_decode($str, true);

    if ($rel['code'] != 200) {
        if ($times < 3) {
            sleep(0.2);
            return get_hot_playlist($times + 1);
        }

        $rel = get_toplist_from_html($id);

        if (!$rel && is_file($cacheFile)) {
            $rel = json_decode(file_get_contents($cacheFile), true);
        }
    } else {
        file_put_contents($cacheFile, $str);
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
