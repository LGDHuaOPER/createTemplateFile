var path = require('path');
var fs = require('fs');
var readline = require('readline');

var utils = require('./utils/index.js');

var argvs = global.process.argv;

function createTemplateFile () {
    if (argvs && argvs.length > 1) {
        // __dirname：返回运行文件所在的目录
        // resolve('./')：当前命令所在的目录
        // process.cwd()：当前命令所在的目录
        var cwd = process.cwd();
        var isString = utils.isString
        var NodeProcessExeAbsolutePath = argvs[0];
        var JSCurrentExecutingFilePath = argvs[1];
        var argvsObj = utils.transformArrayToObject(Array.prototype.slice.call(argvs, 2));
        var argvsObject = Object.assign({}, argvsObj, {
            '$$NodeProcessExeAbsolutePath': NodeProcessExeAbsolutePath,
            '$$JSCurrentExecutingFilePath': JSCurrentExecutingFilePath,
        });

        console.log('\n\r')
        console.log('---------- 命令行所传参数为：');
        console.log(argvsObject);
        console.log('----------');
    
        // 必要参数：模板名字、写入路径、生成文件名、生成文件后缀
        var requiredArgvs = ['templateName', 'writePath', 'fileName', 'suffix']
        var defaultArgvsValues = {
            templateName: 'a.jsx',
            writePath: './',
            fileName: 'aaaaa',
            suffix: 'jsx',
        };
        var argvsValues = {};
        var notSetTimes = 0;
        requiredArgvs.forEach(function (item) {
            if (isString(argvsObject[item])) {
                argvsValues[item] = argvsObject[item];
            } else {
                notSetTimes++;
                argvsValues[item] = defaultArgvsValues[item];
            }
        });

        console.log('\n\r');
        console.log('----------必要参数：');
        console.log('-----模板名字：');
        console.log(argvsValues.templateName);
        console.log('-----写入路径：');
        console.log(argvsValues.writePath);
        console.log('-----生成文件名：');
        console.log(argvsValues.fileName);
        console.log('-----生成文件后缀：');
        console.log(argvsValues.suffix);
        console.log('----------');

        // 获取template文件夹绝对路径
        var templateDirPath = path.resolve(__dirname, 'template');
        if (notSetTimes === requiredArgvs.length) {
            console.log('\n\r');
            console.log('必要参数：' + requiredArgvs.join('、') + ' 均未设置，即将进入交互模式');

            // 文件后缀名RegExp
            var suffixReg = new RegExp('\\.\[a-zA-Z0-9\]\{1,5\}$');

            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            var rlQuestion_templateName = function () {
                return new Promise(function (resolve, reject) {
                    rl.question('>>>>>>>>>>\n\r>>>>>请输入模板名字：', function (answer_templateName) {
                
                        if (!suffixReg.test(answer_templateName)) {
                            console.log('\n\r');
                            console.log('请输入正确的模板名字（需包含后缀名）');
                            reject();
                        } else {
                            var fullSuffix = answer_templateName.match(suffixReg)[0]
                            var interface_templateFilePath = path.resolve(templateDirPath, answer_templateName);
                            console.log('\n\r');
                            console.log('----------所用模板路径为：');
                            console.log(interface_templateFilePath);
                            console.log('----------');
        
                            // 读取模板
                            fs.readFile(interface_templateFilePath, 'utf8', function(tplErr, tplData) {
                                if (tplErr) {
                                    console.log('\n\r');
                                    console.log(interface_templateFilePath);
                                    console.log('的路径的模板不存在，请重新输入');
                                    reject(tplErr);
                                } else {
                                    resolve([fullSuffix, tplData]);
                                }
                            });
                        }

                    });
                });
            };

            var rlQuestion_writePath = function (question1_data) {
                var fullSuffix = question1_data[0];
                var tplData = question1_data[1];
                return new Promise(function (resolve, reject) {
                    rl.question('>>>>>>>>>>\n\r>>>>>请输入写入路径：', function (answer_writePath) {

                        // 获取写入绝对路径
                        var interface_writeAbsPath = path.resolve(cwd, answer_writePath);

                        // 判断写入路径是否存在，存在则判断是否文件夹，不存在则创建
                        if (fs.existsSync(interface_writeAbsPath)) {
                            var stat = fs.statSync(interface_writeAbsPath);
                            if (stat && stat.isDirectory()) {
                                resolve([fullSuffix, tplData, interface_writeAbsPath]);
                            } else {
                                console.log('\n\r');
                                console.log('写入路径为：');
                                console.log(interface_writeAbsPath);
                                console.log('路径不是一个目录');
                                reject();
                            }
                        } else {
                            fs.mkdirSync(interface_writeAbsPath, {recursive: true});
                            resolve([fullSuffix, tplData, interface_writeAbsPath]);
                        }

                    });
                });
            };

            var rlQuestion_fileName = function (question2_data) {
                var fullSuffix = question2_data[0];
                var tplData = question2_data[1];
                var interface_writeAbsPath = question2_data[2];
                return new Promise(function (resolve, reject) {
                    rl.question('>>>>>>>>>>\n\r>>>>>请输入生成文件名：', function (answer_fileName) {

                        if (answer_fileName.length === 0) {
                            console.log('\n\r');
                            console.log('请输入生成文件名');
                            reject();
                        } else {
                            var createTemplateFile_fileName;
                            var fileFullName;
                            if (suffixReg.test(answer_fileName)) {
                                createTemplateFile_fileName = answer_fileName.replace(suffixReg, '');
                                fileFullName = answer_fileName;
                            } else {
                                createTemplateFile_fileName = answer_fileName;
                                fileFullName = answer_fileName + fullSuffix;
                            }

                            var interface_writeAbsFilePath = path.resolve(interface_writeAbsPath, fileFullName);
                            fs.writeFile(interface_writeAbsFilePath, eval('`' + tplData + '`'), function (err) {
                                console.log('\n\r');
                                console.log(interface_writeAbsFilePath);
                                if (err) {
                                    console.log('的路径的模板生成失败');
                                    reject(err);
                                } else {
                                    console.log('的路径的模板生成成功！');
                                    console.log('Enjoy it!');
                                    resolve();
                                }
                            });
                        }

                    });
                });
            };

            var rlFn = async function () {
                var question1_data = await rlQuestion_templateName();
                var question2_data = await rlQuestion_writePath(question1_data);
                await rlQuestion_fileName(question2_data);
                rl.close();
                process.exit(0);
            };
              
            rlFn().catch(function (err) {
                console.log('\n\r');
                console.log(err);
                throw err;
            }).catch(function (err) {
                console.log('\n\r');
                process.exit(1);
            });

        } else {
            // 获取模板文件绝对路径
            var templateFilePath = path.resolve(templateDirPath, argvsValues.templateName);
            console.log('\n\r');
            console.log('----------所用模板路径为：');
            console.log(templateFilePath);
            console.log('----------');

            // 读取模板
            fs.readFile(templateFilePath, 'utf8', function(tplErr, tplData) {
                if (tplErr) {
                    console.log('\n\r');
                    console.log(templateFilePath);
                    console.log('的路径的模板不存在');
                    throw err;
                    process.exit(1);
                }

                // 写入模板函数，模板中需要包括 ${createTemplateFile_fileName}
                var writeInFileFn = function () {
                    var createTemplateFile_fileName = argvsValues.fileName;
                    var writeAbsFilePath = path.resolve(writeAbsPath, argvsValues.fileName + '.' + argvsValues.suffix);
                    fs.writeFile(writeAbsFilePath, eval('`' + tplData + '`'), function (err) {
                        console.log('\n\r');
                        console.log(writeAbsFilePath);
                        if (err) {
                            console.log('的路径的模板生成失败');
                            throw err;
                            process.exit(1);
                        } else {
                            console.log('的路径的模板生成成功');
                            process.exit(0);
                        }
                    });
                };

                // 获取写入绝对路径
                var writeAbsPath = path.resolve(cwd, argvsValues.writePath);

                // 判断写入路径是否存在，存在则判断是否文件夹，不存在则创建
                if (fs.existsSync(writeAbsPath)) {
                    var stat = fs.statSync(writeAbsPath);
                    if (stat && stat.isDirectory()) {
                        writeInFileFn();
                    } else {
                        console.log('\n\r');
                        console.log('写入路径为：');
                        console.log(writeAbsPath);
                        console.log('路径不是一个目录');
                        process.exit(1);
                    }
                } else {
                    fs.mkdirSync(writeAbsPath, {recursive: true});
                    writeInFileFn();
                }
            });
        }
    } else {
        console.log('\n\r');
        console.log('global.process.argv 异常');
    }
}

createTemplateFile();