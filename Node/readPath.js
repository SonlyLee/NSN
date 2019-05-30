var fs = require('fs')
var path = require('path')

// 解析需要遍历的文件夹
var filePath = path.resolve('./../practice/');

// 调用文件遍历方法
fileDisplay(filePath)

// 文件遍历方法  @param filePath  需要遍历的文件路径

function fileDisplay(filePath){
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            console.log(files)
            // 遍历读取的文件列表
            files.forEach(function(filename){
                // 获取当前文件的绝对路径
                var filedir = path.join(filePath,filename);
                console.log('----',filedir)
                // 根据文件路径获取文件信息，返回一个fs.stats对象
                fs.stat(filedir,function(error,stats){
                    if(error){
                        console.log('获取文件stats失败')
                    }else{
                        // 文件
                        var isFile = stats.isFile();   
                        // 文件夹
                        var isDir = stats.isDirectory();
                        if(isFile){
                            console.log(filedir)
                        }
                        if(isDir){
                            fileDisplay(filedir)
                        }
                    }
                })
            })
        }
    })
}

