import { pool } from "../db";
import { compareHashed, generateAuthToken } from "../utils";
import { studentNotFoundError, wrongCredentialsError } from "../error";

const login = async (username, password) => {
  const { rows: student } = await pool.query(
    "SELECT * FROM student WHERE username = $1",
    [username]
  );
  if (student.length <= 0) {
    throw studentNotFoundError;
  }
  const { password: passwordInDB } = student[0];
  const matchPassword = await compareHashed(password, passwordInDB);

  if (!matchPassword) {
    throw wrongCredentialsError;
  }

  const token = generateAuthToken(student);

  return { token, student };
};

export { login };
