import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

import authenticateUser from "./middlewares/authenticateUser.js";

// ⚠️⚠️⚠️ Note ⚠️⚠️⚠️
// If you're a developer viewing this code in my repository, please make sure to create your own .env file with the necessary environment variables as it is not provided in this repository.

// env variables configuration
dotenv.config();

// App Configuration
const PORT = parseInt(process.env.PORT, 10) || 3001;
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configurations
const allowedOrigins = [
  "https://finance-tracker-dev.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3001",
  "http://localhost:3002",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS!"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin)) {
    next();
  } else {
    res.status(404).json({ error: "Blocked by cors!" });
    return;
  }
});

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incomes", authenticateUser, incomeRoutes);
app.use("/api/v1/expenses", authenticateUser, expenseRoutes);

// Start Server
const startServer = async (port) => {
  try {
    await connectDB();

    const server = app.listen(port, () => {
      console.log(`Server started on PORT ${port}!`);
    });

    // Handle port-in-use error gracefully — retry on next port
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(
          `⚠️  Port ${port} is already in use. Trying port ${port + 1}...`
        );
        server.close();
        startServer(port + 1);
      } else {
        console.error(`Server error: ${err.message}`);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error(`Error in starting the server: ${error.message}`);
    process.exit(1);
  }
};

// Catch any unhandled promise rejections to prevent nodemon from crashing
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

startServer(PORT);
