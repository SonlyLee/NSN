// 节流函数
// 规定在一定单位时间内，只能触发一次函数，如果这个单位时间内触发多次函数，只有一次生效
// 应用场景
// 鼠标不断点击触发,mousedown(单位时间只触发一次),监听滚动事件,比如是否滑到底部自动加载更多

// fn是需要执行的函数，wait是时间间隔
const throttle = (fn, wait = 50) => {
    // 上一次执行fn的时间
    let previous = 0
    // 将throttle处理结果当做函数返回
    return function (...args) {
        // 获取当前时间，转换成时间戳，单位毫秒
        let now = +new Date()
        // 将当前时间和上一次执行函数的时间进行对比
        // 大于等待时间就是把previous设置为当前时间并执行函数fn
        if (now - previous > wait) {
            previous = now
            fn.apply(this, args)
        }
    }
}


const throttle = (fn) => {
    let canRun = true  //通过一个闭包做个标记
    return function () {
        if (!canRun) return;   //在函数开头判断标记是否为true，不为true的话则为return
        canRun = false;  //立即设置false
        setTimeout(() => {
            // 将外部传入的函数执行放在setTimeout中
            fn.apply(this, arguments)
            canRun = true;
        }, 500)
    }
}

// DEMO
// 执行throttle函数返回新函数
const betterFn = throttle(() => console.log('fn函数执行了'), 1000)
// 每10毫秒执行一次betterFn的函数，但是只有时间差大于1000时才会执行fn
setInterval(betterFn, 10)



// 防抖函数
// 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
// search搜索\用户在不断输入值时,用防抖来节约请求资源
// window触发resize的时候,不断的调整浏览器窗口大小会不断的触发这个事件,用防抖函数让其触发一次

// fn是需要防抖处理的函数，wait是时间间隔
function debounce(fn, wait = 50, immediate) {
    // 通过闭包缓存一个定时器id
    let timer = null
    // 将debounce处理结果当做函数返回
    // 触发事件回调时执行这个返回函数
    return function (...args) {
        // 如果已经设定定时器就清空上一次的定时器
        if (timer) clearTimeout(timer)

        // ------ 新增部分 start ------ 
        // immediate 为 true 表示第一次触发后执行
        // timer 为空表示首次触发
        if (immediate && !timer) {
            fn.apply(this, args)
        }
        // ------ 新增部分 end ------ 

        // 开始设定一个新的定时器，定时器结束后执行传入的函数fn
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, wait)
    }
}

// DEMO
// 执行debounce函数返回的新函数
const brtterFn = debounce(() => console.log('fn防抖执行了'), 1000, true)
// 第一次触发 scroll 执行一次 fn，后续只有在停止滑动 1 秒后才执行函数 fn
document.addEventListener('scroll', betterFn)


// 加强版throttle
// 如果用户的操作非常频繁，不等设置的延迟时间结束就进行下次操作，会频繁的清除计时器并重新生成，所以函数 fn 一直都没办法执行，导致用户操作迟迟得不到响应。

// fn是需要节流处理的函数，wait是时间间隔

function throttle(fn, wait) {
    // previous是上一次执行fn的时间，timer是定时器
    let previous = 0, timer = null;
    // 将throttle处理结果当做函数返回
    return function (...args) {
        // 获取当前时间，转换成时间戳，单位为秒
        let now = +new Date()

        if (now - previous < wait) {
            // 如果小于，则为本次触发操作设立一个新的定时器，定时器时间结束后执行函数fn 
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                previous = now
                fn.apply(this, args)
            }, wait)
        } else {
            // 第一次执行，或者时间间隔超出了设定的时间间隔，执行函数fn
            previous = now
            fn.apply(this, args)
        }
    }
}
// DEMO
// 执行 throttle 函数返回新函数
const betterFn = throttle(() => console.log('fn 节流执行了'), 1000)
// 第一次触发 scroll 执行一次 fn，每隔 1 秒后执行一次函数 fn，停止滑动 1 秒后再执行函数 fn
document.addEventListener('scroll', betterFn)


function mapToObj(map) {
    let obj = Object.create(null)
    for (let [key, value] of map) {
        obj[key] = value
    }
    return obj;
}
const map = new Map().set({ a: 3 }, 'An').set('des', 'JS')
mapToObj(map)


function objToMap(obj) {
    let map = new Map();
    for (let key of Object.keys(obj)) {
        map.set(key, obj[key])
    }
    return map
}
objToMap({ 'name': 'An', 'des': 'JS' })


function mapToJson(map) {
    return JSON.stringify([...map])
}
let map = new Map().set('name', 'An').set('des', 'js')
mapToJson(map)

function jsonToMap(jsonStr) {
    return objToMap(JSON.parse(jsonStr))
}
jsonToStrMap('{"name": "An", "des": "JS"}')

function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
}
isArray([3, 4])

