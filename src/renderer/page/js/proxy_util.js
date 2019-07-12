export const getProxyObject = (obj) => {

    if(Object.prototype.toString.call(obj) != "[object Object]") return obj

    //把 _get, _set方法设置为不可改变,不可枚举
    const config = { writable: false, enumerable: false,}
    if(obj._get) Object.defineProperty(obj, '_get', config)
    if(obj._set) Object.defineProperty(obj, '_set', config)

    Object.keys(obj).forEach(function(key) {
        let o = obj[key];
        if(Object.prototype.toString.call(o) === "[object Object]"){
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
            if(obj._set) obj._set(key, value)
            return returnVal
        }
    })
    return returnObj
}
