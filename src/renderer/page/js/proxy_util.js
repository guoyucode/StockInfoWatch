export const getProxyObject = (obj) => {

    if(!isObj(obj)) return obj

    //把 _get, _set方法设置为不可改变,不可枚举
    const config = { writable: false, enumerable: false,}
    if(obj._get) Object.defineProperty(obj, '_get', config)
    if(obj._set) Object.defineProperty(obj, '_set', config)

    Object.keys(obj).forEach(function(key) {
        let o = obj[key];
        if(isObj(o)){
            obj[key] = getProxyObject(o)
        }
    });


    //添加代理--------------------------------------------------------------
    if(!obj._get && !obj._set) return obj
    let returnObj = new Proxy(obj, {
        get: function (target, key, receiver) {
            let value = Reflect.get(target, key, receiver)
            if(obj._get) obj.__get(key, value)
            return value;
        },
        set: function (target, key, value, receiver) {
            let returnVal = Reflect.set(target, key, value, receiver);
            if(obj._set){
                if(isObj(obj) === "Array") {
                    if(key === "length") {
                        obj._set(key, target)
                    }
                }
                else obj._set(key, value)
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
