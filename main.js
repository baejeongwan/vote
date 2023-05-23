const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
//const settings = require('electron-settings')
const { autoUpdater } = require("electron-updater")

//DEVELOPMENT ONLY - Add electron reloader
try {
    require('electron-reloader')(module)
} catch {}

//#region Window Loader

//Function to create window
function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
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
    appupdatechecker()
    //Create window..
    createWindow()
    //Set menubar...
    Menu.setApplicationMenu(appMenu)
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


//#region Menubar
let appMenu = Menu.buildFromTemplate([
    {label: "파일", submenu: [{
        role: 'quit',
        label: "끝내기"
    }]},
    {role: 'help', label: "도움", submenu: [
        {
            label: "사용설명서",
            click: function () {
                require('./createhelpwindow.js').createWindow()
            }
        },
        {
            label: "제대로 작동하지 않을때 연락해야 할 곳",
            click: function () {
                require('electron').dialog.showMessageBoxSync(null, {title: "개발자 연락처", message: "이메일 jayden.bae@outlook.kr\n반,번호,이름: 1반 26번 배정완", type: "info"})
            }
        },
        {
            label: "정보",
            click: function () {
                require('electron').dialog.showMessageBoxSync(null, {message: "배정완이 (10126) 만든 투표 추첨 프로그램\n버전: " + require('electron').app.getVersion() + "\n\n사용해주셔서 감사합니다.", title: "정보", type: 'info'})
            }
        },
        {type: "separator"},
        {
            label: "디버거 열기",
            role: "toggleDevTools"
        }
    ]}
])
//#endregion

//#region IPC Handlers

//Returns app version when requested with ipcrenderer.invoke
ipcMain.handle("get-app-version", function (e) {
    return app.getVersion()
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

//#region Updater
async function appupdatechecker() {
    autoUpdater.autoDownload = false
    await autoUpdater.checkForUpdates()
    autoUpdater.addListener("update-available", async (updateinfo) => {
        let messageforupdate = `* 업데이트 알림 *\n최신 업데이트가 있습니다. 지금 설치하시겠습니까?\n\n===업데이트 정보===\n버전: ${updateinfo.version}\n업데이트 날짜:${updateinfo.releaseDate}\n업데이트 정보: ${updateinfo.releaseNotes}\n\n업데이트를 하면 잠시 다운로드가 백그라운드에서 진행됩니다. 진행 표시기가 표시되지 않으나 진행중이므로 잠시만 기다려주세요.\n투표및 뽑기 프로그램은 언제나 안정성, 기능 강화등의 이유로 최신 버전 사용을 권장합니다.`
        let chosen = await dialog.showMessageBox(null, {title: "최신 업데이트", message: messageforupdate, buttons: ["예, 지금 설치하겠습니다.", "아니요, 다음번에 알려주세요."], type: "question"})
        if (chosen.response == 0) {
            autoUpdater.downloadUpdate()
        }
    })

    autoUpdater.addListener("update-downloaded", async () => {
        let chosen = await dialog.showMessageBox(null, {title: "업데이트 준비됨", message: "업데이트 설치가 준비되었습니다. 업데이트를 선택하면 프로그램이 종료된후 업데이트를 진행합니다. 지금 설치하시겠습니까?", buttons: ["예, 프로그램을 종료하고 지금 설치합니다.", "아니요, 나중에 설치하겠습니다."], type: "question"})
        if (chosen.response == 0) {
            autoUpdater.quitAndInstall()
        }
    })

    autoUpdater.addListener("error", (err) => {
        dialog.showMessageBox(null, {title: "업데이트 설치중 오류", message: "업데이트 설치중 오류가 발생하였습니다." + err.message, type: "error"})
    })
}


//#endregion