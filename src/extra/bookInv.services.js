import { pool } from "../db";

const createBookInventory = async (isbn) => {
  await pool.query("INSERT INTO book_inventory(isbn) VALUES ($1)", [isbn]);
};

export { createBookInventory };
