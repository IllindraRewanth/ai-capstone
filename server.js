const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const settingsStore = {};

app.get("/api/settings", (req, res) => {
  res.json(settingsStore);
});

app.post("/api/settings", (req, res) => {
  settingsStore.displayName = req.body.displayName;
  settingsStore.email = req.body.email;
  settingsStore.notifications = req.body.notifications;
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
