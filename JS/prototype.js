// 原型链继承
function Parent() {
    this.names = ['arzh', 'arzh1'];
}

function Child() {

}
//主要精髓所在
Child.prototype = new Parent()
Child.prototype.constructor = Child

var arzhChild2 = new Child()
arzhChild2.names.push('arzh2')
console.log(arzhChild2.names) //[ 'arzh', 'arzh1', 'arzh2' ]

var arzhChild3 = new Child()
arzhChild3.names.push('arzh3')
console.log(arzhChild3.names) //[ 'arzh', 'arzh1', 'arzh2', 'arzh3' ]

// 缺点：（1）每个实例对引用类型属性的修改都会被其他的实例共享。（2）child无法向Parent传参


// 借用构造函数
function Parent(age) {
    this.names = ['a', 'b']
    this.age = age
}
Parent.prototype.work = function(){
    console.log('work')
}
Parent.say = function(){
    console.log('say')
}
function Child(age) {
    Parent.call(this, age)
}

var A = new Child('30')
console.log(A.names, A.age)

var B = new Child('25')
console.log(B.age)
B.work()  //B.work is not a function
Parent.say()  //say
Child.say() //Child.say is not a function
A.say()  //A.say is not a function

//（1）解决每个实例对引用类型属性的修改都会被其他的实力共享的问题  （2）子类可以向父类传参
// 缺点：（1）无法复用父类的公共函数（2）每次子类构造函数都得执行一次父类函数


// 组合式继承
function Parent(name) {
    this.name = name
    this.body = ['foot', 'hand']
}

Parent.prototype.work = function(){
    console.log('work')
}
Parent.say = function(){
    console.log('say')
}

function Child(name, age) {
    Parent.call(this, name)
    this.age = age
}

Child.prototype = new Parent()
Child.prototype.constructor = Child


var arzhChild1 = new Child('arzh1', '18')
arzhChild1.body.push('head1')
console.log(arzhChild1.name, arzhChild1.age) //arzh1 18
console.log(arzhChild1.body) //[ 'foot', 'hand', 'head1' ]

var arzhChild2 = new Child('arzh2', '20')
arzhChild2.body.push('head2')
console.log(arzhChild2.name, arzhChild2.age) //arzh2 20
console.log(arzhChild2.body) //[ 'foot', 'hand', 'head2' ]

Parent.say() //say
Child.work() //Child.work is not a function
arzhChild1.work() //work
arzhChild1.say() //arzhChild1.say is not a function
// 优点：（1）解决了每个实例对引用类型的属性修改都会被其他的实例共享问题（2）子类可以向父类传参 （3）可实现父类方法复用
// 缺点：（1）需要执行两次父类构造函数


// 原型式继承
function createObj(o) {
    function F() { }
    F.prototype = o
    return new F()
}

var person = {
    name: 'arzh',
    body: ['foot', 'hand']
}

var person1 = createObj(person)
var person2 = createObj(person)

console.log(person1) //arzh
person1.body.push('head')
console.log(person2) //[ 'foot', 'hand', 'head' ]

// 缺点: 同原型链继承一样，每个实例对引用类型属性的修改都会被其他的实例共享


class Point {
    // 构造函数
    constructor(x) {
        this.x = 1;
        this.p = 2;
    }
    // 原型对象上的方法
    print() {
        return this.x;
    }
}
Point.prototype.z = '4'

class ColorPoint extends Point {
    constructor(x) {
        // super在这儿指的是父类的构造函数，子类没有自己的this对象，而是继承父类的this对象。
        // 虽然代表了父类的构造函数，但返回的是子类的实例，即super内部的this指向子类B，相当于A.prototype.constructor.call(this, props)
        super(x);
        this.x = x; // 正确
    }
    m() {
        // super指向的是父类的原型对象
        super.print();
    }
}

let t = new ColorPoint(7)
t.m()

// 先创建父类实例this 通过class丶extends丶super关键字定义子类，并改变this指向,super本身是指向父类的构造函数但做函数调用后返回的是子类的实例，实际上做了父类.prototype.constructor.call(this)，做对象调用时指向父类.prototype,从而实现继承

// ES5和ES6继承最大的区别就是在于：
// 1.ES5先创建子类，在实例化父类并添加到子类this中
// 2.ES6先创建父类，在实例化子集中通过调用super方法访问父级后，在通过修改this实现继承