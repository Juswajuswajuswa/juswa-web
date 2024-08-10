import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getUsers, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post(`/update/:id`, verifyToken, updateUser);
router.get(`/get`, getUsers);


export default router;
