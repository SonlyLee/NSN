function isPromise(x){
    if(typeof x === 'function' || (typeof x === 'object' && x != null)){
        if(typeof x.then === 'function'){
            return true
        }
    }
    return false
}


Promise.all = function (values){
    return new Promise((resolve,reject)=>{
        let arr = []
        let i = 0
        let processData = (key,data) => {
            arr[i] = data
            if(++i === values.length){
                resolve(arr)
            }
        }
        for(let i=0;i<values.length;i++){
            let current = values[i]
            if(isPromise(current)){
                current.then(y=>{
                    processData(i,y)
                },reject)
            }else{
                processData(i,current)
            }
        }
    })
}


Promise.race = function(values){
    return new Promise((resolve,reject) => {
        for(let i=0;i< values.length;i++){
            let current = values[i]
            if(isPromise(current)){
                current.then(resolve,reject)
            }else{
                resolve(current)
            }
        }
    })
}


function Promise(excutor){
    let self = this
    self.status = 'pendding'
    self.value = null
    self.reason = null
    self.onFulfilledCallbacks = []
    self.onRejectedCallbacks = []
    function resolve(value){
        if(self.status === 'pendding'){
            self.value = value
            self.status = 'fulfiled'
            self.onFulfilledCallbacks.forEach(item=>item(self.value))
        }
    }
    function reject(reason){
        if(self.status === 'pendding'){
            self.reason = reason
            self.status = 'rejected'
            self.onRejectedCallbacks.forEach(item=>item(self.reason))
        }
    }
    try{
        excutor(resolve,reject)
    }catch(err){
        reject(err)
    }
}

Promise.prototype.then = function(onFulillted,onRejected){
    onFulillted = typeof onFulillted === 'function' ? onFulillted : function(data){return data}
    onRejected = typeof onRejected === 'function' ? onRejected : function (err) {throw err}
    let self = this
    if(self.status === 'fulfilled'){
        return new Promise((resolve,reject)=>{
            try{
                let x = onFulillted(self.value)
                if(x instanceof Promise){
                    x.then(resolve,reject)
                }else{
                    resolve(x)
                }
            }catch(err){
                reject(err)
            }            
        })
    }
    if(self.status === 'rejected'){
        return new Promise((resolve,reject)=>{
            try{
                let x =  onRejected(self.reason)
                if(x instanceof Promise){
                    x.then(resolve,reject)
                }else{
                    resolve(x)
                }
            }catch(err){
                reject(err)
            }
        })
    }
    if(self.status === 'pendding'){
        return new Promise((resolve,reject)=>{
            self.onFulfilledCallbacks.push(()=>{
                let x = onFulillted(self.value)
                if(x instanceof Promise){
                    x.then(resolve,reject)
                }else{
                    resolve(x)
                }
            })
            self.onRejectedCallbacks.push(()=>{
                let x = onRejected(self.reason)
                if(x instanceof Promise){
                    x.then(resolve,reject)
                }else{
                    resolve(x)
                }
            })
        })
    }
}


let a=new Set([1,2,3]);
let b=new Set([4,3,2]);

// 并集
var union= [...new Set([...a,...b])];
console.log(union);

//交集
let intersect = [...new Set([...a].filter(item => b.has(item)))]
console.log(intersect)

// 差集
let difference = [...new Set([...a].filter(item=>!b.has(item)))]
console.log(difference)

