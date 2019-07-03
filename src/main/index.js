import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    //webPreferences: {webSecurity: false},
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('minimize', () => {
    mainWindow.hide()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

//监听通知发送过来的消息
ipcMain.on("showWindows", () => {
  openWindow()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */



//托盘设置----------------------------------------------------
const path = require('path');
let trayIcon = path.join(__static, 'amex.ico');

function openWindow(menuItem, browserWindow, event) {
  mainWindow.show()
}
function exit(menuItem, browserWindow, event) {
  app.quit()
}
const { Menu, Tray } = require("electron")
let tray = null
app.on('ready', () => {
  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    { label: '打开主界面', type: 'normal', checked: true, click: openWindow},
    { label: '退出', type: 'normal', checked: true , click: exit},
  ])
  tray.setToolTip('股票信息观察,右击打开主界面或者退出')
  tray.setContextMenu(contextMenu)
  tray.on("click", function (event, bounds) {
    openWindow()
  })
})
//托盘设置----------------------------------------------------


