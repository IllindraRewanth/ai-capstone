let settings = {
  displayName: "",
  email: "",
  notifications: false,
};

function getSettings() {
  return { ...settings };
}

function saveSettings(next) {
  settings = { ...next };
  return getSettings();
}

function resetSettings() {
  settings = { displayName: "", email: "", notifications: false };
}

module.exports = { getSettings, saveSettings, resetSettings };
