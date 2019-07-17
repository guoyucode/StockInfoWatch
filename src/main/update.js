import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
export function updateHandle(mainWindow) {

    // 通过main进程发送事件给renderer进程，提示更新信息
    function sendUpdateMessage(text) {
        mainWindow.webContents.send('update-message', text)
    }

    let message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };
    const uploadUrl = "https://guoyu.link/StockInfoWatch-download/"; // 下载地址，不加后面的**.exe
    autoUpdater.setFeedURL(uploadUrl);

    autoUpdater.on('error', function (error) {
        sendUpdateMessage(message.error)
    });

    /*autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
    });*/

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        mainWindow.webContents.send('downloadProgress', progressObj)
        //mainWindow.setProgressBar(progress.percent / 100);
    })

    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

        ipcMain.on('isUpdateNow', () => {
            autoUpdater.quitAndInstall();
        });

        mainWindow.webContents.send('isUpdateNow')
    });

    ipcMain.on("checkForUpdate",()=>{
        //执行自动更新检查
        autoUpdater.checkForUpdates();
    })
}


