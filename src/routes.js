import express from "express";
import { studentRoutes } from "./students";
import { booksRoutes } from "./books";

const router = express.Router();

router.use("/students", studentRoutes);
router.use("/books", booksRoutes);

export default router;
