let watch = [
    {field: "xxx", callback: (cur, old)=>{}}
]

export const getProxyObject = (obj) => {

    let _notice = (k1, cur, old) => {
        let watch = obj._watch
        if (!watch || watch.length == 0) {
            return
        }
        for (let item of watch) {
            Object.keys(item).forEach(k2 => {
                if (k1 == k2) {
                    item[k2](cur, old)
                }
            })

        }
    }

    let reObj = f(obj, "", _notice);

    return reObj
}


function f(obj, field = "", _notice) {

    if (!isObj(obj)) return obj

    if(!obj._watch) obj._watch = []

    //把 _get, _set方法设置为不可改变,不可枚举
    const config = {writable: false, enumerable: false,}
    if (obj._get) Object.defineProperty(obj, '_get', config)
    if (obj._set) Object.defineProperty(obj, '_set', config)
    if (obj._watch) Object.defineProperty(obj, '_watch', config)
    if (obj._notice) Object.defineProperty(obj, '_notice', config)

    Object.keys(obj).forEach(function (key) {
        let o = obj[key];
        if (isObj(o)) {
            obj[key] = f(o, key, _notice)
        }
    });


    //添加代理--------------------------------------------------------------
    if (!obj._get && !obj._set) return obj
    let returnObj = new Proxy(obj, {
        get: function (target, key, receiver) {
            let value = Reflect.get(target, key, receiver)
            if (obj._get) obj.__get(key, value)
            return value;
        },
        set: function (target, key, newVal, receiver) {

            //通知代码
            let old = Reflect.get(target, key, receiver)
            if(old != newVal && _notice){
                let f = field ? (field + "." + key) : key;
                _notice(f, newVal, old)
            }

            let returnVal = Reflect.set(target, key, newVal, receiver);
            if (obj._set) {
                if (isObj(obj) === "Array") {
                    if (key === "length") {
                        obj._set(key, target)
                    }
                } else obj._set(key, newVal)
            }

            return returnVal
        }
    })
    return returnObj
}


// 是否是一个对象和数组: [object Object],[object Array]
const isObj = obj => {
    if(Object.prototype.toString.call(obj) == "[object Object]") return "Object"
    if(Object.prototype.toString.call(obj) == "[object Array]") return "Array"
    else return false
}
