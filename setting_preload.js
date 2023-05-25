const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("setting_link", {
    checkForUpdates: () => {
        ipcRenderer.send("check-updates")
    },
    getVersion: async () => {
        return await ipcRenderer.invoke("get-app-version")
    }
})