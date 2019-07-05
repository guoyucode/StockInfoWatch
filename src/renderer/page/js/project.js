
/**
 * 初始化数据库数据
 * @param vue vue实例
 * @param key 唯一的key,例如: cls
 */
export const initDB = function(vue, key){
    vue.dbStore.select(key + ".setInterval_time", v => {
        if(v != undefined) vue.setInterval_time = v;
    })
    vue.dbStore.select(key + ".enableNotice", v => {
        if(v != undefined) vue.enableNotice = v;
    })
}
