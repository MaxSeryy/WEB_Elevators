const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let systemState = {
  temperature: 22.5,
  humidity: 46,
  relayStatus: false,
  elevatorLoad: 32,
  updatedAt: new Date().toISOString(),
};

let currentSettings = {
  targetTemperature: 23,
  relayMode: "auto",
  updateIntervalSec: 5,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function emulateSensors() {
  const tempDelta = (Math.random() * 1.2 - 0.6);
  const humidityDelta = (Math.random() * 4 - 2);
  const loadDelta = (Math.random() * 10 - 5);

  systemState.temperature = Number(clamp(systemState.temperature + tempDelta, 18, 30).toFixed(1));
  systemState.humidity = Math.round(clamp(systemState.humidity + humidityDelta, 25, 80));
  systemState.elevatorLoad = Math.round(clamp(systemState.elevatorLoad + loadDelta, 0, 100));

  if (currentSettings.relayMode === "auto") {
    systemState.relayStatus = systemState.temperature > currentSettings.targetTemperature;
  } else {
    systemState.relayStatus = currentSettings.relayMode === "on";
  }

  systemState.updatedAt = new Date().toISOString();
}

setInterval(emulateSensors, 5000);

app.get("/api/status", (req, res) => {
  res.json({
    ok: true,
    status: systemState,
    settings: currentSettings,
  });
});

app.post("/api/settings", (req, res) => {
  const nextSettings = req.body || {};

  currentSettings = {
    ...currentSettings,
    ...nextSettings,
  };

  systemState.updatedAt = new Date().toISOString();

  res.json({
    ok: true,
    message: "Settings saved",
    settings: currentSettings,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
