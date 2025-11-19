const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
//const mongoose = require("mongoose");

// Replace with your Compass connection string
//const mongoURL = "mongodb://localhost:27017/temp";

// mongoose.connect(mongoURL)
//   .then(() => console.log("MongoDB Connected Successfully"))
//   .catch(err => console.log("MongoDB Connection Error:", err));


const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/travelai";

console.log("Starting backend...");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using mongoose
mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB connected:", MONGO_URL))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));

// Test DB Route
app.get("/test-db", async (req, res) => {
  try {
    const admin = new mongoose.mongo.Admin(mongoose.connection.db);
    const info = await admin.buildInfo();
    res.json({
      status: "Mongo Connected",
      info,
    });
  } catch (err) {
    res.status(500).json({
      status: "Mongo Not Connected",
      error: err.message,
    });
  }
});


app.get("/ping", (_req, res) => {
  console.log("GET /ping called");
  res.json({ message: "Hello World from Backend!" });
});

const Message = require("./models/Message");

app.post("/send", async (req, res) => {
  const { data } = req.body || {};
  console.log("POST /send payload:", req.body);

  if (!data) {
    return res.status(400).json({ error: "Missing 'data' in request body" });
  }

  try {
    const doc = await Message.create({ data });
    res.json({
      reply: `Backend received: ${data}`,
      saved: true,
      id: doc._id,
    });
  } catch (err) {
    console.error("Error saving message to DB:", err);
    // still send the original reply but mark saved false
    res.status(500).json({ reply: `Backend received: ${data}`, saved: false, error: err.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server failed to start:", err);
});

module.exports = app;

