import express from 'express';
import { login } from '../controllers/userController';
import checkAuth from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', login);

// router.get('/admins', checkAuth, getAllAdmins);

export default router;
