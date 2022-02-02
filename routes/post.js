import { Router } from "express";
import Post from '../controllers/Post.js';

const router = Router();

router.post('/share-post', Post.sharePost);

export default router;