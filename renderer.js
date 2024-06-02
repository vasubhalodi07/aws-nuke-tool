document.addEventListener("DOMContentLoaded", () => {
  const Terminal = window.Terminal;
  const term = new Terminal();

  const terminalContainer = document.getElementById("terminal");
  term.open(terminalContainer);

  window.electron.onScriptOutput((data) => {
    const lines = data.split("\n");
    lines.forEach((line) => {
      term.writeln(line);
    });
  });

  window.electron.executeScript();
});
