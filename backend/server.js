const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

console.log("Starting backend...");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/ping", (_req, res) => {
  console.log("GET /ping called");
  res.json({ message: "Hello World from Backend!" });
});

app.post("/send", (req, res) => {
  const { data } = req.body || {};
  console.log("POST /send payload:", req.body);

  if (!data) {
    return res.status(400).json({ error: "Missing 'data' in request body" });
  }

  res.json({ reply: `Backend received: ${data}` });
});

const server = app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server failed to start:", err);
});

module.exports = app;
