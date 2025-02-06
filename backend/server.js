require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { sequelize } = require("./models");
const indexRouter = require("./routes/index");
const { initializeSocket, sendNotification } = require("./config/socket");
const reviewRoutes = require("./routes/reviewRoutes");



const app = express();


// Enable CORS for frontend
app.use(
  cors({
    origin: "*", // Allow access from all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/reviews", reviewRoutes);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-eval'");
  next();
});

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);
app.set("io", io);

// Use API routes
app.use("/api", indexRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await sequelize.query('SELECT 1+1 AS result');
    res.status(200).json({ status: 'success', result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Database connection & synchronization
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to MySQL database.");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("Database synchronized.");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).send("Something broke!");
});


// Export for testing & external usage
module.exports = { app, io, sendNotification };
