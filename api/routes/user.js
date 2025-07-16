import express from "express";
import { getUsers, addUser, updateUser, deleteUser, loginUser } from "../controllers/user.js";

const router = express.Router();

router.get('/', getUsers);
router.post('/adduser', addUser);
router.post('/updateuser', updateUser);
router.post('/deleteuser', deleteUser);
router.post('/login', loginUser);

export default router;