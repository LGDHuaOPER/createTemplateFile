## createTemplateFile
### 根据模板文件，插入定义的类名或变量名，生成文件


[文章地址](https://blog.csdn.net/LGD_HuaFEEng/article/details/103288971)

## 技能项

您只需要会使用node、git、文件路径基础知识。

## 从git仓库拉取代码

git地址([https://github.com/LGDHuaOPER/createTemplateFile](https://github.com/LGDHuaOPER/createTemplateFile))


## 执行index.js文件
你可以在任意地方执行index.js文件，比如我是在父级目录执行
![node运行index.js文件](https://img-blog.csdnimg.cn/20191128095916763.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0xHRF9IdWFGRUVuZw==,size_16,color_FFFFFF,t_70#pic_center)

当然你也可以在你项目package.json的scripts字段编写快捷命令。
若未传任意必须参数，则进入交互模式：
![即将进入交互模式](https://img-blog.csdnimg.cn/20191128100947287.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0xHRF9IdWFGRUVuZw==,size_16,color_FFFFFF,t_70#pic_center)

此时可按照交互提示进行生成。

当传递了命令行参数，则直接进入生成组件模式：
![直接进入生成组件模式](https://img-blog.csdnimg.cn/20191128102754157.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0xHRF9IdWFGRUVuZw==,size_16,color_FFFFFF,t_70#pic_center)

图中可以看到，当templateName不是文件名时，将会直接采用文件夹模式进行复制。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191128103154810.png#pic_center)

成功！
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191128103317636.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0xHRF9IdWFGRUVuZw==,size_16,color_FFFFFF,t_70#pic_center)


## 结语
感兴趣的同学可以clone源码直接修改玩玩，也可以给我提PR！