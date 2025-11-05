import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path"
import cartRouter from "./routes/cart.route.js"


dotenv.config();

mongoose
.connect(process.env.MONGO)
.then(() => {
  console.log("Connected to MongoDB!!");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

const __dirname = path.resolve();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/listing', listingRouter);


// Serve static files
app.use(express.static(path.join(__dirname, '/client/dist')));

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

// Wildcard route handler - must be last (serves index.html for client-side routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Start server
app.listen(3000, () => {
  console.log(`Server is running on port 3000!`);
});