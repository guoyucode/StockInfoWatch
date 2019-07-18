/**
 * 升级方法
 * @param _this
 */
export const update = function(_this){

    _this.$electron.ipcRenderer.on("update-message", (event, text) => {
        console.log(arguments);
        _this.tips = text;
        //alert(text)
    });

    _this.$electron.ipcRenderer.on("downloadProgress", (event, progressObj)=> {
        //alert("下载进度: "+ progressObj.percent / 100);
        //_this.downloadPercent = progressObj.percent || 0;
    });

    _this.$electron.ipcRenderer.on("update-message_error", (e, msg) => {
        _this.$confirm(`检查新版本出错, 是否重新检测?`, '升级提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            type: 'error'
        }).then(() => {
            _this.$electron.ipcRenderer.send("checkForUpdate")
        });
    });

    _this.$electron.ipcRenderer.on("isUpdateNow", (e, msg) => {
        _this.$confirm(`已经为您成功下载到新版本,是否现在开始安装?`, '升级提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            type: 'success'
        }).then(() => {
            _this.$electron.ipcRenderer.send("isUpdateNow");
        });
    });

    _this.$electron.ipcRenderer.on("update-message_update-available", (e, msg) => {
        _this.$confirm(`检测到新版本,是否现在开始下载?`, '升级提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            type: 'warning'
        }).then(() => {
            _this.$electron.ipcRenderer.send("downloadUpdate");
        });
    });

    checkForUpdate(_this)
}

let isDev = process.env.NODE_ENV === 'development'
let checkForUpdate = function (_this) {
    //if(isDev) return;
    function check() {
        _this.$electron.ipcRenderer.send("checkForUpdate");
    }
    setTimeout(check, 15*1000)
    setInterval(check, 1000*60*60*6)
}
