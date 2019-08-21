import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import {updateHandle} from "./update"
import {checkForUpdates} from "./tray";
import {setHotKeyFun} from "./hotKey";
//import store from '../renderer/store/index'


let isDev = process.env.NODE_ENV === 'development'
let env_openChromeDevTools = !!process.env.openChromeDevTools;
let isOpenDevTools = (env_openChromeDevTools || isDev)

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
/*if (!isDev) {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}*/

let staticVar = require('path').join("static")
if(!isDev) {
  staticVar = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

if(isOpenDevTools){
  app.on('ready', () => {
    if(isDev) {
      let filePath = ".electron-vue/vue-devtools-4.1.5";
      console.log("devtool-path:", filePath)
      BrowserWindow.addDevToolsExtension(filePath)
    }
    if(isOpenDevTools){
      require('electron-debug')({showDevTools: true})//打开开发工具
    }
  })
}


let mainWindow
const winURL = isDev ? `http://localhost:9080` : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    webPreferences: {
      devTools: isOpenDevTools, //Whether to enable DevTools.
      nodeIntegration: true,//是否完整的支持 node
      webSecurity: false,
    },
    height: 563,
    useContentSize: true,
    width: 1000
  })

  console.log("mainWindow.loadURL", winURL)
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  //最小化是隐藏
  mainWindow.on('minimize', () => {
    mainWindow.hide()
  })

  //非开发环境隐藏工具栏
  if (!isOpenDevTools){
    mainWindow.setMenu(null)
  }

  //自动更新方法
  updateHandle(mainWindow)

  //快捷键
  setHotKeyFun(mainWindow);
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
  mainWindow.show()
})



//托盘设置----------------------------------------------------
let trayIcon = staticVar+'/img/amex.ico';

function openWindow(menuItem, browserWindow, event) {
  mainWindow.show()
}
function exit(menuItem, browserWindow, event) {
  app.quit()
}
const { Menu, Tray} = require("electron")
let tray = null
app.on('ready', () => {

  //非windows系统不显示托盘
  let os = process.platform;
  if(os.indexOf("win32") == -1) return;

  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    { label: '打开主界面', type: 'normal', checked: true, click: openWindow},
    { label: '检查更新', type: 'normal', checked: true, click: checkForUpdates},
    { label: '退出', type: 'normal', checked: true , click: exit},
  ])
  tray.setToolTip('股票行情观察,单击打开主界面,或者右击选择退出')
  tray.setContextMenu(contextMenu)
  tray.on("click", function (event, bounds) {
    openWindow()
  })
})
//托盘设置----------------------------------------------------



