const p = Promise.all([p1, p2, p3]);


// 重新写这个方法

function all(list){
    return new Promise((resolve,reject)=>{
        let resValues = []
        let counts = 0
        for(let [i,p] of list){
            resolve(p).then(res=>{
                counts++;
                resValues[i] = res
                if(counts === list.length){
                    resolve(resValues)
                }
            },err=>{
                reject(err)
            })
        }
    })
}


// Promise.race()方法
Promise._race = promises => new Promise((resolve,reject)=>{
    promises.forEach(element => {
        element.then(resolve,reject)
    });
})


var p1 = new Promise(function(resolve){
    setTimeout(function(){
        resolve(1);
    },1000)
})

p1.then(function(val){
    var p3 = new Promise(function(resolve){
        setTimeout(function(){
            resolve(val+1)
        },1000)
    })
    return p3;
}).then(function(val){
    console.log(val)
})