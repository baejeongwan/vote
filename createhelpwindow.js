const { BrowserWindow} = require('electron')

function createWindow() {
    let helpWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    helpWindow.loadFile("doc/index.html")
}

module.exports = {createWindow}