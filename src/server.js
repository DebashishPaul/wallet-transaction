import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import cronJob from "./config/cron.js";

config();

const app = express();

// cron job
if (process.env.NODE_ENV === "production") cronJob.start();

// middleware
app.use(ratelimiter);
app.use(cors());
app.use(express.json());

// middleware
app.use((req, res, next) => {
  console.log("Request received", req.method, req.url);
  next();
});

const port = process.env.PORT || 3000;

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/transaction", transactionRoutes);

initDB().then(() => {
  app.listen(port, () => console.log(`Server running on port now ${port}`));
});
