<?php include "config.php";if (filter_has_var(INPUT_GET, 'id')){ $id = filter_input(INPUT_GET, 'id');}else{exit("参数调用错误！");} ?>
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/><meta name="renderer" content="webkit"/>
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8"/> <!-- 手机H5兼容模式 -->
        <meta http-equiv="pragma" content="no-cache"/><meta http-equiv="expires" content="0" />
        <meta http-equiv="Cache-Control" content="no-siteapp" /><meta http-equiv="Cache-Control" content="no-cache" />
        <title>动作编辑-防火墙设置-Xyplay 智能解析</title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" href="./css/font.css">
        <link rel="stylesheet" href="./css/xadmin.css">
        <script type="text/javascript" src="https://lzw.me/x/lib/jquery/1/jquery.min.js"></script>
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
                        <input type="text" name="BLACKLIST_BLACK_NAME" autocomplete="off" value="<?php echo $CONFIG["BLACKLIST"]['black'][$id]['name']; ?>" class="layui-input" >
                    </div>
                    <div class="layui-form-mid layui-word-aux">
                        输入一个名称用来进行区分，例：防盗链提示
                    </div>
                </div>




                <div class="layui-form-item">
                    <label for="username" class="layui-form-label">
                        语言
                    </label>
                    <div class="layui-input-inline">
                        <select name="BLACKLIST_BLACK_TYPE" lay-filter="province">

                            <?php foreach (array("HTML", "PHP") as $key => $val): ?>
                                <option value="<?php echo $key ?>" <?php echo ($CONFIG["BLACKLIST"]['black'][$id]['type'] == $key) ? "selected" : ''; ?> ><?php echo $val; ?></option>
                            <?php endforeach; ?>


                        </select>
                    </div>
                    <div class="layui-form-mid layui-word-aux">
                        支持PHP和HTML
                    </div>
                </div>


                <div class="layui-form-item">
                    <label for="username" class="layui-form-label">
                        动作
                    </label>
                    <div class="layui-input-inline">
                        <select name="BLACKLIST_BLACK_ACTION" lay-filter="province">
                            <?php foreach (array("放行", "拦截") as $key => $val): ?>
                                <option value="<?php echo $key ?>" <?php echo ($CONFIG["BLACKLIST"]['black'][$id]['action'] == $key) ? "selected" : ''; ?> ><?php echo $val; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="layui-form-mid layui-word-aux">
                        执行脚本后的后续动作，放行或拦截
                    </div>
                </div>



                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">
                        脚本
                    </label>
                    <div class="layui-input-block">
                        <textarea name="BLACKLIST_BLACK_INFO"  style="height:500px"  class="layui-textarea"><?php echo base64_decode($CONFIG["BLACKLIST"]['black'][$id]['info']); ?></textarea>

                          <div class="layui-form-mid layui-word-aux">
                          脚本，输入对应语言内容，PHP脚本常用命令介绍如下：<br>
                             1. 显示文本内容： 例子： echo "文本内容";<br>
                             2. 跳转网址： 例子(延时3秒跳转)：header("Refresh:3;url=http://nohacks.cn"); <br>
                        </div>


                    </div>
                </div>

                <div class="layui-form-item">
                    <label for="L_repass" class="layui-form-label">
                    </label>
                    <button  class="layui-btn" lay-filter="edit" lay-submit="" >
                        修改
                    </button>
                </div>
            </form>
        </div>

       <script>
            layui.use(['form', 'layer'], function () {
                  $ = layui.jquery;
                  var form = layui.form ,layer = layui.layer;
                   //监听提交
                  form.on('submit(edit)', function (data) {
                  //发异步，把数据提交给php
                  data.field.type = 'black_black_edit';  data.field.id = "<?php echo $id; ?>";
                  x_admin_post("admin.php", data.field);
                  return false;
                });
            });
        </script>

    </body>

</html>