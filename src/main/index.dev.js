/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
import {BrowserWindow} from "electron";

require('electron-debug')({ showDevTools: true })

// Install `vue-devtools`
require('electron').app.on('ready', () => {

  //需要翻墙,使用不了
  /*let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })*/

  //使用本地离线版的vue-tool开发工具
  let filePath = ".electron-vue/vue-devtools-4.1.5";
  console.log("devtool-path:", filePath)
  BrowserWindow.addDevToolsExtension(filePath)
})

// Require `main` process to boot app
require('./index')
