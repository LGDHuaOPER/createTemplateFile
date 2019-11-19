### fs-extra各方法介绍
##### 异步文件操作方法
- copy 复制文件或文件夹
- emptyDir 清空文件夹（文件夹目录不删，内容清空）
- ensureFile 确保文件存在(文件目录结构没有会新建)
- ensureDir 确保文件夹存在(文件夹目录结构没有会新建)
- ensureLink 确保链接存在(链接目录结构没有会新建)
- ensureSymlink 确保符号链接存在(目录结构没有会新建)
- mkdirp 同ensureDir
- mkdirs 同ensureDir
- move 移动文件或文件夹
- outputFile 同fs.writeFile()，写文件(目录结构没有会新建)
- outputJson 写json文件(目录结构没有会新建)
- pathExists 判断文件是否存在
- readJson 读取JSON文件，将其解析为对象
- remove 删除文件或文件夹，类似rm -rf
- writeJson 将对象写入JSON文件。

##### 同步文件操作方法（异步方法名后面加上Sync即可）
- copySync
- emptyDirSync
- ensureFileSync
- ensureDirSync
- ensureLinkSync
- ensureSymlinkSync
- mkdirpSync
- mkdirsSync
- moveSync
- outputFileSync
- outputJsonSync
- pathExistsSync
- readJsonSync
- removeSync
- writeJsonSync