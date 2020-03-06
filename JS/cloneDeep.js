function isObject(target) {
    return typeof target === 'object' && target !== null
}
// 用于查找
function find(arr, item) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].source === item) {
            return arr[i]
        }
    }
}
function cloneDeep(source, list) {
    if (!isObject(source)) {
        return source
    }
    if (!list) {
        list = []
    }
    var target = Array.isArray(source) ? [] : {}

    // 数据已经存在，返回保存的数据
    var findListData = find(list, source);
    if (findListData) {
        return findListData.target
    }
    // 数据如果不存在，保存源数据，以及对应的引用
    list.push({
        source: source,
        target: target
    })

    // ====================新增代码，判断symbol
    let symKeys = Object.getOwnPropertySymbols(source)
    if (symKeys.length) {
        // 查找成功
        symKeys.forEach(symKey => {
            if (isObject(source[symKey])) {
                target[symKey] = cloneDeep(source[symKey], list)
            } else {
                target[symKey] = source[symKey]
            }
        })
    }
    // 在这一块可以使用Object.keys()
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep(source[key], list)
            } else {
                target[key] = source[key]
            }
        }
    }
    return target
}



function deepCopy(source) {
    if(!source || typeof source !== 'object' ){
        return
    }
    var target = Array.isArray(source) ? [] : {}
    for(var keys in source){
        if(source.hasOwnProperty(keys)){
            if(source[keys] && typeof source[keys] === 'object'){
                target[keys] = source[keys].constructor === Array ? [] : {}
                target[keys] = deepCopy(source[keys])
            }else{
                target[keys] = source[keys]
            }
        }
    }
    return target
}

