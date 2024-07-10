import express from 'express';
import { login, createAdmin } from '../controllers/userController';
import checkAuth, {checkSuperAdmin} from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', login);

router.get('/create-admin', checkSuperAdmin, createAdmin);

export default router;
