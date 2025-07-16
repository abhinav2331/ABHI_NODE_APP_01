import express from "express";
import { addBlog, getBlog, editBlog, deletePost } from "../controllers/blog.js";


const router = express.Router();

router.post('/', addBlog);
router.get('/posts', getBlog);
router.post('/editpost', editBlog);
router.post('/deletepost', deletePost);

export default router;