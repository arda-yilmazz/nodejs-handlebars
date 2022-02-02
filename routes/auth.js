import { Router } from "express";
import Auth from '../controllers/Auth.js';

const router = Router();

router.post('/register', Auth.register);

router.post('/login', Auth.login);

router.get('/logout', Auth.logout);

export default router;