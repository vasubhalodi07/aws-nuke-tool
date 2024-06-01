const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const os = require("os");
const pty = require("node-pty");
const fs = require("fs");

let mainWindow;
let shell;
let newScriptPath;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("pages/index.html");

  shell = pty.spawn(getShellCommand().command, getShellCommand().args, {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.CURR_DIR,
    env: process.env,
  });

  shell.on("data", function (data) {
    mainWindow.webContents.send("terminal-inc-data", data);
  });
}

function getShellCommand() {
  switch (os.platform()) {
    case "win32":
      return { command: "powershell.exe", args: [] };
    case "darwin":
    case "linux":
    default:
      return { command: "bash", args: [] };
  }
}

ipcMain.on(
  "execute-script",
  (
    event,
    { accessKeyId, secretAccessKey, accountNumber, selectedServices }
  ) => {
    const originalScriptPath = path.join(__dirname, "script/linux.sh");
    newScriptPath = path.join(__dirname, "modified_linux.sh");

    let scriptContent = fs.readFileSync(originalScriptPath, "utf8");
    scriptContent = scriptContent.replace(
      /{{SELECTED_SERVICES}}/g,
      selectedServices.join(",")
    );
    scriptContent = scriptContent.replace(/{{ACCESS_KEY_ID}}/g, accessKeyId);
    scriptContent = scriptContent.replace(
      /{{SECRET_ACCESS_KEY}}/g,
      secretAccessKey
    );
    scriptContent = scriptContent.replace(/{{ACCOUNT_NUMBER}}/g, accountNumber);

    fs.writeFileSync(newScriptPath, scriptContent, { mode: 0o755 });
    event.sender.send("script-status", "Script prepared with provided inputs.");
  }
);

ipcMain.on("run-script", () => {
  if (os.platform() === "win32") {
    shell.write(
      `powershell -command "& {Start-Process -FilePath '${newScriptPath}' -Verb RunAs}"\n`
    );
  } else {
    shell.write(`chmod +x ${newScriptPath}\n`);
    shell.write(`sudo ${newScriptPath}\n`);
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("terminal-into", (event, data) => {
  shell.write(data);
});

ipcMain.on("resize", (event, cols, rows) => {
  shell.resize(cols, rows);
});
