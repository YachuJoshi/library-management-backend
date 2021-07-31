import { pool } from "../db";

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM student");
    if (rows.length > 0) {
      return res.status(200).json(rows);
    }
    return res.status(404).send("Not Found");
  } catch (e) {
    throw new Error(e);
  }
};

// Get student by id
const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM student WHERE student_id = $1",
      [id]
    );
    if (rows.length > 0) {
      return res.status(200).json(rows[0]);
    }
    throw new Error("Student Not Found!");
  } catch (e) {
    throw new Error(e);
  }
};

// Get student book detail
const getStudentBookDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: books } = await pool.query(
      "SELECT * FROM student_book_detail WHERE student_id = $1",
      [id]
    );
    if (books.length > 0) {
      return res.status(200).json(books);
    }

    // No student or student has no book issued
    const { rows } = await pool.query(
      "SELECT * FROM student WHERE student_id = $1",
      [id]
    );
    if (rows.length > 0) {
      // Student has no books
      return res.status(200).json([]);
    }
    throw new Error("Student Not Found!");
  } catch (e) {
    throw new Error(e);
  }
};

export { getAllStudents, getStudentById, getStudentBookDetail };
