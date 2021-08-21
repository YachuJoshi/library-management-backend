import { pool } from "../db";
import { encrypt } from "../utils";

export const createUser = async (username, password, role) => {
  const hashedPassword = await encrypt(password);
  const { rows: user } = await pool.query(
    `INSERT INTO users(
      username, password, role
    )
    VALUES ($1, $2, $3)
    RETURNING user_id`,
    [username, hashedPassword, role]
  );
  return user[0];
};

export const getUserByID = async (id) => {
  const { rows: user } = await pool.query(
    `SELECT * FROM users WHERE user_id = $1`,
    [id]
  );
  return user[0];
};
