const { BrowserWindow, Menu } = require('electron')
const path = require('path')

function createHelpWindow() {
    let helpWindow = new BrowserWindow({
        width: 800,
        height: 600
    })
    helpWindow.setMenu(Menu.buildFromTemplate([{
        label: "파일",
        submenu: [{
            label: "끝내기",
            click: () => {helpWindow.close()}
        }]
    }]))
    helpWindow.loadFile("doc/index.html")
}

function createSettingsWindow() {
    let settingWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "setting_preload.js")
        }
    })

    settingWindow.loadFile("settingswindow.html")
}

module.exports = {createHelpWindow, createSettingsWindow}