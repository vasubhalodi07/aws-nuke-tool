const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  createScript: (data) => ipcRenderer.send("create-script", data),
  sendExecuteScript: (data) => ipcRenderer.send("execute-script", data),
  onScriptOutput: (callback) =>
    ipcRenderer.on("script-output", (event, output) => callback(output)),
  onScriptCompleted: (callback) =>
    ipcRenderer.on("script-completed", (event, message) => callback(message)),
  closeApp: () => ipcRenderer.send("close-app"),
  checkRequirements: (os) => ipcRenderer.invoke("check-requirements", os),
});
