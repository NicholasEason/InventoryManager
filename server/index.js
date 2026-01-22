require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({
    origin: CORS_ORIGIN
}));
app.use(express.json());

app.get("/api/ping", (req, res) => {
  res.send("pong");
});

const PORT = process.env.API_PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});