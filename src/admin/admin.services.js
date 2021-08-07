import { pool } from "../db";

const fetchAdminByUserID = (userID) => {
  const { rows: admin } = pool.query("SELECT * FROM admin WHERE user_id = $1", [
    userID,
  ]);
  return admin;
};

export { fetchAdminByUserID };
