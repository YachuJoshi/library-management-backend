import { pool } from "../db";

const fetchAllAdmins = async () => {
  const { rows: admins } = await pool.query("SELECT * FROM admin");
  return admins;
};

const fetchAdminByUserID = async (userID) => {
  const { rows: admin } = await pool.query(
    "SELECT * FROM admin WHERE user_id = $1",
    [userID]
  );
  return admin[0];
};

const createAdmin = async (adminInfo, userID) => {
  if (!adminInfo) {
    return;
  }
  const {
    first_name: firstName,
    last_name: lastName,
    address,
    phone_no: phoneNo,
    email,
  } = adminInfo;
  await pool.query(
    `INSERT INTO admin(
    first_name,
    last_name,
    address,
    phone_no,
    email,
    user_id
  )
  VALUES($1, $2, $3, $4, $5, $6)`,
    [firstName, lastName, address, phoneNo, email, userID]
  );
};

export { fetchAllAdmins, fetchAdminByUserID, createAdmin };
