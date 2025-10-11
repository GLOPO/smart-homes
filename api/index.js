import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = 3001

app.use(express.json());  // Add this line before routes
app.use(cookieParser());

app.use('/api/users', userRouter);

app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})


mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

