// 服务入口
var http = require('http')
var koaStatic = require('koa-static')
var path = require('path')
var koaBody = require('koa-body')
var fs = require('fs')
var Koa = require('koa2')
var cors = require('koa2-cors');
var route = require('koa-route');
var app = new Koa()
var port = '8100'

var uploadHost = `http://localhost:${port}/uploads/`;

app.use(koaBody({
    formidable: {
        // 设置文件的默认保存目录，不设置则保存在系统临时的目录下 os
        uploadDir: path.resolve(__dirname, '../public/uploads')
    },
    multipart: true  //支持文件上传
}))

// 开启静态文件访问
app.use(koaStatic(
    path.resolve(__dirname, '../public')
))

app.use(cors());

// app.use(async (ctx, next) => {
//     ctx.set('Access-Control-Allow-Origin', '*')
//     ctx.set('Access-Control-Max-Age', 864000)
//     ctx.set('Access-Control-Allow-Methods', "OPTIONS,GET,POST")
//     // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
//     ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");

//     await next();
// })

// 二次处理文件，修改名称
app.use(route.post('/singleFile', (ctx) => {
    var file = ctx.request.files ? ctx.request.files.f1 : null;  //得到文件对象
    if (file) {
        var path = file.path.replace(/\\/g, '/')
        var fname = file.name; //原文件名称
        var nextPath = ''
        if (file.size > 0 && path) {
            // 得到扩展名
            var extArr = fname.split('.')
            var ext = extArr[extArr.length - 1]
            nextPath = path + '.' + ext
            // 重命名文件
            fs.renameSync(path, nextPath)
        }
        // 以json形式输出上传文件地址
        ctx.body = `{
            'fileUrl': "${uploadHost}${nextPath.slice(nextPath.lastIndexOf('/') + 1)}"
        }`
    } else {
        ctx.body = 'null'
    }
}))

app.use(route.post('/multipleFiles', (ctx) => {
    var files = ctx.request.files.name
    var result = []
    if (!Array.isArray(files)) {
        files = [files]
    }
    files && files.forEach(item => {
        console.log(item)
        var path = item.path.replace(/\\/g, '/')
        var fname = item.name  //原文件名称
        var nextPath = path + fname
        if (item.size > 0 && path) {
            // 得到扩展名
            var extArr = fname.split(".")
            var ext = extArr[extArr.length - 1]
            var nextPath = path + '.' + ext
            // 重命名文件
            fs.renameSync(path, nextPath)
            result.push(uploadHost + nextPath.slice(nextPath.lastIndexOf('/') + 1))
        }
    })
    ctx.body = `{
        'fileUrl':${JSON.stringify(result)}
    }`
}))

// 分片处理
app.use(route.post('/shardProcessing', (ctx) => {
    console.log(ctx.request)
    var body = ctx.request.body
    var files = ctx.request.files ? ctx.request.files.name : []
    var result = []
    var fileToken = ctx.request.body.token // 文件标识
    var fileIndex = ctx.request.body.index //文件顺序

    // 单个文件上传容错
    if (files && !Array.isArray(files)) {
        files = [files]
    }
    files && files.forEach(item => {
        var path = item.path.replace(/\\/g, '/')
        var fname = item.name
        var nextPath = path.slice(0, path.lastIndexOf('/') + 1) + fileIndex + '-' + fileToken
        if (item.size > 0 && path) {
            var extArr = fname.split('.')
            var ext = extArr[extArr.length - 1]
            fs.renameSync(path, nextPath)
            console.log(nextPath)
            console.log(uploadHost + nextPath.slice(nextPath.lastIndexOf('/') + 1))
            result.push(uploadHost + nextPath.slice(nextPath.lastIndexOf('/') + 1))
        }
    })

    ctx.body = `{
        'fileUrl':${JSON.stringify(result)}
    }`
    if (body.type === 'merge') {
        // 合并文件
        var filename = body.filename
        var chunkCount = body.chunkCount
        var folder = path.resolve(__dirname, '../public/uploads') + '/'
        // 创建可写流
        var writeStream = fs.createWriteStream(`${folder}${filename}`)
        var cindex = 0
        // 合并文件
        function fnMergeFile() {
            var fname = `${folder}${cindex}-${fileToken}`
            // 该方法会读取指定文件，并返回一个ReadStream对象。
            var readStream = fs.createReadStream(fname)
            readStream.pipe(writeStream, { end: false })
            readStream.on('end', function () {
                // 异步删除文件fs.unlink
                fs.unlink(fname, function (err) {
                    if (err) {
                        throw err
                    }
                })
                if (cindex + 1 < chunkCount) {
                    cindex += 1
                    fnMergeFile()
                }
            })
        }
        fnMergeFile();

        ctx.body = 'merge ok 200';
    }

}))


// http server
var server = http.createServer(app.callback())
server.listen(port)
console.log('serer start///')