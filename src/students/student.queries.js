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
    throw new Error("Student not found!");
  } catch (e) {
    throw new Error(e);
  }
};

export { getAllStudents, getStudentById };
