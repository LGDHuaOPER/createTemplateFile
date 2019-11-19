var path = require('path');
var fs = require('fs-extra');
// var fs = require('fs');
var readline = require('readline');
require('json5/lib/register');

var utils = require('./utils/index.js');
var config = require('./config.json5');

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
        var requiredArgvs = ['templateName', 'writePath', 'fileName']
        var defaultArgvsValues = {
            templateName: 'a.jsx',
            writePath: './',
            fileName: 'index',
        };
        // 传递参数解析处理后的对象
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

        // 兼容fileName传递'["a", "b"]'形式
        var fileNameRegExp = new RegExp(config.constant.fileNameRegExp);
        // 组件名/类名
        var varRegExp = new RegExp(config.constant.varRegExp);
        // 文件后缀名RegExp
        var suffixRegExp = new RegExp(config.constant.suffixRegExp);
        var fallBackSuffix = config.constant.fallBackSuffix;
        // 获取template文件夹绝对路径
        var templateDirPath = path.resolve(__dirname, 'template');
        
        console.log('\n\r');
        console.log('----------所传必要参数：');
        console.log('-----模板名字：');
        console.log(argvsValues.templateName);
        console.log('-----写入路径：');
        console.log(argvsValues.writePath);
        console.log('-----生成文件名（数组形式）：');
        console.log(argvsValues.fileName);
        console.log('----------');

        if (notSetTimes === requiredArgvs.length) {
            /* 未传任意一个requiredArgvs，默认为进入交互模式 */

            console.log('\n\r');
            console.log('必要参数：' + requiredArgvs.join('、') + ' 均未传递，即将进入交互模式');

            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            var rlQuestion_templateName = function () {
                return new Promise(function (resolve, reject) {
                    rl.question('>>>>>>>>>>\n\r>>>>>请输入模板名字：', function (answer_templateName) {
                
                        var interface_templateFilePath = path.resolve(templateDirPath, answer_templateName);
                        if (!suffixRegExp.test(answer_templateName)) {
                            // 当作文件夹处理
                            console.log('\n\r');
                            console.log(`模板名字不为文件名，将取  ${interface_templateFilePath}  的路径文件夹进行拷贝`);

                            rl.question('>>>>>>>>>>\n\r>>>>>请输入写入路径：', function (answer_writePath) {
                                // 获取写入绝对路径
                                var interface_writeAbsPath = path.resolve(cwd, answer_writePath);
                                fs.copy(interface_templateFilePath, interface_writeAbsPath, {overwrite: false, errorOnExist: true})
                                .then(function () {
                                    console.log('\n\r');
                                    console.log('从源文件夹');
                                    console.log(interface_templateFilePath);
                                    console.log('至目标文件夹');
                                    console.log(interface_writeAbsPath);
                                    console.log('拷贝操作成功！');
                                    console.log('\n\r');
                                    console.log('Status: Success!');
                                    resolve(true);
                                })
                                .catch(function (err) {
                                    reject(err);
                                });
                            });
                        } else {
                            var fullSuffix = answer_templateName.match(suffixRegExp)[0]
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
                            if (fileNameRegExp.test(answer_fileName)) {
                                try {
                                    var interface_fileNameArr = JSON.parse(answer_fileName);
                                    answer_fileName = interface_fileNameArr;
                                    interface_fileNameArr = null;
                                } catch (e) {
                                    console.log('\n\r');
                                    console.log('fileName尝试转化为数组失败，继续按普通字符串处理');
                                }
                            }

                            if (!Array.isArray(answer_fileName)) {
                                answer_fileName = [answer_fileName];
                            }

                            answer_fileName = answer_fileName.map(function (curFileName, i) {
                                var curFileNameSuffix = suffixRegExp.test(curFileName) ? curFileName.match(suffixRegExp)[0] : null;
                                var suffix = curFileNameSuffix || fullSuffix || fallBackSuffix;
                                curFileName = curFileName.replace(suffixRegExp, '');
                                if (!varRegExp.test(curFileName)) {
                                    console.log('\n\r');
                                    console.log('生成文件名将作为类名或组件名');
                                    console.log('生成文件名：' + curFileName);
                                    var newCurFileName = defaultArgvsValues.fileName + '' + (i + 1);
                                    console.log('不符合变量命名规范，已回退至：' + newCurFileName);
                                    return {
                                        fileName: newCurFileName,
                                        suffix: suffix
                                    };
                                }
                                return {
                                    fileName: curFileName,
                                    suffix: suffix
                                };
                            });

                            // 获取写入文件名
                            var interface_writeAbsFilePath = answer_fileName.map(function (curFileNameObj) {
                                return path.resolve(interface_writeAbsPath, curFileNameObj.fileName + curFileNameObj.suffix);
                            });

                            var errorFlag = false;
                            interface_writeAbsFilePath.forEach(function (curWriteAbsFilePath, index) {
                                if (errorFlag) return;
                                (function (curWriteAbsFilePath, index) {
                                    var createTemplateFile_fileName = answer_fileName[index].fileName;
                                    fs.writeFile(curWriteAbsFilePath, eval('`' + tplData + '`'), function (err) {
                                        console.log('\n\r');
                                        console.log(curWriteAbsFilePath);
                                        if (err) {
                                            console.log('的路径的模板生成失败');
                                            errorFlag = true;
                                            reject(err);
                                        } else {
                                            console.log('的路径的模板生成成功！');
                                        }
                                        if (index === interface_writeAbsFilePath.length - 1) {
                                            console.log('Enjoy it!');
                                            console.log('\n\r');
                                            console.log('Status: Success!');
                                            resolve();
                                        }
                                    });
                                })(curWriteAbsFilePath, index);
                            });
                        }

                    });
                });
            };

            var rlFn = async function () {
                var question1_data = await rlQuestion_templateName();
                if (Array.isArray(question1_data)) {
                    var question2_data = await rlQuestion_writePath(question1_data);
                    await rlQuestion_fileName(question2_data);
                }
                rl.close();
                process.exit(0);
            };
              
            rlFn().catch(function (err) {
                console.log('\n\r');
                console.log('执行出错，具体信息为：');
                console.log(err);
                throw err;
            }).catch(function (err) {
                console.log('\n\r');
                rl.close();
                process.exit(1);
            });

        } else {
            /* 传了任意一个requiredArgvs，进入自动模式 */

            // 处理fileName/fileNames
            if (fileNameRegExp.test(argvsValues.fileName)) {
                try {
                    var fileNameArr = JSON.parse(argvsValues.fileName);
                    argvsValues.fileName = fileNameArr;
                    fileNameArr = null;
                } catch (e) {
                    console.log('\n\r');
                    console.log('fileName尝试转化为数组失败，继续按普通字符串处理');
                }
            }
    
            if (!Array.isArray(argvsValues.fileName)) {
                argvsValues.fileName = [argvsValues.fileName];
            }
    
            var templateFileSuffix = suffixRegExp.test(argvsValues.templateName) ? argvsValues.templateName.match(suffixRegExp)[0] : null;
            
            argvsValues.fileName = argvsValues.fileName.map(function (curFileName, i) {
                var curFileNameSuffix = suffixRegExp.test(curFileName) ? curFileName.match(suffixRegExp)[0] : null;
                var suffix = curFileNameSuffix || templateFileSuffix || fallBackSuffix;
                curFileName = curFileName.replace(suffixRegExp, '');
                if (!varRegExp.test(curFileName)) {
                    console.log('\n\r');
                    console.log('生成文件名将作为类名或组件名');
                    console.log('生成文件名：' + curFileName);
                    var newCurFileName = defaultArgvsValues.fileName + '' + (i + 1);
                    console.log('不符合变量命名规范，已回退至：' + newCurFileName);
                    return {
                        fileName: newCurFileName,
                        suffix: suffix
                    };
                }
                return {
                    fileName: curFileName,
                    suffix: suffix
                };
            });

            // 获取模板文件绝对路径
            var templateFilePath = path.resolve(templateDirPath, argvsValues.templateName);
            // 获取写入绝对路径
            var writeAbsPath = path.resolve(cwd, argvsValues.writePath);
            // 获取写入文件名
            var writeAbsFilePath = argvsValues.fileName.map(function (curFileNameObj) {
                return path.resolve(writeAbsPath, curFileNameObj.fileName + curFileNameObj.suffix);
            });

            console.log('\n\r');
            console.log('所用模板绝对路径为：');
            console.log(templateFilePath);
            console.log('写入绝对路径为：');
            console.log(writeAbsPath);
            console.log('写入文件名为：');
            console.log(writeAbsFilePath.join('; '));

            // 读取模板
            fs.readFile(templateFilePath, 'utf8', function(tplErr, tplData) {
                if (tplErr) {
                    console.log('\n\r');
                    console.log(templateFilePath);
                    console.log('的路径的模板文件不存在');
                    console.log('正在尝试进行目录复制...');

                    fs.copy(templateFilePath, writeAbsPath, {overwrite: false, errorOnExist: true})
                    .then(function () {
                        console.log('\n\r');
                        console.log('从源文件夹');
                        console.log(templateFilePath);
                        console.log('至目标文件夹');
                        console.log(writeAbsPath);
                        console.log('拷贝操作成功！');
                        console.log('\n\r');
                        console.log('Status: Success!');
                        process.exit(0);
                    })
                    .catch(function (err) {
                        console.log('\n\r');
                        console.log('执行出错，具体信息为：');
                        console.log(err);
                        throw err;
                    })
                    .catch(function (err) {
                        console.log('\n\r');
                        process.exit(1);
                    });
                } else {
                    // 写入模板函数，模板中需要包括 ${createTemplateFile_fileName}
                    var writeInFileFn = function (writeAbsFilePath, tplData, argvsValues) {
                        var errorFlag = false;
                        writeAbsFilePath.forEach(function (curWriteAbsFilePath, index) {
                            if (errorFlag) return false;
                            (function (curWriteAbsFilePath, index) {
                                var createTemplateFile_fileName = argvsValues.fileName[index].fileName;
                                fs.writeFile(curWriteAbsFilePath, eval('`' + tplData + '`'), function (err) {
                                    console.log('\n\r');
                                    console.log(curWriteAbsFilePath);
                                    if (err) {
                                        console.log('的路径的模板生成失败');
                                        errorFlag = true;
                                        throw err;
                                    } else {
                                        console.log('的路径的模板生成成功');
                                    }
                                    if (index === writeAbsFilePath.length - 1) {
                                        console.log('\n\r');
                                        console.log('Status: Success!');
                                        process.exit(0);
                                    }
                                });
                            })(curWriteAbsFilePath, index);
                        });
                    };

                    try {
                        // 判断写入路径是否存在，存在则判断是否文件夹，不存在则创建
                        if (fs.existsSync(writeAbsPath)) {
                            var stat = fs.statSync(writeAbsPath);
                            if (stat && stat.isDirectory()) {
                                writeInFileFn(writeAbsFilePath, tplData, argvsValues);
                            } else {
                                console.log('\n\r');
                                console.log('写入路径为：');
                                console.log(writeAbsPath);
                                console.log('路径不是一个目录');
                                process.exit(1);
                            }
                        } else {
                            fs.mkdirSync(writeAbsPath, {recursive: true});
                            writeInFileFn(writeAbsFilePath, tplData, argvsValues);
                        }
                    } catch (e) {
                        console.log(e);
                        process.exit(1);
                    }
                }
            });

        }
    } else {
        console.log('\n\r');
        console.log('global.process.argv 异常');
    }
}

createTemplateFile();