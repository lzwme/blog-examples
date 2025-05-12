<?php

/** 基于文件的文本缓存 */
class FileCache
{
    private $cacheDir = './.cache'; //缓存绝对路径
    private $maxAge   = 3600;       //默认缓存时间，单位秒
    private $md5      = true;       //是否对键进行加密
    private $suffix   = "";         //设置文件后缀
    public function __construct($config = [])
    {
        if (is_array($config)) {
            foreach ($config as $key => $val) {
                $this->$key = $val;
            }
        }
    }
    private function getCacheFile($key, $checkExist = true)
    {
        $key_md5  = $this->md5 ? md5($key) : $key;
        $filepath = $this->cacheDir . '/' . $key_md5 . $this->suffix;
        return (! $checkExist || file_exists($filepath)) ? $filepath : '';
    }
    public function set($key, $val, $maxAge = null)
    {
        if ($maxAge == null) {
            $maxAge = $this->maxAge;
        }

        $val = json_encode([
            'data' => $val,
            't'    => $maxAge ? time() + $maxAge : 0,
        ]);

        if ($this->md5) {
            // $val = base64_encode($val);
            $compressed = gzcompress($val);
            if ($compressed === false) {
                $this->error(__LINE__, "数据压缩失败");
            } else {
                $val = $compressed;
            }
        }

        $file = $this->getCacheFile($key, false);
        if (! file_exists($this->cacheDir) && ! mkdir($this->cacheDir, 0777, true)) {
            $this->error(__LINE__, "无法创建缓存目录: " . $this->cacheDir);
            return false;
        }
        if (file_put_contents($file, $val) === false) {
            $this->error(__LINE__, "文件写入失败: " . $file);
            return false;
        }

        return true;
    }
    /** 获取缓存内容（返回缓存信息，不检查过期与否） */
    public function getCacheInfo($key, $isFile = false)
    {
        $filepath = $isFile ? $key : $this->getCacheFile($key);

        if ($filepath) {
            $val = @file_get_contents($filepath);

            if ($val === false) {
                $this->error(__LINE__, "文件读取失败: " . $filepath);
                return false;
            }

            if ($this->md5) {
                $decompressed = gzuncompress($val);
                if ($decompressed === false) {
                    $this->error(__LINE__, "数据解压失败");
                } else {
                    $val = $decompressed;
                }
            }

            $result = @json_decode($val, true);
            if ($result) {
                $result['valid'] = 0 == $result['t'] || time() < $result['t'];
            }

            return $result;
        }
    }
    /** 获取缓存（原始内容） */
    public function get($key, $checkExpired = true, $delExpired = true)
    {
        $filepath = $this->getCacheFile($key);
        $result   = $this->getCacheInfo($filepath, true);

        if ($result) {
            if (! $checkExpired || $result['valid']) {
                return $result['data'];
            }

            $delExpired && @unlink($filepath);
        }
    }
    /** 文件缓存是否存在 */
    public function isset($key, $checkExpired = false)
    {
        if ($checkExpired) {
            return $this->get($key) != null;
        }

        return $this->getCacheFile($key) != '';
    }
    /** 删除指定缓存 */
    public function unset($key)
    {
        $filepath = $this->getCacheFile($key);
        return file_exists($filepath) ? @unlink($filepath) : false;
    }
    private function isExpired($file)
    {
        $r = $this->getCacheInfo($file, true);
        return ! $r || $r['valid'] == false;
    }
    /** 清除缓存文件 */
    public function clear($isall = false)
    {
        $files = scandir($this->cacheDir);

        foreach ($files as $val) {
            $file = $this->cacheDir . "/" . $val;
            if (is_file($file) && ($isall || $this->isExpired($file))) {
                @unlink($file);
            }
        }
    }
    private function error($line, $msg)
    {
        echo("出错文件：" . __file__ . "/n出错行：$line/n错误信息：$msg");
    }
}

// test
// $cache = new FileCache(['md5' => false]);
// $cache->set('a', 'bbb', 5);
// $r = $cache->get('a');
// var_dump($r);
