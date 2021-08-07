import express from "express";
import {
  fetchAllStudents,
  fetchStudentById,
  fetchStudentBookDetail,
  createStudent,
} from "./student.services";
import { authenticate } from "../auth";
import { CustomError, studentNotFoundError } from "../error";

const router = express.Router();

router.get("/", async (_, res, next) => {
  try {
    const students = await fetchAllStudents();
    return res.status(200).json(students);
  } catch (e) {
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  const studentInfo = req.body;
  try {
    createStudent(studentInfo);
    return res.status(201);
  } catch (e) {
    return next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const student = await fetchStudentById(id);
    if (!student) {
      throw studentNotFoundError;
    }
    return res.status(200).json(student);
  } catch (e) {
    if (e === studentNotFoundError) {
      return next(
        new CustomError({
          code: 404,
          message: e.message || "Student Not Found!",
        })
      );
    }
    return next(e);
  }
});

router.get("/:id/books", authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { student_id: loggedInStudentID } = res.data;

  if (id !== loggedInStudentID) {
    return next(
      new CustomError({
        code: 403,
        message: "Forbidden",
      })
    );
  }

  try {
    const studentBooksRecord = await fetchStudentBookDetail(id);
    if (studentBooksRecord.length > 0) {
      return res.status(200).json(studentBooksRecord);
    }

    // No student or student has no book
    const student = await fetchStudentById(id);

    // No student
    if (!student) {
      throw studentNotFoundError;
    }
    return res.status(200).json([]);
  } catch (e) {
    if (e === studentNotFoundError) {
      return next(
        new CustomError({
          code: 404,
          message: e.message || "Student Not Found!",
        })
      );
    }
    return next(e);
  }
});

export default router;
