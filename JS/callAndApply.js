Function.prototype.call = function (context) {
    // 当context是null的时候，this指向window
    var context = context || window
    context.fn = this;
    var args = [];
    for (var i = 1; len = arguments.length, i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args + ')');
    delete context.fn;
    return result
}

// es6的写法
Function.prototype.apply = function (context) {
    context = context ? Object(context) : window;
    context.fn = this;
    let args = [...arguments].slice(1);
    let result = context.fn(...args)
    delete context.fn;
    return result
}

// apply
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    } else {
        var args = [];
        for (var i = 0; i < arr.length; i++) {
            args.push('arr[' + i + ']')
        }
        result = eval('context.fn(' + args + ')')
    }
    delete context.fn
    return result
}

// 测试一下
var foo = {
    value: 1
}
function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value)
}



// 将参数数组切块后循环传入目标方法
function concatOfArray(arr1, arr2) {
    var QUANTUM = 32768;
    for (var i = 0; i < arr2.length; i += QUANTUM) {
        Array.prototype.push.apply(
            arr1, arr2.slice(i, Math.min(i + QUANTUM, arr2.length))
        )
    }
    return arr1;
}
var arr1 = [-3, -2, -1];
var arr2 = [];
for (var i = 0; i < 100000; i++) {
    arr2.puah(i)
}

Array.prototype.push.apply(arr1, arr2);
// Uncaught RangeError: Maximum call stack size exceeded

concatOfArray(arr1, arr2);
// (1000003) [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...]


// 验证是否是数组的方法
// 可以通过toString() 来获取每个对象的类型，但是不同对象的 toString()有不同的实现，所以通过 Object.prototype.toString() 来检测，需要以 call() / apply() 的形式来调用，传递要检查的对象作为第一个参数。
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

isArray([1, 2, 3]) //true


// 类数组转为数组的方法
var arr = [].slice.call(arguments)
//   ES6:
let arr = Array.from(arguments)
let arr = [...arguments]

// 类数组兼容低版本的处理
function toArray(nodes) {
    try {
        return Array.prototype.slice.call(nodes)
    } catch (err) {
        var arr = [], length = nodes.length;
        for (var i = 0; i < length; i++) {
            arr[i] = nodes[i]
        }
        return arr;
    }
}

