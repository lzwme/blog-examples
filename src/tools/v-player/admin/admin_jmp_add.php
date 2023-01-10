<?php include "config.php"; include dirname(__FILE__).'/../save/yun.data.php';?>
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
    <title>跳转设置-系统设置-Xyplay 智能解析</title>
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
    <div class="x-body">

        <form class="layui-form">         

            <fieldset class="layui-elem-field">
                <legend>跳转设置</legend>

                <div class="layui-field-box">

                    <div class="layui-form-item">
                        <label for="username" class="layui-form-label">
                            描述
                        </label>
                        <div class="layui-input-inline">
                            <input type="text" name="JMP_NAME" autocomplete="off" value="新的电影跳转" class="layui-input" >		
                        </div>
                        <div class="layui-form-mid layui-word-aux">
                            输入一个名称用来进行区分，例：好看的电影
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label for="username" class="layui-form-label">
                            状态
                        </label>
                        <div class="layui-input-inline">
                            <select name="JMP_OFF" lay-filter="province">							 
                                <?php foreach (array("关闭", "启用") as $key => $val): ?>							 							 
                                    <option value="<?php echo $key ?>"  <?php echo (1 ==$key) ? "selected" : '';?> ><?php echo $val ?></option>	   
<?php endforeach; ?> 			         
                            </select>
                        </div>
                      		  		  
                        <div class="layui-form-mid layui-word-aux">
                            启用状态
                        </div>
                    </div>
                      <div class="layui-form-item">
                        <label for="username" class="layui-form-label">
                           视频名
                        </label>
                        <div class="layui-input-inline">
                            <input type="text" name="JMP_TITLE" autocomplete="off" placeholder="视频名称" class="layui-input" >
                        </div>
                        <div class="layui-form-mid layui-word-aux">
                            输入视频名称，用于云播放剧集获取;
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label for="username" class="layui-form-label">
                           视频集数
                        </label>
                        <div class="layui-input-inline">
                            <input type="text" name="JMP_PART" autocomplete="off" value="1" class="layui-input" >
                        </div>
                        <div class="layui-form-mid layui-word-aux">
                            输入视频当前集数，用于云播放剧集获取;
                        </div>
                    </div>
                    
                    <div class="layui-form-item">
                        <label class="layui-form-label">源地址</label>
                        <div class="layui-input-block">
                            <input type="text" name="JMP_URL" autocomplete="off" value="" placeholder="官方视频地址" class="layui-input" >
                               <div class="layui-form-mid layui-word-aux">
                                输入官方视频链接地址，例如："https://v.qq.com/x/cover/brq7blajvjhrcit.html" 或 "brq7blajvjhrcit" ,支持正则，例如：".*?qq.com.*?brq7blajvjhrcit.*?" <br/>
                               </div> 
                        </div>						  

                    </div>

                    
                        <div class="layui-form-item">
                        <label class="layui-form-label">目标地址</label>
                        <div class="layui-input-block">
                            <input type="text" name="JMP_HREF" autocomplete="off" value="" placeholder="请输入替换的视频地址" class="layui-input" >
                                <div class="layui-form-mid layui-word-aux">
                                 输入视频文件的完整网址,例如：http://qq.com-v-qq.com/20181012/7437_eea7dcd5/index.m3u8<br/>
                               </div> 
                        </div>						  

                    </div>


                </div>
            </fieldset>    



            <div class="layui-form-item">
                <button class="layui-btn" lay-submit="" lay-filter="add">
                    保存
                </button>
            </div>


        </form>
    </div>
    <script>
      
        layui.use(['form', 'layer'], function () {
            $ = layui.jquery;
            var form = layui.form
                    , layer = layui.layer;

            //监听提交
            form.on('submit(add)', function (data) {
                  //发异步，把数据提交给php
                  data.field.type = 'jmp_add';
                  x_admin_post("admin_jmp_save.php", data.field);
                 
                return false;
            });


        });
    </script>


</body>

</html>