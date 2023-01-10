<?php include "config.php"; include '../save/yun.config.php';include '../save/yun.match.php'; ?>
<html lang="zh-cmn-Hans">
    <head>
        <title>系统设置</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/><meta name="renderer" content="webkit"/>
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8"/> <!-- 手机H5兼容模式 -->  
        <meta http-equiv="pragma" content="no-cache"/><meta http-equiv="expires" content="0" />
        <meta http-equiv="Cache-Control" content="no-siteapp" /><meta http-equiv="Cache-Control" content="no-cache" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" href="./css/font.css">
        <link rel="stylesheet" href="./css/xadmin.css">
        <script type="text/javascript" src="./js/jquery.min.js"></script>
        <script type="text/javascript" src="./lib/layui/layui.js" charset="utf-8"></script>
        <script type="text/javascript" src="./js/xadmin.js"></script>
        <!-- 让IE8/9支持媒体查询，从而兼容栅格 -->
        <!--[if lt IE 9]>
          <script src="https://cdn.staticfile.org/html5shiv/r29/html5.min.js"></script>
          <script src="https://cdn.staticfile.org/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>

    <body>
        <div class="x-nav">
            <span class="layui-breadcrumb">
                <a><cite>首页</cite></a>  
                <a><cite>系统设置</cite></a>
                <a><cite>云播放设置</cite></a>
            </span>

            <a class="layui-btn layui-btn-small" style="line-height:1.6em;margin-top:3px;float:right"  href="javascript:location.replace(location.href);" title="刷新"><i class="layui-icon" style="line-height:30px">ဂ</i></a>
            <button   onclick="updata()" class="layui-btn"    style="line-height:1.6em;margin-top:3px;margin-right:5px;float:right" > 更新规则  </button> 
        </div>
        <div class="x-body">
            <div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                <ul class="layui-tab-title">
                    <li class="layui-this">资源设置</li>
                    <li>规则设置</li>

                </ul>
                <div class="layui-tab-content" >



                    <div class="layui-tab-item layui-show">


                        <form class="layui-form layui-form-pane" action="">

                                <div class="layui-form-item">
                    <label class="layui-form-label">
                        跳转开关
                    </label>
                    <div class="layui-input-inline">
                        <select name="yun_config_jmp_off" lay-filter="province">							 
                            <?php foreach (array("关闭", "开启") as $key => $val): ?>							 							 
                                <option  value="<?php echo $key ?>"   <?php echo ($YUN_CONFIG['jmp_off'] == $key) ? "selected" : ''; ?> ><?php echo $val; ?></option>	   
                            <?php endforeach; ?>   
                        </select>

                    </div>
                  <div class="layui-form-mid layui-word-aux">是否开启跳转功能,如果部分资源标题匹配错误，可以用跳转设置手动指定视频标题;</div>            
                </div>  
                             <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                   视频站点过滤,限制要使用云播放的网站,如果为空则不限制，例子：'v.qq.com|iqiyi.com|youku.com' ,
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" name="yun_config_url_filter" autocomplete="off" value="<?php echo $YUN_CONFIG["url_filter"]; ?>" class="layui-input" />	
                                </div>
                            </div>
                            
                            
                                <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                   资源标题黑名单,如果设置正则与资源标题匹配则不会显示,如果为空则不限制,例子：'激情|写真|成人' ,
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" name="yun_config_name_filter" autocomplete="off" value="<?php echo $YUN_CONFIG["name_filter"]; ?>" class="layui-input" />	
                                </div>
                            </div>
                            
                               <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                   资源来源白名单,如果设置正则与来源匹配才会显示,如果为空则不限制,例子：'m3u8|mp4' ,
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" name="yun_config_flag_filter" autocomplete="off" value="<?php echo $YUN_CONFIG["flag_filter"]; ?>" class="layui-input" />	
                                </div>
                            </div>
                            
                              <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                    来源标签转换,每条一行,例子：'ckm3u8=>线路1' ,
                                </label>
                                <div class="layui-input-block">
                                 <textarea   style="height:200px" name="yun_config_flag_replace"  class="layui-textarea" ><?php foreach ($YUN_CONFIG["flag_replace"] as $key => $val) {echo "$key=>$val\r\n";} ?></textarea>	
                                </div>
                            </div>
                            
                            
                            <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                    资源站设置(每行一条，尽量使用m3u8资源，格式：显示名称=>API地址)
                                </label>
                                <div class="layui-input-block">
                                    <textarea  name="yun_config_api"  style="height:500px" class="layui-textarea" ><?php $word = '';foreach ($YUN_CONFIG["API"] as $key) { $word .= trim($key) . "\r\n";}echo $word; ?></textarea>
                                </div>
                            </div>
                            
                         
                            
                            
                            

                            <div class="layui-form-item">

                                <button class="layui-btn" lay-submit="" lay-filter="yun">
                                    保存
                                </button>
                            </div>
                        </form>

                    </div>

                    <div class="layui-tab-item ">
                        <form class="layui-form layui-form-pane" action="">

                            <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                    404跳转设置，如果网页标题包含将跳转404页面，多个请用"|"分割,设置为空则不使用；
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" name="yun_match_error_404" autocomplete="off" value="<?php echo $YUN_MACTH["ERROR_404"]; ?>" class="layui-input" />	
                                </div>
                            </div>

                     

                            <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                    输出类型转换（支持正则,格式： 正则(匹配播放源或URL) => 输出类型，每条一行）
                                </label>
                                <div class="layui-input-block">
                                    <textarea  name="yun_match_type_match"  class="layui-textarea" ><?php if(is_array($YUN_MACTH["type_match"])){foreach ($YUN_MACTH["type_match"] as $key => $val) {echo "$key=>$val" . "\r\n";}} ?></textarea>	
                                </div>
                            </div>

                            <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                    视频标题过滤（每条一行）
                                </label>
                                <div class="layui-input-block">
                                    <textarea  name="yun_match_title_replace"  class="layui-textarea" ><?php if(is_array($YUN_MACTH["title_replace"])) {foreach ($YUN_MACTH["title_replace"] as $val) { echo "$val" . "\r\n";}}?></textarea>	
                                </div>
                            </div>   
                            <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                    URL地址过滤（每条一行）
                                </label>
                                <div class="layui-input-block">
                                    <textarea  name="yun_match_url_replace"  class="layui-textarea"><?php if(is_array($YUN_MACTH["url_replace"])){foreach ( $YUN_MACTH["url_replace"] as $val){ echo "$val" ."\r\n";}} ?></textarea>	
                                </div>
                            </div> 

                            <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                    视频地址转换,使用PHP正则,规则：'=>'后面的'(?n)'会用前面正则左起第n个小括号里的匹配内容替换。
                                </label>
                                <div class="layui-input-block">
                                    <textarea   style="height:200px" name="yun_match_url_match"  class="layui-textarea" ><?php if(is_array($YUN_MACTH["url_match"])){foreach ($YUN_MACTH["url_match"] as $key => $val) {echo "$key=>$val" . "\r\n";}}?></textarea>	
                                </div>
                            </div>
                             
                            <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                    视频标题规则设置(格式：视频站正则=>标题正则1,标题正则2，... ，注意:标题正则的子表达式1应为包含标题信息的文本【如果有HTML标签,内部会过滤处理】)
                                </label>
                                <div class="layui-input-block">
                                    <textarea   style="height:200px" name="yun_match_title_match"  class="layui-textarea" ><?php if(is_array($YUN_MACTH["title_match"])){foreach ($YUN_MACTH["title_match"] as $key => $val) {$b = '';foreach ($val as $k => $a) { if (sizeof($val) == ($k + 1)) { $b .= "$a"; } else {$b .= "$a" . ","; }}echo"$key=>$b" . "\r\n";}} ?></textarea>	

                                </div>
                            </div>
                            
                            <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">
                                    视频名称和集数规则设置(格式：视频站正则=>标题正则1,标题正则2，... ，注意:标题正则的子表达式1应为标题,子表达式2应为集数)
                                </label>
                                <div class="layui-input-block">
                                    <textarea   style="height:200px" name="yun_match_name_match"  class="layui-textarea" ><?php if(is_array($YUN_MACTH["title_match"])){foreach ($YUN_MACTH["name_match"] as $key => $val) {$b = '';foreach ($val as $k => $a) { if (sizeof($val) == ($k + 1)) { $b .= "$a"; } else {$b .= "$a" . ","; }} echo "$key=>$b" . "\r\n";}}?></textarea>	
                                <div class="layui-form-mid layui-word-aux">规则调试路径   ："/video/?dd=1&url=视频地址" ,显示出的视频标题如果有多余部分加入标题过滤即可！</div> 
                                </div>
                            </div>


                            <div class="layui-form-item">
                                <button class="layui-btn" lay-submit="" lay-filter="yun"  >
                                    保存
                                </button>
                            </div>



                        </form>
                    </div> 

                </div>

            </div>
        </div> 
    </div>


    <script>

        layui.use(['form', 'layer'], function () {
            $ = layui.jquery;
            var form = layui.form, layer = layui.layer;
            //监听提交
            form.on('submit(yun)', function (data) {
                //发异步，把数据提交给php
                x_admin_post("admin_yun_save.php", data.field);
                return false;
            });

        });

        /*用户-同步规则*/
        function updata() { x_admin_post("admin.php", {"type": "upyundata", "id": "updata"});}

    </script>



</body>

</html>