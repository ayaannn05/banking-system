import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import customerRouter from "./routes/customer.routes.js";
import bankerRouter from "./routes/banker.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://banking-system-1-zc2l.onrender.com/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// routes
app.use("/api/auth", authRouter);
app.use("/api/customer", customerRouter);
app.use("/api/banker", bankerRouter);

// connect DB and then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
  });
