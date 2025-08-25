import express from "express";
const router = express.Router();
import {
  getTransactions,
  getTransactionsSummaryByUserId,
  getTransactionsByUserId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionControllers.js";

router.get("/", getTransactions);

router.get("/:user_id", getTransactionsByUserId);

router.get("/summary/:user_id", getTransactionsSummaryByUserId);

router.post("/", createTransaction);

router.put("/:id", updateTransaction);

router.delete("/:id", deleteTransaction);

export default router;
