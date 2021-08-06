import { pool } from "../db";
import { encrypt } from "../utils";

const fetchAllStudents = async () => {
  const { rows: students } = await pool.query("SELECT * FROM student");
  return students;
};

const fetchStudentById = async (id) => {
  const { rows: student } = await pool.query(
    "SELECT * FROM student WHERE student_id = $1",
    [id]
  );
  return student[0];
};

const fetchStudentBookDetail = async (id) => {
  const { rows: books } = await pool.query(
    "SELECT * FROM student_book_detail WHERE student_id = $1",
    [id]
  );
  return books;
};

const createStudent = async (studentInfo) => {
  if (!studentInfo) {
    return;
  }
  const {
    first_name: firstName,
    last_name: lastName,
    address,
    phone_no: phoneNo,
    roll_no: rollNo,
    email,
    username,
    password,
  } = studentInfo;
  const hashedPassword = await encrypt(password);
  await pool.query(
    `INSERT INTO student(
    first_name,
    last_name,
    address,
    phone_no,
    roll_no,
    email,
    username,
    password
  )
  VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      firstName,
      lastName,
      address,
      phoneNo,
      rollNo,
      email,
      username,
      hashedPassword,
    ]
  );
};

export {
  fetchAllStudents,
  fetchStudentById,
  fetchStudentBookDetail,
  createStudent,
};
