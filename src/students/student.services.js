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

const fetchStudentBookDetail = async (id) => {
  const { rows: books } = await pool.query(
    "SELECT * FROM student_book_detail WHERE student_id = $1",
    [id]
  );
  return books;
};

const studentNotFoundError = new Error("Student Not Found!");

export {
  fetchAllStudents,
  fetchStudentById,
  fetchStudentBookDetail,
  studentNotFoundError,
};
