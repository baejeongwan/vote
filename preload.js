const {ipcRenderer, contextBridge} = require('electron')

//This event runs when the HTML is loaded
window.addEventListener('DOMContentLoaded', () => {
    //Get the app version information from the main process and applies to the title
    ipcRenderer.invoke("get-app-version").then(function (result) {
        document.title = "투표 / 뽑기 프로그램 v" + result
        splashScreen()
    })
})

//Save CSV vote result
contextBridge.exposeInMainWorld("externalfunctions", {
    saveCSV: (csvdata) => {
        ipcRenderer.send("save-csv", csvdata)
    },
    exitApp: () => { ipcRenderer.send("exit-app") },
    saveInputData: (data) => {
        ipcRenderer.send("save-input", data)
    }
})

//Splash screen
async function splashScreen() {
    document.getElementById("splash-title").innerText = "";
    await wait(200);
    document.getElementById("splash-title").innerText += "투"
    await wait(200);
    document.getElementById("splash-title").innerText += "표"
    await wait(200);
    document.getElementById("splash-title").innerText += "및"
    await wait(200);
    document.getElementById("splash-title").innerText += " 뽑"
    await wait(200);
    document.getElementById("splash-title").innerText += "기"
    await wait(200);
    document.getElementById("splash-title").innerText += " 프"
    await wait(200);
    document.getElementById("splash-title").innerText += "로"
    await wait(200);
    document.getElementById("splash-title").innerText += "그"
    await wait(200);
    document.getElementById("splash-title").innerText += "램"
    await wait(200);
    /**
    document.getElementById("splash-loading-text").classList.remove("d-none")
    await wait(2000);
    **/
    document.getElementById("splash").classList.add("d-none")
    document.getElementById("setUpScreen").classList.remove("d-none")
    ipcRenderer.invoke("is-dev").then(function (result) {
        if (result) {
            document.getElementById("devModeAlert").style.display = "initial"
            document.getElementById("devModeAlert").classList.add("splash-loading-text")
        }
    })
}

//Wait promise
const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))