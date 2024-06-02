const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const shell = require("shelljs");
const fs = require("fs");
const os = require("os");

let mainWindow;

const userHomeDir = os.homedir();
const scriptDir = path.join(userHomeDir, "aws-nuke-tool");

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

  mainWindow.loadFile(path.join(__dirname, "pages/index.html"));
}

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

ipcMain.on("create-script", (event, args) => {
  const { accessKeyId, secretAccessKey, accountNumber, selectedServices } =
    args;

  if (!fs.existsSync(scriptDir)) {
    fs.mkdirSync(scriptDir);
  }

  const scriptPath = path.join(scriptDir, "aws-nuke-linux-script.sh");

  const originalScriptPath = path.join(__dirname, "script/linux.sh");
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

  fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });
  event.sender.send("script-status", "Script prepared with provided inputs.");
});

ipcMain.on("execute-script", (event, args) => {
  const scriptPath = path.join(scriptDir, "aws-nuke-linux-script.sh");
  const shellCommand = `sh "${scriptPath}"`;
  const child = shell.exec(shellCommand, { async: true, silent: true });

  child.stdout.on("data", (data) => {
    event.sender.send("script-output", data.toString());
  });

  child.stderr.on("data", (data) => {
    event.sender.send("script-output", `Error: ${data.toString()}`);
  });

  child.on("close", (code) => {
    event.sender.send("script-output", `Process exited with code ${code}`);
  });
});
