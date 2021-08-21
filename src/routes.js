import express from "express";
import { studentRoutes } from "./students";
import { booksRoutes } from "./books";
import { authRoutes } from "./auth";
import { adminRoutes } from "./admin";
import { userRoutes } from "./users";

const router = express.Router();

router.use("/students", studentRoutes);
router.use("/books", booksRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);

export default router;
