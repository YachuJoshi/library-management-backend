import express from "express";
import { ROLES } from "../constants";
import { fetchAdminByUserID } from "../admin";
import { fetchStudentByUserID } from "../students";
import { getUserByID } from "./users.services";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const { userId } = req.query;

  try {
    let user;
    const { user_id: _userId, role } = await getUserByID(userId);
    if (+role === ROLES.ADMIN) {
      user = await fetchAdminByUserID(_userId);
    }
    if (+role === ROLES.STUDENT) {
      user = await fetchStudentByUserID(_userId);
    }
    return res.status(200).json(user);
  } catch (e) {
    return next(e);
  }
});

export default router;
