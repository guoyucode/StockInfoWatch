/**
 * 升级方法
 * @param _this
 */
export const update = function(_this){

    _this.$electron.ipcRenderer.on("update-message", function(e, msg)  {
        console.log("更新消息", e, msg);
        _this.tips = msg;
        //alert(text)
    });

    _this.$electron.ipcRenderer.on("downloadProgress", function(e, msg)  {
        console.log("更新消息-下载进度", e, msg);
        //alert("下载进度: "+ progressObj.percent / 100);
        //_this.downloadPercent = progressObj.percent || 0;
    });

    _this.$electron.ipcRenderer.on("update-message_error", function(e, msg) {
        console.log("更新消息-发生错误", e, msg);
        _this.$confirm(`检查新版本出错, 是否重新检测?`, '升级提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            type: 'error'
        }).then(function () {
            _this.$electron.ipcRenderer.send("checkForUpdate")
        });
    });

    _this.$electron.ipcRenderer.on("isUpdateNow", function(e, msg) {
        console.log("更新消息-下载到新版本", e, msg);

        _this.$alert('已经成功为您下载新版本,将在您重启应用后自动安装!', '升级成功提示', {
            confirmButtonText: '我知道了',
        });

        /*_this.$confirm(`已经为您成功下载到新版本,是否现在开始安装,或者在您重启应用后,应用自动安装?`, '升级提示', {
            confirmButtonText: '现在安装',
            cancelButtonText: '我知道了',
            center: true,
            type: 'success'
        }).then(function () {
            _this.$electron.ipcRenderer.send("isUpdateNow");
        });*/
    });

    _this.$electron.ipcRenderer.on("update-message_update-available", function(e, msg) {
        console.log("更新消息-检测到新版本", e, msg);
        _this.$confirm(`检测到新版本: ${msg.version} 是否现在开始下载?`, '升级提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            type: 'warning'
        }).then(function () {
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
