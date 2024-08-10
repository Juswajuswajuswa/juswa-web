import express from "express";

import { getUser, googleLogin, login, register, signout } from "../controllers/auth.controller.js";

const router = express.Router();

router.get(`/user`, getUser)
router.post('/register', register)
router.post('/login', login)
router.post('/google', googleLogin)
router.post('/signout', signout)

export default router;
