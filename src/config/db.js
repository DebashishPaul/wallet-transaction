import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// create a sql connection to the database
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        type VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Database initialization failed", error);
    process.exit(1); // 1 means error 0 means success
  }
}
