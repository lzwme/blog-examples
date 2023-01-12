<?php
header('Content-type: text/json;charset=utf-8');
$format =$_GET['format'];
$post = '';
$music = get_music_list($post);

if($format == 'text') {
  $result  =  $music['content'].PHP_EOL;
  $result  .=  '来自@'. $music['nickname'];
  $result  .=  '在「'.$music['name'].'」'.PHP_EOL;
  $result  .=  '歌曲下方的评论'.PHP_EOL;
  print_r($result);
} else {
  $result = json_encode(array(
    'code' => $music['code'],
    'data' => $music
  ));
  print_r($result);
}

function get_music_list($post, $times = 0) {
  $rel = file_get_contents('https://music.163.com/api/playlist/detail?id=3778678');
  $rel = json_decode($rel,true);

  if ($rel['code'] != 200) {
    if ($times < 5) {
        sleep(0.2);
        return get_music_list('', $times + 1);
    }
    // todo: 可以增加本地缓存，失败则从缓存中取一条
    return $rel;
  }

  $arr = $rel['result']['tracks'];
  $music = $arr[array_rand($arr, 1)];
  $rel = file_get_contents('https://music.163.com/api/v1/resource/comments/R_SO_4_'.$music['id']);
  $arr = json_decode($rel,true)['hotComments'];
  $hotComments = $arr[array_rand($arr,1)];
    $data = array(
        'code' => 200,
      'name'      =>  $music['name']
      ,'url'      =>  'https://music.163.com/song/media/outer/url?id='.$music['id'].'.mp3'
      ,'picurl'    =>  str_replace('http:', 'https:', $music['album']['picUrl'])
      ,'artistsname'  =>  $music['artists'][0]['name']
    ,'avatarurl'  =>  str_replace('http:', 'https:', $hotComments['user']['avatarUrl'])
    ,'nickname'    =>  $hotComments['user']['nickname']
    ,'content'    =>  $hotComments['content']
    );
  return $data;
}
