<?php
include "config.php";
?>
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/><meta name="renderer" content="webkit"/>
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8"/> <!-- 手机H5兼容模式 -->  
        <meta http-equiv="pragma" content="no-cache"/><meta http-equiv="expires" content="0" />
        <meta http-equiv="Cache-Control" content="no-siteapp" /><meta http-equiv="Cache-Control" content="no-cache" />
        <title>规则添加-广告过滤-Xyplay 智能解析</title>
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

                <div class="layui-form-item">
                    <label for="username" class="layui-form-label">
                        描述
                    </label>
                    <div class="layui-input-inline">
                        <input type="text" name="BLACKLIST_ADBLACK_MATCH_NAME" autocomplete="off" value="新规则" class="layui-input" >		
                    </div>
                    <div class="layui-form-mid layui-word-aux">
                        输入一个名称用来进行区分，例：解析过滤
                    </div>
                </div>

                <div class="layui-form-item">
                    <label for="username" class="layui-form-label">
                        状态
                    </label>
                    <div class="layui-input-inline">
                        <select name="BLACKLIST_ADBLACK_MATCH_OFF" lay-filter="province">							 
                            <?php foreach (array("关闭", "启用") as $key => $val): ?>							 							 
                                <option value="<?php echo $key ?>"  <?php echo (1 == $key) ? "selected" : ''; ?>><?php echo $val ?></option>	   
                            <?php endforeach; ?> 
                        </select>
                    </div>

                    <div class="layui-input-inline">
                        <input type="text" name="BLACKLIST_ADBLACK_MATCH_NUM" autocomplete="off" value="100" class="layui-input" title="数字越小，优先级越高">		
                    </div>


                    <div class="layui-form-mid layui-word-aux">
                        启用状态及优先级，数字越小，优先级越高
                    </div>
                </div>


                <div class="layui-form-item">
                    <label for="username" class="layui-form-label">
                        目标
                    </label>
                    <div class="layui-input-inline">
                        <input type="text" name="BLACKLIST_ADBLACK_MATCH_TARGET" autocomplete="off" value=".*" class="layui-input" title="支持正则">
                    </div>
                    <div class="layui-form-mid layui-word-aux">
                        <span class="x-red">*</span> 需过滤网址URL,支持正则(.* 表示不限制)。
                    </div>
                </div>
                <div class="layui-form-item">
                    <label for="username" class="layui-form-label">
                        伪装
                    </label>
                    <div class="layui-input-inline">
                        <input type="text" name="BLACKLIST_ADBLACK_MATCH_REF" autocomplete="off" value="" placeholder="目标网址" class="layui-input" >
                    </div>
                    <div class="layui-form-mid layui-word-aux">
                        <span class="x-red">*</span> 伪装来源,一般为目标网址,为空则使用目标网址。
                    </div>
                </div>

                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">
                        规则
                    </label>
                    <div class="layui-input-block">
                        <textarea name="BLACKLIST_ADBLACK_MATCH_VAL"  style="height:500px"   class="layui-textarea" placeholder="过滤内容（支持正则）=>替换内容，每行一条"></textarea>
                        <div class="layui-form-mid layui-word-aux">
                          替换规则，格式：需替换内容=>待替换内容<br>
                          备注：需替换内容支持正则，可以通过查看网页源代码获取，待替换内容可以为空,则删除需替换内容；
                        
                        </div>  
                    </div>
                </div>

                <div class="layui-form-item">
                    <label for="L_repass" class="layui-form-label">
                    </label>
                    <button  class="layui-btn" lay-filter="add" lay-submit="" >
                        添加
                    </button>
                </div>
            </form>
        </div>
        <script>
            layui.use(['form', 'layer'], function () {
                $ = layui.jquery;
                var form = layui.form, layer = layui.layer;

                //监听提交
                form.on('submit(add)', function (data) {

                    //发异步，把数据提交给php 
                    data.field.type = "adblack_match_add";
                    x_admin_post("admin.php", data.field);
                    
                   return false;
                });
               
            });
        
        </script>

    </body>

</html>