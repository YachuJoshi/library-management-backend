import express from "express";
import { ROLES } from "../constants";
import { createUser } from "../users";
import { fetchAllAdmins, createAdmin } from "./admin.services";
import { authenticate, authRole } from "../auth";

const router = express.Router();

router.get("/", authenticate, authRole(ROLES.ADMIN), async (req, res, next) => {
  try {
    const admins = await fetchAllAdmins();
    return res.status(200).json(admins);
  } catch (e) {
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  const userDetails = req.body;
  const { username, password, role, ...adminInfo } = userDetails;

  try {
    const { user_id: userID } = await createUser(username, password, +role);
    await createAdmin(adminInfo, userID);
    return res.status(200).send("Admin Created Successfully");
  } catch (e) {
    return next(e);
  }
});

export default router;
