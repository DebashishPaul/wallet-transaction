import { sql } from "../config/db.js";

export const getTransactions = async (req, res) => {
  try {
    const result =
      await sql`SELECT * FROM transactions order by created_at desc`;
    res.status(200).json(result);
  } catch (error) {
    console.log("Failed to get transactions", error);
    res.status(500).json({ message: "Failed to get transactions" });
  }
};

export const getTransactionsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await sql`
            SELECT * FROM transactions WHERE user_id = ${user_id} order by created_at desc
          `;
    res.status(200).json(result);
  } catch (error) {
    console.log("Failed to get transactions", error);
    res.status(500).json({ message: "Failed to get transactions" });
  }
};

export const getTransactionsSummaryByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${user_id}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${user_id} AND type = 'income'
    `;

    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${user_id} AND type = 'expense'
    `;

    const result = {
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    };

    res.status(200).json(result);
  } catch (error) {
    console.log("Failed to get transactions", error);
    res.status(500).json({ message: "Failed to get transactions" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { user_id, name, amount, type, category } = req.body;

    if (!user_id || !name || !amount || !type || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await sql`
      INSERT INTO transactions (user_id, name, amount, type, category)
      VALUES (${user_id}, ${name}, ${amount}, ${type}, ${category})
      RETURNING *
    `;
    console.log(result);
    res.status(201).json(result[0]);
  } catch (error) {
    console.log("Failed to add transaction", error);
    res.status(500).json({ message: "Failed to add transaction" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;
    console.log(result, "result");
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Failed to delete transaction", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, type, category } = req.body;

    if (!id || !name || !amount || !type || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await sql`
      UPDATE transactions
      SET name = ${name}, amount = ${amount}, type = ${type}, category = ${category}
      WHERE id = ${id}
      RETURNING *
    `;
    console.log(result);
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.log("Failed to update transaction", error);
    res.status(500).json({ message: "Failed to update transaction" });
  }
};
