var fs = require('fs');


// 大文件拷贝，通过读写流的方式
function copy(src,dst){
    fs.createReadStream(src).pipe(fs.createWriteStream(dst))
}


// 小文件拷贝，通过读写
function read(src,dst){
    fs.writeFileSync(dst,fs.readFileSync(src));
}

function main(argv){
    copy('./test.txt','./write.txt')
}

main()