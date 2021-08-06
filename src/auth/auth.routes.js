import express from "express";
import {
  CustomError,
  studentNotFoundError,
  wrongCredentialsError,
} from "../error";
import { login } from "./auth.services";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const data = await login(username, password);
    return res.json(data);
  } catch (e) {
    if (e === studentNotFoundError) {
      return next(
        new CustomError({
          code: 404,
          message: e.message,
        })
      );
    }
    if (e === wrongCredentialsError) {
      return next(
        new CustomError({
          code: 400,
          message: e.message || "Bad Request",
        })
      );
    }
    return next(e);
  }
});

export default router;
