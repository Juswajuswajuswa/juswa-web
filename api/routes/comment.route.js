import express from "express";
import { createComment, deleteAllComment, deleteComment, getComments } from "../controllers/comment.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router = express.Router()

// route to create a comment
router.post(`/:postId/comment`, verifyToken ,createComment)
// delete all comments
router.delete(`/comment/delete`, deleteAllComment)
// delete spcific comments from post
router.delete(`/comment/:commentId`, verifyToken, deleteComment)
// get all comments from specific post
router.get(`/:postId/comment`, getComments)

export default router