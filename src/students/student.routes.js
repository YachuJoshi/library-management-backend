import express from "express";
import {
  getAllStudents,
  getStudentById,
  getStudentBookDetail,
} from "./student.queries";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.get("/:id/books", getStudentBookDetail);

export default router;
