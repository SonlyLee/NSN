var fs = require('fs')
var path = require('path')


// // 读取文件
// fs.readFile(__dirname+'/test.txt',{flag: 'r+',endcoding:'utf-8'},function(err,data){
//     if(err){
//         console.warn(err);
//         return;
//     }
//     console.log(data)
// })

// // 写文件
// var w_data = "这是一段通过fs.writeFile函数写入的内容；\r\n";
// var w_data = new Buffer(w_data);

// fs.writeFile(__dirname+'/test.txt',w_data,{flag:'a'},function(err){
//     if(err){
//         console.log(err)
//     }else{
//         console.log('写入成功');
//     }
// })


// // 以追加的方式写文件
// fs.appendFile(__dirname+'/test.txt','使用fs.appendFile追加文件内容',function(){
//     console.log('追加内容完成')
// })


// 打开文件
// fs.open(filename,flags(操作标识，如‘r’),[mode](权限),callback)
fs.open(__dirname + '/test.txt', 'r', '0666', function (err, fd) {
    if (err) {
        console.log(err)
        return
    } else {
        var buffer = new Buffer(255);
        console.log(buffer.length)
        // 每一个汉字utf-8编码是3个字节，英文是一个字节
        fs.read(fd, buffer, 0, 9, 3, function (err, bytesRead, buffer) {
            if (err) {
                throw err
            } else {
                console.log(bytesRead);
                console.log(buffer.slice(0, bytesRead).toString());
                // 读取完成后，再使用fd读取时，基点是基于上次读取位置计算
                fs.read(fd, buffer, 0, 9, null, function (err, bytesRead, buffer) {
                    console.log(bytesRead)
                    console.log(buffer.slice(0, bytesRead).toString())
                })
            }
        })
    }
})

// 写文件，将缓冲区的数据写入使用fs.open打开的文件
fs.open(__dirname + '/test.txt', 'a', function (err, fd) {
    if (err) {
        console.log(err)
        return
    } else {
        var buffer = new Buffer('写入文件数据内容')

        // 写入“入文件”三个字
        fs.write(fd, buffer, 3, 9, 12, function (err, written, buffer) {
            if (err) {
                console.log('写入文件失败')
                console.log(err)
                return
            } else {
                console.log(buffer.toString())
                // 写入“数据内”三个字
                fs.write(fd, buffer, 12, 9, null, function (err, written, buffer) {
                    console.log(buffer.toString())
                })
            }
        })
    }
})

// 创建目录
fs.mkdir(__dirname + '/fsDir', function (err) {
    if (err)
        throw err;
    console.log('创建目录成功')
})

// 读取目录
fs.readdir(__dirname + '/fsDir/', function (err, files) {
    if (err) {
        console.log(err);
        return;
    } else {
        files.forEach(file => {
            var filePath = path.normalize(__dirname + '/fsDir/' + file)
            fs.stat(filePath, function (err, stat) {
                if (stat.isFile()) {
                    console.log(filePath + 'is:' + 'file');
                }
                if (stat.isDirectory()) {
                    console.log(filePath + 'is' + 'dir');
                }
            })
        });
        for (var i = 0; i < files.length; i++) {
            // 使用闭包无法保证读取文件的顺序与数组中保存的一致
            (function () {
                var filePath = path.normalize(__dirname + '/fsDir' + files[i]);
                fs.stat(filePath, function (err, stat) {
                    if (stat.isFile()) {
                        console.log(filePath + 'is:' + "file")
                    }
                    if (stat.isDirectory()) {
                        console.log(filePath + 'is' + 'dir')
                    }
                })
            })()
        }
    }
})

// 查看文件与目录的是否存在
fs.exists(__dirname + '/te', function (exists) {
    var retTxt = exists ? retTxt = '文件存在' : '文件不存在';
    console.log(retTxt)
})


// 修改文件或者目录的操作权限
fs.chmod(__dirname+'/fsDir',0666,function(err){
    if(err){
        console.log(err)
        return 
    }
    console.log('修改权限成功')
})


// 移动/重命名文件或者目录
fs.rename(__dirname+'/test',__dirname+'/fsDir',function(err){
    if(err){
        console.log(err)
        return
    }
    console.log('重命名成功')
})

// 删除空目录
fs.rmdir(__dirname+'/test',function(err){
    fs.mkdir(__dirname+'/test',0666,function(err){
        console.log('创建test目录')
    })
    if(err){
        console.log('删除空目录失败，可能原因是1.目录不存在，2.目录不为空')
        console.log(err)
        return
    }
    console.log('删除空目录成功')
})