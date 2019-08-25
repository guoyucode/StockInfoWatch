//数据库访问js文件
const db_name = "db1"
const db_version = 1
const storeName = "store1"

/**
 * 获得 indexedDB 数据仓库
 * @param dbStoreName
 * @returns {IDBObjectStore}
 */
export const getDBStore = function (callback) {

    const request = window.indexedDB.open(db_name, db_version);
    request.onerror = function (event) {
        console.error('数据库打开报错', event);
    };

    let myIndexedDB
    request.onsuccess = function (event) {
        myIndexedDB = request.result;
        const dbStore = {storeName: storeName}
        initDbStore(myIndexedDB, dbStore)
        callback(dbStore)
    };

    request.onupgradeneeded = function(event) {
        let db = event.target.result;
        db.createObjectStore(storeName, { autoIncrement: true });
    }
}


async function getAllData() {
    const db = await window.indexedDB.open(db_name, db_version);
    let tx = db.transaction(storeName, 'readonly');
    let store = tx.objectStore(storeName);
    let allSavedItems = await store.getAll();
    console.log(allSavedItems);
    db.close()
}

/**
 * 获得数据库数据
 * @param key
 * @returns {Promise<*>}
 */
export async function getDataSync(key) {
    const db = await window.indexedDB.open(db_name, db_version);
    let tx = db.transaction(storeName, 'readonly');
    let store = tx.objectStore(storeName);
    let v = key ? await store.get(key) : await store.getAll();
    db.close()
    console.log(v)
    return v
}


const initDbStore = function (myIndexedDB, dbStore) {

    /**
     * 增加和编辑操作
     */
    dbStore.push = function (key, data) {
        //此处须显式声明事物
        var store = myIndexedDB.transaction(dbStore.storeName, "readwrite").objectStore(dbStore.storeName);
        var request = store.put(data, key);
        request.onsuccess = function () {
            //console.log('添加数据库成功', key, data);
        };
        request.onerror = function (event) {
            console.error(event);
        }
    };
    /**
     * 删除数据
     */
    dbStore.delete = function (id) {
        // dbObject.db.transaction.objectStore is not a function
        let request = myIndexedDB.transaction(dbStore.storeName, "readwrite").objectStore(dbStore.storeName).delete(id);
        request.onsuccess = function () {
            //alert('删除成功');
        }
        request.onerror = function (event) {
            console.error(event);
        }
    };

    /**
     * 查询操作
     */
    dbStore.select = function (key, callback) {
        //第二个参数可以省略
        var store = myIndexedDB.transaction(dbStore.storeName, "readonly").objectStore(dbStore.storeName);
        if (key)
            var request = store.get(key);
        else
            var request = store.getAll();

        request.onsuccess = function () {
            callback(request.result)
        }
        request.onerror = function (event) {
            console.error(event);
        }
    };

    /**
     * 清除整个对象存储(表)
     */
    dbStore.clear = function () {
        var request = myIndexedDB.transaction(dbStore.storeName, "readwrite").objectStore(dbStore.storeName).clear();
        request.onsuccess = function () {
            alert('清除成功');
        }
        request.onerror = function (event) {
            console.error(event);
        }
    };
}

