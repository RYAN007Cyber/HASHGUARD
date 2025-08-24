const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const LOGS_DIR = "C:/integrity";

app.get("/api/hash/current", (req, res) => {
  try {
    const currentHash = fs
      .readFileSync(path.join(LOGS_DIR, "final_hash.txt"), "utf-8")
      .trim();
    res.json({ currentHash });
  } catch (error) {
    res.status(500).json({ error: "Failed to read current hash" });
  }
});

app.get("/api/logs/intrusion", (req, res) => {
  try {
    const logPath = path.join(LOGS_DIR, "intrusion_log.txt");
    if (!fs.existsSync(logPath)) {
      return res.json([]);
    }

    const logContent = fs.readFileSync(logPath, "utf-8");
    const logs = logContent
      .trim()
      .split("\n\n")
      .map((entry) => {
        const lines = entry.split("\n");
        return {
          event: lines[0],
          timestamp: new Date().toISOString(), // You should parse the actual timestamp from the log
          details: lines.slice(1).join("\n"),
        };
      });

    res.json(logs.reverse()); // Show most recent first
  } catch (error) {
    res.status(500).json({ error: "Failed to read intrusion logs" });
  }
});

app.get("/api/logs/blocked", (req, res) => {
  try {
    const logPath = path.join(LOGS_DIR, "block_log.txt");
    if (!fs.existsSync(logPath)) {
      return res.json([]);
    }

    const logContent = fs.readFileSync(logPath, "utf-8");
    const blocks = logContent
      .trim()
      .split("\n\n")
      .map((entry) => {
        const lines = entry.split("\n");
        return {
          action: lines[0],
          timestamp: new Date(
            lines.find((l) => l.startsWith("Time:")).split("Time: ")[1]
          ),
          details: lines.filter((l) => !l.startsWith("Time:")).join("\n"),
        };
      });

    res.json(blocks.reverse()); // Show most recent first
  } catch (error) {
    res.status(500).json({ error: "Failed to read block logs" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
