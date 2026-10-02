const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const log = document.getElementById("chat-log");
function appendMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  

  input.value = "";
  input.disabled = true;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      appendMessage("assistant", `Error: ${err.error || res.statusText}`);
      return;
    }

    const data = await res.json();
    appendMessage("assistant", data.reply);
    const tokenDiv = document.createElement("div");
    tokenDiv.textContent = `Token count: ${data.token_count}`;
    log.appendChild(tokenDiv);

    // TODO (HW1, "token-count display"): if you pick this feature,
    // read a token count from data (once the backend returns one)
    // and render it somewhere in the UI.
  } catch (e) {
    appendMessage("assistant", `Error: ${e.message}`);
  } finally {
    input.disabled = false;
    input.focus();
  }
});

const clearButton = document.getElementById("clear-button");

clearButton.addEventListener("click", () => {
  log.innerHTML = "";
  input.value = "";
  input.focus();
});