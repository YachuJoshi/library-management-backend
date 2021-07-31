import { pool } from "../db";
import { CustomError } from "../error";

// Get all students
const getAllStudents = async (_, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM student");
    if (rows.length > 0) {
      return res.status(200).json(rows);
    }
    return next(
      new CustomError({
        code: 404,
        message: "Student Not Found!",
      })
    );
  } catch (e) {
    return next({});
  }
};

// Get student by id
const getStudentById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM student WHERE student_id = $1",
      [id]
    );
    if (rows.length > 0) {
      return res.status(200).json(rows[0]);
    }
    return next(
      new CustomError({
        code: 404,
        message: "Student Not Found!",
      })
    );
  } catch (e) {
    console.log("HERE");
    return next({});
  }
};

// Get student book detail
const getStudentBookDetail = async (req, res, next) => {
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
    return next(
      new CustomError({
        code: 404,
        message: "Student Not Found!",
      })
    );
  } catch (e) {
    return next({});
  }
};

export { getAllStudents, getStudentById, getStudentBookDetail };
