import express from "express";
import {
  CustomError,
  studentNotFoundError,
  wrongCredentialsError,
} from "../error";
import { login, refresh } from "./auth.services";

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

router.post("/refresh", async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401);
  }
  try {
    const { token } = await refresh(refreshToken);
    return res.status(200).json(token);
  } catch (e) {
    return next(e);
  }
});

export default router;
