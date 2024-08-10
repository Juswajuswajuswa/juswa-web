import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addPost, deletePost, deletePosts, editPost, getPost, getPosts, getUserPosts } from "../controllers/post.controller.js";

const router = express.Router()

// adding post
router.post(`/`, verifyToken, addPost)
// get all post
router.get(`/get`, getPosts)
// get specific post from user
router.get(`/get/:id`, getPost)
// delete specific post from user
router.delete(`/delete/:postId`, verifyToken ,deletePost)
// delete all post
router.delete(`/delete`, deletePosts)
// edit post
router.put(`/edit/:id`, verifyToken, editPost)
// get posts by user 
router.get(`/user/:userId/posts`, verifyToken, getUserPosts)

export default router