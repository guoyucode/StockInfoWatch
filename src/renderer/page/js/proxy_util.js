function f(obj) {
    if(!obj.get && !obj.set) return obj
    let returnObj = new Proxy(obj, {
        get: function (target, key, receiver) {
            let value = Reflect.get(target, key, receiver)
            if(obj.get) obj.get(key, value)
            return value;
        },
        set: function (target, key, value, receiver) {
            let returnVal = Reflect.set(target, key, value, receiver);
            if(obj.set) obj.set(key, value)
            return returnVal
        }
    })
    return returnObj
}

export const getProxyObject = obj => {
    for (let k in obj) {
        let v = obj[k]
        if(Object.prototype.toString.call(v) != "[object Object]") continue
        let f1 = f(v);
        obj[k] = f1
    }
    return f(obj)
}
