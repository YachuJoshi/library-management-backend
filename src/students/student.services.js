import { pool } from "../db";

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

const fetchStudentByUserID = async (userID) => {
  const { rows: student } = await pool.query(
    "SELECT * FROM student WHERE user_id = $1",
    [userID]
  );
  return student[0];
};

const fetchAllStudentBooksRecord = async () => {
  const { rows: studentBooksRecord } = await pool.query(
    `SELECT * FROM student_book_detail`
  );
  return studentBooksRecord;
};

const fetchStudentBookIssueDetail = async (id) => {
  const { rows: studentBookIssueDetail } = await pool.query(
    `SELECT * FROM student_book_issue_detail WHERE student_id = $1`,
    [id]
  );
  return studentBookIssueDetail;
};

const fetchStudentLateFeeDetails = async (id) => {
  const { rows: studentFeeDetails } = await pool.query(
    `SELECT *
      FROM student_book_issue_detail AS t
      WHERE student_id = $1
      AND NOW()::DATE - t.issue_date > 40`,
    [id]
  );
  return studentFeeDetails;
};

const fetchStudentBookDetail = async (id) => {
  const { rows: books } = await pool.query(
    "SELECT * FROM student_book_detail WHERE student_id = $1",
    [id]
  );
  return books;
};

const createStudent = async (studentInfo, userID) => {
  if (!studentInfo) {
    return;
  }
  const { firstName, lastName, address, phoneNumber, rollNumber, email } =
    studentInfo;
  await pool.query(
    `INSERT INTO student(
    first_name,
    last_name,
    address,
    phone_no,
    roll_no,
    email,
    user_id
  )
  VALUES($1, $2, $3, $4, $5, $6, $7)`,
    [firstName, lastName, address, phoneNumber, rollNumber, email, userID]
  );
};

export {
  fetchAllStudents,
  fetchStudentById,
  fetchStudentByUserID,
  fetchStudentBookDetail,
  fetchAllStudentBooksRecord,
  fetchStudentBookIssueDetail,
  fetchStudentLateFeeDetails,
  createStudent,
};
