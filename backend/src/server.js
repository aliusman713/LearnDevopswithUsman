const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const pool = require("./config/database");

const app = express();

const PORT = process.env.PORT || 5100;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to LearnDevopswithUsman API",
    status: "running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "backend",
  });
});

app.get("/api/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "healthy",
      database: "connected",
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
    });
  }
});

app.listen(PORT, () => {
  console.log(`LearnDevopswithUsman API running on port ${PORT}`);
});
