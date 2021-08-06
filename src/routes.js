import express from "express";
import { studentRoutes } from "./students";
import { booksRoutes } from "./books";
import { authRoutes } from "./auth";

const router = express.Router();

router.use("/students", studentRoutes);
router.use("/books", booksRoutes);
router.use("/auth", authRoutes);

export default router;
