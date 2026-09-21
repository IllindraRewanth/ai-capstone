const express = require("express");
const path = require("path");
const { parseSettingsPayload } = require("./src/settingsSchema");
const { getSettings, saveSettings } = require("./src/settingsStore");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/api/settings", (req, res) => {
  res.json(getSettings());
});

app.post("/api/settings", (req, res) => {
  const result = parseSettingsPayload(req.body);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return res.status(400).json({
      error: "Validation failed",
      fieldErrors,
    });
  }

  const saved = saveSettings(result.data);
  res.json({ ok: true, settings: saved });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
