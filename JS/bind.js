// bind()方法会创建一个新的函数，当这个新函数被调用的时候，bind()的第一个参数将作为它运行时的this，之后的一系列参数将会在传递的实参前传入作为它的参数.
Function.prototype.bind = function (context) {
    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var self = this;
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        // 这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, args.concat(bindArgs))
    }
}

var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}
bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin

// 当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效
Function.prototype.bind2 = function (context) {
    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var self = this;
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);
    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments)
        // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
        // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
        return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
    };
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    fBound.prototype = this.prototype
    return fBound;
}



// 手写一个new的实现
function create() {
    // 创建一个空对象
    var obj = new Object();
    // 获取构造函数，arguments中取出第一个参数
    var Con = [].shift.call(arguments);
    // 连接到原型，obj可以访问到构造函数原型中的属性
    obj.__proto__ = Con.prototype;
    // 绑定this实现继承，obj可以访问到构造函数中的属性
    var ret = Con.apply(obj, arguments);
    // 优先返回构造函数返回的对象
    return ret instanceof Object ? ret : obj
}

function Person(name, age) {
    this.name = name;
    this.age = age;
}

// 使用内置函数new
var person = new Person('...');
// 使用手写的new,就是create
var person = create(Person, '...');

// 对数组进行扁平化处理
var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];
function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
console.log(Array.from(new Set(flatten(arr))).sort((a, b) => { return a - b }))


// 只判断一次
const addEvent = (function () {
    if (window.addEventListener) {
        return function (type, el, fn, capture) {
            el.addEventListener(type, fn, capture)
        }
    } else if (window.attachEvent) {
        return function (type, el, fn) {
            el.attachEvent('on' + type, fn)
        }
    }
})();


// 判断数组
function isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
}
isArray([1, 2, 3]); // true

function isNumber(obj) {
    return Object.prototype.toString.call(obj) === '[object Number]';
}

function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}

// 改造后
const toStr = Function.prototype.call.bind(Object.prototype.toString)


var add = function(x){
    var sum = x;
    var tmp = function(y){
        sum = sum + y;
        return tmp;
    }
    tmp.toString = function(){
        return sum;
    }
    return tmp;
};
 
add(1)(2)(3); 


