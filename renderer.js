document.addEventListener("DOMContentLoaded", () => {
  const Terminal = window.Terminal;
  const term = new Terminal();

  const terminalContainer = document.getElementById("terminal");
  term.open(terminalContainer);

  window.electron.sendExecuteScript();

  window.electron.onScriptOutput((data) => {
    const lines = data.split("\n");
    lines.forEach((line) => {
      term.writeln(line);
    });
  });

  window.electron.onScriptCompleted((message) => {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";

    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "white";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "5px";
    modalContent.style.textAlign = "center";

    const messageText = document.createElement("p");
    messageText.textContent = message;

    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.style.marginTop = "20px";
    okButton.addEventListener("click", () => {
      window.electron.closeApp();
    });

    modalContent.appendChild(messageText);
    modalContent.appendChild(okButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  });
});
