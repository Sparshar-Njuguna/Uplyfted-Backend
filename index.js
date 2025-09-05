// Load environment variables from a .env file as early as possible
import dotenv from "dotenv";
dotenv.config();

// Import required packages
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import your routes
import authRoutes from "./server/routes/auth.js";

// Create an Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Define the port
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Check if the MONGO_URI is defined
if (!MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// A simple route to test that the API is running
app.get("/", (req, res) => {
  res.send("API is running... 🚀");
});
;
