require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { sequelize } = require("./models");
const indexRouter = require("./routes/index");
const { initializeSocket, sendNotification } = require("./config/socket");
const reviewRoutes = require("./routes/reviewRoutes");




const app = express();



const allowedOrigins = (process.env.CORS_ORIGINS || "").split(","); // Read comma-separated origins from .env
console.log("Allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Block the request
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/reviews", reviewRoutes);



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
