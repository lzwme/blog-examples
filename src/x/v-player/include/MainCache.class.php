<?php
/**
 * 缓存操作类
 */
class Main_Cache
{
    private $cachetype = 1; //默认缓存类型,1为文件，2为Redis服务
    private $cacheprot = 6379; //缓存服务端口，默认为Redis服务端口
    private $cacheTime = 3600; //默认缓存时间,单位微秒。
    private $cacheDir = './cache'; //缓存绝对路径
    private $md5 = true; //是否对键进行加密
    private $suffix = ""; //设置文件后缀
    private $cache;
    private $compress = 1; // 是否压缩数据
    public function __construct($config)
    {
        if (0 == $this->cachetype) {
            return;
        }

        if (is_array($config)) {
            foreach ($config as $key => $val) {
                $this->$key = $val;
            }
        }

        if (2 == $this->cachetype) {
            $this->cache = new Redis();
            $this->cache->connect('127.0.0.1', $this->cacheprot);

        }

    }
    //设置缓存
    public function set($key, $val, $leftTime = null)
    {
        if (0 == $this->cachetype) {
            return false;
        } elseif (1 == $this->cachetype) {
            $key = $this->md5 ? md5($key) : $key;
            $val = $this->md5 ? base64_encode($val) : $val;
            if ($this->compress == 1 && function_exists("gzcompress")) {
                $val = @gzcompress($val);
            }

            !file_exists($this->cacheDir) && mkdir($this->cacheDir, 0777);
            $file = $this->cacheDir . '/' . $key . $this->suffix;
            $leftTime = empty($leftTime) ? $this->cacheTime / 1000 : $leftTime;
            $ret = file_put_contents($file, $val) or $this->error(__line__, "文件写入失败");
            $ret = touch($file, time() + $leftTime) or $this->error(__line__, "更改文件时间失败");

        } elseif (2 == $this->cachetype) {
            $key_md5 = $this->md5 ? md5($key) : $key;
            $val_base64 = $this->md5 ? base64_encode($val) : $val;
            if ($this->compress == 1 && function_exists("gzcompress")) {
                $val_base64 = @gzcompress($val_base64);
            }

            $ret = $this->cache->set($key_md5, $val_base64);
            if (0 != $leftTime) {$this->cache->EXPIRE($key_md5, $leftTime);}
            // $this->cache->del($val_base64);
        }
        return $ret;
    }

    //得到缓存
    public function get($key)
    {

        if (0 == $this->cachetype) {
            return;

        } elseif (1 == $this->cachetype) {
            //$this->clear();

            if ($this->isset($key)) {

                $key_md5 = $this->md5 ? md5($key) : $key;
                $file = $this->cacheDir . '/' . $key_md5 . $this->suffix;
                $val = file_get_contents($file);
                if ($this->compress == 1 && function_exists("gzcompress")) {
                    $val = @gzuncompress($val);
                }

                $val = $this->md5 ? base64_decode($val) : $val;
                return $val;
            }
            return null;
        }if (2 == $this->cachetype) {
            $key_md5 = $this->md5 ? md5($key) : $key;
            $val = $this->cache->get($key_md5);
            if ($this->compress == 1 && function_exists("gzcompress")) {
                $val = @gzuncompress($val);
            }

            $val_base64 = $this->md5 ? base64_decode($val) : $val;
            return $val_base64;
        }
    }

    //判断文件是否有效
    public function isset($key)
    {
        $key = $this->md5 ? md5($key) : $key;
        $file = $this->cacheDir . '/' . $key . $this->suffix;
        if (file_exists($file)) {
            if (0 == $this->cacheTime || filemtime($file) >= time()) {
                return true;
            } else {
                @unlink($file);
                return false;
            }
        }
        return false;
    }

    //删除指定缓存
    public function unset($key)
    {
        if (0 == $this->cachetype) {
            return;
        } elseif (1 == $this->cachetype) {
            if ($this->isset($key)) {
                $key_md5 = $this->md5 ? md5($key) : $key;
                $file = $this->cacheDir . '/' . $key_md5 . $this->suffix;
                return @unlink($file);
            }
        } elseif (2 == $this->cachetype) {
            $key_md5 = $this->md5 ? md5($key) : $key;
            return $this->cache->del($key_md5);
        }
    }
    //清除过期缓存文件
    public function clear()
    {
        $files = scandir($this->cacheDir);
        $cacheTime = $this->cacheTime;

        foreach ($files as $val) {
            if (0 != $cacheTime && filemtime($this->cacheDir . "/" . $val) < time()) {
                $ret = @unlink($this->cacheDir . "/" . $val);
            }
        }
        return $ret;
    }

    //清除所有缓存文件
    public function clear_all()
    {
        $ret = true;
        if (0 == $this->cachetype) {
            return $ret;

        } elseif (1 == $this->cachetype) {
            if (!is_writable($this->cacheDir)) {return false;}
            $files = scandir($this->cacheDir);
            foreach ($files as $val) {
                @unlink($this->cacheDir . "/" . $val);
            }
        } elseif (2 == $this->cachetype) {
            $ret = $this->cache->flushAll();
        }
        return $ret;
    }
    private function __error($line, $msg)
    {

        die("出错文件：" . __file__ . "/n出错行：$line/n错误信息：$msg");
    }
}
