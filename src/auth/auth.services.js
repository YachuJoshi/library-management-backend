import { pool } from "../db";
import { ROLES } from "../constants";
import { fetchStudentByUserID } from "../students/student.services";
import { fetchAdminByUserID } from "../admin/admin.services";
import { compareHashed, generateAuthToken, verifyRefreshToken } from "../utils";
import { entityNotFoundError, wrongCredentialsError } from "../error";

const login = async (username, password) => {
  let userDetails;
  const { rows: user } = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (user.length <= 0) {
    throw entityNotFoundError;
  }
  const { user_id: userID, role, password: passwordInDB } = user[0];
  const matchPassword = await compareHashed(password, passwordInDB);

  if (!matchPassword) {
    throw wrongCredentialsError;
  }

  if (+role === ROLES.STUDENT) {
    userDetails = await fetchStudentByUserID(userID);
  }
  if (+role === ROLES.ADMIN) {
    userDetails = await fetchAdminByUserID(userID);
  }
  const token = generateAuthToken(userDetails);
  return { token };
};

const refresh = async (refreshToken) => {
  const { data } = verifyRefreshToken(refreshToken);
  const token = generateAuthToken(data);
  return { token };
};

export { login, refresh };
