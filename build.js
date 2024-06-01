const fs = require("fs-extra");
const path = require("path");

const srcDir = path.join(__dirname, "node_modules/@xterm/xterm/css");
const destDir = path.join(__dirname, "dist/css");

fs.copySync(srcDir, destDir);

const srcLibDir = path.join(__dirname, "node_modules/@xterm/xterm/lib");
const destLibDir = path.join(__dirname, "dist/lib");

fs.copySync(srcLibDir, destLibDir);
