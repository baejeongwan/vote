const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
//const settings = require('electron-settings')
const progressbar = require('electron-progressbar')
const updateRunner = require("./modules/updateRunner")

//DEVELOPMENT ONLY - Add electron reloader
try {
    require('electron-reloader')(module)
} catch {}

//VAR LOADER
let runtimeconf = require("./modules/runTimeConfManager").readRuntimeConfig()

//#region Window Loader

//Function to create window
function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            devTools: runtimeconf.isDev
        }
    })

    win.loadFile("index.html")
    win.webContents.addListener("devtools-opened", () => {
        dialog.showMessageBox(win, {title: "[중요경고] 개발자 도구 열림 - 신뢰성을 더이상 보장 못함", message: "[투표결과에 영향을 줄 가능성이 있는 중요경고입니다]\n\n개발자 도구가 열렸습니다. 이로 인하여 투표의 신뢰성을 더이상 보장할수없습니다. 이 도구를 통하여 투표결과가 조작되었을수있기 때문입니다.", type: "warning"})
    })
}

//When app is ready...
app.whenReady().then(function () {
    //set_loader()
    //Update OFF
    //updateRunner.appupdatechecker()
    //Create window..
    createWindow()
    //Set menubar...
    Menu.setApplicationMenu(require("./modules/menudesign").menuMaker(runtimeconf.isDev))
    //And add handler for macOS, creating window when all windows are closed.
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
    //Register app as default protocol handler - disabled this since there is no use for this by now
    //app.setAsDefaultProtocolClient("voteandrandom")
})

//When window is all closed...
app.on('window-all-closed', function () {
    //And the platform is not darwin (macOS)
    if (process.platform !== 'darwin') {
        //Then quit app!
        app.quit()
    }
})

//#endregion

//#region IPC Handlers

//Returns app version when requested with ipcrenderer.invoke
ipcMain.handle("get-app-version", function (e) {
    return app.getVersion()
})

ipcMain.handle("is-dev", (e) => {
    return runtimeconf.isDev
})

ipcMain.on("save-csv", function (e, arg) {
    dialog.showSaveDialog(null, {title: "결과파일 저장", message: "결과파일을 CSV (엑셀파일) 형태로 저장합니다.", filters: [{name: "CSV 파일 (엑셀파일)", extensions: ['csv']}, {name: "All files", extensions: ["*"]}]}).then(function (result) {
        if (result.filePath != undefined) {
            fs.writeFileSync(result.filePath, arg)
        }
    })
})

ipcMain.on("exit-app", function (e) {
    app.quit()
})

ipcMain.on("check-updates", function (e) {
    updateRunner.appupdatechecker()
})

//#endregion


//#region Settings
/*async function set_loader() {
    if (await settings.has("updatechannel")) {
        console.log("UPDATE CHANNEL IS", settings.get("updatechannel"))
    } else {
        await settings.set("updatechannel", "stable")
    }
}*/

//#endregion