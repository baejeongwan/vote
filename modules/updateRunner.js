//Auto update runner
const { autoUpdater } = require("electron-updater")

async function appupdatechecker() {
    let updtprogressbar
    autoUpdater.addListener("update-available", async (updateinfo) => {
        let messageforupdate = `* 업데이트 알림 *\n최신 업데이트가 있습니다. 지금 설치하시겠습니까?\n\n===업데이트 정보===\n버전: ${updateinfo.version}\n업데이트 날짜:${updateinfo.releaseDate}\n업데이트 정보: ${updateinfo.releaseNotes.replace(/<[^>]*>/g, '')}\n\n업데이트를 하면 잠시 다운로드가 진행됩니다.\n투표및 뽑기 프로그램은 언제나 안정성, 기능 강화등의 이유로 최신 버전 사용을 권장합니다.`
        let chosen = await dialog.showMessageBox(null, {title: "최신 업데이트", message: messageforupdate, buttons: ["예, 지금 설치하겠습니다.", "아니요, 다음번에 알려주세요."], type: "question"})
        if (chosen.response == 0) {
            updtprogressbar = new progressbar({
                indeterminate: false,
                text: "Downloading update...    ",
                detail: "WAIT...",
                maxValue: 100
            })
            autoUpdater.downloadUpdate()
        }
    })

    autoUpdater.addListener("download-progress", (e) => {
        updtprogressbar.value = e.percent
        let progressrounded = Math.round(e.percent * 10)/10
        updtprogressbar.detail = progressrounded + "% downloaded."
    })

    autoUpdater.addListener("update-downloaded", async () => {
        updtprogressbar.close()
        let chosen = await dialog.showMessageBox(null, {title: "업데이트 준비됨", message: "업데이트 설치가 준비되었습니다. 업데이트를 선택하면 프로그램이 종료된후 업데이트를 진행합니다. 지금 설치하시겠습니까?", buttons: ["예, 프로그램을 종료하고 지금 설치합니다.", "아니요, 나중에 설치하겠습니다."], type: "question"})
        if (chosen.response == 0) {
            autoUpdater.quitAndInstall()
        }
    })

    autoUpdater.addListener("error", (err) => {
        dialog.showMessageBox(null, {title: "업데이트 설치중 오류", message: "업데이트 설치중 오류가 발생하였습니다." + err.message, type: "error"})
    })
    autoUpdater.autoDownload = false
    await autoUpdater.checkForUpdatesAndNotify()
}

module.exports = {appupdatechecker}