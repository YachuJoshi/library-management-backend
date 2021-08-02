import express from "express";
import {
  fetchAllStudents,
  fetchStudentById,
  fetchStudentBookDetail,
} from "./student.services";
import { CustomError } from "../error";

const router = express.Router();

router.get("/", async (_, res, next) => {
  try {
    const students = await fetchAllStudents();
    try {
      return res.status(200).json(students);
    } catch {
      return next(
        new CustomError({
          code: 404,
          message: "Student Not Found!",
        })
      );
    }
  } catch (e) {
    return next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const student = await fetchStudentById(id);
    if (student) {
      return res.status(200).json(student);
    }
    return next(
      new CustomError({
        code: 404,
        message: "Student Not Found!",
      })
    );
  } catch (e) {
    return next(e);
  }
});

router.get("/:id/books", async (req, res, next) => {
  const { id } = req.params;
  try {
    const studentBooksRecord = await fetchStudentBookDetail(id);
    if (studentBooksRecord.length > 0) {
      return res.status(200).json(studentBooksRecord);
    }

    // No student or student has no book
    const student = await fetchStudentById(id);
    if (student) {
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
    return next(e);
  }
});

export default router;
