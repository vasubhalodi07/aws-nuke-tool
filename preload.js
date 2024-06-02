// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("electron", {
//   sendTerminalInput: (data) => ipcRenderer.send("terminal-into", data),
//   onTerminalData: (callback) =>
//     ipcRenderer.on("terminal-inc-data", (event, data) => callback(data)),
//   sendResize: (cols, rows) => ipcRenderer.send("resize", cols, rows),
//   executeScript: (data) => ipcRenderer.send("execute-script", data),
//   onScriptStatus: (callback) =>
//     ipcRenderer.on("script-status", (event, message) => callback(message)),
//   runScript: () => ipcRenderer.send("run-script"),
// });

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  createScript: (data) => ipcRenderer.send("create-script", data),
  executeScript: (data) => ipcRenderer.send("execute-script", data),
  onScriptOutput: (callback) =>
    ipcRenderer.on("script-output", (event, output) => callback(output)),
});
