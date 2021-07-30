import express from "express";
import { getAllStudents, getStudentById } from "./student.queries";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getStudentById);

export default router;
