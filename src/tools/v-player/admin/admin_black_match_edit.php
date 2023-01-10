<?php include "config.php";if (filter_has_var(INPUT_GET, 'id')){ $id = filter_input(INPUT_GET, 'id');}else{exit("参数调用错误！");} ?>
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
    <head> 
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/><meta name="renderer" content="webkit"/>
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8"/> <!-- 手机H5兼容模式 -->  
        <meta http-equiv="pragma" content="no-cache"/><meta http-equiv="expires" content="0" />
        <meta http-equiv="Cache-Control" content="no-siteapp" /><meta http-equiv="Cache-Control" content="no-cache" />
         <title>规则修改-防火墙设置-Xyplay 智能解析</title>
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
                        <input type="text" name="BLACKLIST_MATCTH_NAME" autocomplete="off" value="<?php echo $CONFIG["BLACKLIST"]['match'][$id]['name']; ?>" class="layui-input" >		
                    </div>
                    <div class="layui-form-mid layui-word-aux">
                        输入一个名称用来进行区分，例：授权网站
                    </div>
                </div>

                <div class="layui-form-item">
                    <label for="username" class="layui-form-label">
                        状态
                    </label>
                    <div class="layui-input-inline">
                        <select name="BLACKLIST_MATCTH_OFF" lay-filter="province">							 

                            <?php foreach (array("关闭", "启用") as $key => $val): ?>							 							 
                                <option value="<?php echo $key ?>"  <?php echo ($CONFIG["BLACKLIST"]['match'][$id]['off'] == $key) ? "selected" : ''; ?>><?php echo $val ?></option>	   
<?php endforeach; ?> 




                        </select>
                    </div>

                    <div class="layui-input-inline">
                        <input type="text" name="BLACKLIST_MATCTH_NUM" autocomplete="off" value="<?php echo $CONFIG["BLACKLIST"]['match'][$id]['num']; ?>" class="layui-input" title="数字越小，优先级越高">		
                    </div>


                    <div class="layui-form-mid layui-word-aux">
                        启用状态及优先级，数字越小，优先级越高
                    </div>
                </div>


                <div class="layui-form-item">
                    <label for="username" class="layui-form-label">
                        类型
                    </label>
                    <div class="layui-input-inline">
                        <select name="BLACKLIST_MATCTH_TYPE" lay-filter="province">							 

                            <?php foreach (array("来源域名", "目标网址", "浏览器标识", "客户IP") as $key => $val): ?>							 							 
                                <option value="<?php echo $key ?>" <?php echo ($CONFIG["BLACKLIST"]['match'][$id]['type'] == $key) ? "selected" : ''; ?> ><?php echo $val; ?></option>	   
                           <?php endforeach; ?> 




                        </select>
                    </div>
                    <div class="layui-form-mid layui-word-aux">
                        请根据需要选择合适类型，看参看对象说明;
                    </div>
                </div>


                <div class="layui-form-item">
                    <label for="username" class="layui-form-label">
                        规则
                    </label>
                    <div class="layui-input-inline">
                        <select name="BLACKLIST_MATCTH_MATCH" lay-filter="province">							 

                            <?php foreach (array("不匹配时拦截", "匹配时拦截") as $key => $val): ?>							 							 
                                <option value="<?php echo $key ?>" <?php echo ($CONFIG["BLACKLIST"]['match'][$id]['match'] == $key) ? "selected" : ''; ?> ><?php echo $val; ?></option>	   
                            <?php endforeach; ?>   			         
                        </select>
                    </div>



                    <div class="layui-form-mid layui-word-aux">
                        拦截规则，选择与对象匹配时拦截还是不匹配时拦截；
                    </div>
                </div>





                <div class="layui-form-item">
                    <label for="username" class="layui-form-label">
                        动作
                    </label>


                    <div class="layui-input-inline">
                        <select name="BLACKLIST_MATCTH_BLACK" lay-filter="province">							 
                            <?php foreach ($CONFIG["BLACKLIST"]['black'] as $key => $val): ?>							 							 
                                <option   value="<?php echo $key ?>" <?php echo ($CONFIG["BLACKLIST"]['match'][$id]['black'] == $key) ? "selected" : ''; ?> ><?php echo $val['name']; ?></option>	   
<?php endforeach; ?>   

                        </select>
                    </div>

                    <div class="layui-form-mid layui-word-aux">
                        拦截动作，可在动作设置中设置；
                    </div>
                </div>
                 <div class="layui-form-item">
                    <label for="username" class="layui-form-label">
                        路径
                    </label>
                    <div class="layui-input-block">
                        <input type="text"  name="BLACKLIST_MATCTH_FOR" autocomplete="off"  placeholder=".*" value="<?php echo $CONFIG["BLACKLIST"]['match'][$id]['for']; ?>" class="layui-input" >	
                    <div class="layui-form-mid layui-word-aux">
                       输入需生效的PHP脚本路径，支持正则,例如:".*";或 "api.php|/video/index.php"
                    </div>
                    </div>
                    
                </div>

                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">
                        对象
                    </label>
                    <div class="layui-input-block">
                        <textarea name="BLACKLIST_MATCTH_VAL"  style="height:300px"   class="layui-textarea" ><?php $word = '';
foreach ($CONFIG["BLACKLIST"]['match'][$id]['val'] as $key) {
    $word .= trim($key) . "\r\n";
}echo $word; ?></textarea>
                        
                        <div class="layui-form-mid layui-word-aux">
                          拦截对象，输入对应类型内容,每行一条，支持正则,具体方法如下：<br>
                          支持变量$host(解析域名)及空值<br>
                          1.域名白名单(防盗链)： 类型选择“来源域名”，规则选择"不匹配时拦截",此处需输入授权域名,如：mov.nohacks.cn<br>
                          2.域名黑名单：类型选择“来源域名”，规则选择"匹配时拦截",此处需输入非法域名,如：mov.av.com<br>
                          3.视频黑/白名单：类型选择“目标网址”，规则选择"匹配时拦截"或"不匹配时拦截",此处需输入视频网址,如：av.net<br>
                          4.IP黑/白名单： 类型选择“客户IP”，规则选择"匹配时拦截"或"不匹配时拦截",此处需输入IP,如：127.0.0.1<br>
                          5.浏览器白/黑名单(APP可自定义浏览器标识:User-Agent)：类型选择“浏览器标识”，规则选择"不匹配时拦截"或"匹配时拦截",此处需输入浏览器标识,如：xysoft<br>
                          提示:app客户一般都有域名空间，把根目录的play.html放在客户域名，然后客户APP通过"客户域名/play.html?url=解析地址" + 视频地址的方式调用，即可通过域名白名单设置授权。
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
                  data.field.type = 'black_match_edit';  data.field.id = "<?php echo $id; ?>";
                  x_admin_post("admin.php", data.field);
                  return false;
                });
            });
        </script>
    </body>

</html>