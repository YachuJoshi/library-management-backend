import express from "express";
import { studentRoutes } from "./students";

const router = express.Router();

router.use("/students", studentRoutes);

export default router;
