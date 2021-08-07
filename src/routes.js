import express from "express";
import { studentRoutes } from "./students";
import { booksRoutes } from "./books";
import { authRoutes } from "./auth";
import { adminRoutes } from "./admin";

const router = express.Router();

router.use("/students", studentRoutes);
router.use("/books", booksRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

export default router;
