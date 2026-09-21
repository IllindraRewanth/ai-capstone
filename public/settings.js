const form = document.getElementById("settingsForm");
const formStatus = document.getElementById("formStatus");
const saveButton = document.getElementById("saveButton");

const fieldIds = ["displayName", "email"];

function setFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (message) {
    input.setAttribute("aria-invalid", "true");
    errorEl.textContent = message;
    errorEl.hidden = false;
  } else {
    input.removeAttribute("aria-invalid");
    errorEl.textContent = "";
    errorEl.hidden = true;
  }
}

function clearFieldErrors() {
  fieldIds.forEach((id) => setFieldError(id, ""));
  formStatus.textContent = "";
  formStatus.className = "form-status";
}

function showFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}

async function loadSettings() {
  const response = await fetch("/api/settings");
  if (!response.ok) return;
  const data = await response.json();
  document.getElementById("displayName").value = data.displayName ?? "";
  document.getElementById("email").value = data.email ?? "";
  document.getElementById("notifications").checked = Boolean(data.notifications);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFieldErrors();
  saveButton.disabled = true;

  const payload = {
    displayName: document.getElementById("displayName").value,
    email: document.getElementById("email").value,
    notifications: document.getElementById("notifications").checked,
  };

  try {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const fieldErrors = data.fieldErrors ?? {};
      fieldIds.forEach((id) => {
        const messages = fieldErrors[id];
        if (messages?.length) setFieldError(id, messages[0]);
      });
      showFormStatus(data.error ?? "Could not save settings.", "error");
      return;
    }

    showFormStatus("Settings saved.", "success");
  } catch {
    showFormStatus("Network error. Try again.", "error");
  } finally {
    saveButton.disabled = false;
  }
});

loadSettings();
