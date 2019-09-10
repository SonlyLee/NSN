var fs = require("fs")

fs.readFile('./sample.txt', 'utf-8', (err, content) => {
    let keyWord = content.substring(0, 5);
    db.find(`select * from sample where kw=${keyWord}`, (err, res) => {
        get(`/sampleget?count=${res.length}`, data => {
            console.log(data);
        })
    })
})


// 拆分function

// HTTP请求
function getData(count){
    get(`/sampleget?count=${count}`,data=>{
        console.log(data)
    })
}
// 查询数据库
function queryDB(kw){
    db,find(`select * from sample where kw=${kw}`,(err,res)=>{
        getData(res.length);_
    })
}
// 读取文件
function readFile(filePath){
    fs.readFile(filePath,'utf-8',(err,content)=>{
        let keyWord = content.substring(0,5);
        queryDB(keyWord);
    })
}
// 执行函数
readFile('./sample.txt');



// 时间发布/监听模式
const events = require('events');
const eventEmitter = new events.EventEmitter();

eventEmitter.on('db',(err,kw)=>{
    db.find(`select * from sample where kw=${kw}`,(err,res)=>{
        eventEmitter('get',res.length);
    })
})

eventEmitter.on('get',(err,count)=>{
    get(`/sampleget?count=${count}`,data=>{
        console.log(data);
    })
})

fs.readFile('./sample.txt','utf-8',(err,content)=>{
    let keyWord = content.substring(0,5);
    eventEmitter.emit('db',keyWord)
})

// Promise
const readFile = function (filePath){
    let resolve,reject;
    let promise = new Promise((_resolve,_reject)=>{
        resolve = _resolve;
        reject = _reject;
    });
    let deferred = {
        resolve,
        reject,
        promise
    };
    fs.readFile(filePath,'utf-8',(err,...args)=>{
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(...args);
        }
    });
    return deferred.promise;
}
readFile('./sample.txt').then(content=>{
    let keyword = content.substring(0,5);
    return qyuery(keyword);
}).then(res=>{
    return getData(res.length)
}).then(data=>{
    console.log(data)
}).catch(err=>{
    console.log(err)
})



// async/await