const terminalContainer = document.getElementById("terminal");
const Terminal = window.Terminal;

const term = new Terminal();
term.open(terminalContainer);

term.onData((data) => {
  window.electron.sendTerminalInput(data);
});

window.electron.onTerminalData((data) => {
  term.write(data);
});

window.addEventListener("resize", () => {
  const cols = Math.floor(terminalContainer.clientWidth / 9);
  const rows = Math.floor(terminalContainer.clientHeight / 17);
  window.electron.sendResize(cols, rows);
});

document.addEventListener("DOMContentLoaded", () => {
  window.electron.runScript();
});
